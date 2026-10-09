// 2.79" 142×428 NV3007 bar module (TZT / ShengYang "2.79TFT-SPI"),
// reference model for fit checks. Dimensions from the seller drawing in
// hardware/libs/datasheets/display/2.79/specs-outline-drawing.png:
//   PCB 25.9 × 78.0 × 1.2; backlight frame 24.38 × 69.43 (top 4.06 below
//   the PCB top edge); TFT glass 23.08 × 67.89; active area 21.28 × 64.14;
//   BL + TFT 2.00 thick on 3M tape; 6.00 max overall; 8 × 2.54 header
//   row 1.65 below the top edge, centred, GND on the left; 2 × Ø2.5 holes
//   20.0 apart, 1.91 above the bottom edge.
// Header holes Ø1 (back view of the drawing). Not dimensioned, assumed:
// tape 0.2, glass/AA centred in the backlight frame, mounting pads Ø3.4
// (must stay inside the 1.91 to the edge). Back-side parts placed from
// photo-front-back.png and the drawing's back view, ±1 mm; heights are
// typical package heights, the tallest (FPC socket) kept within the
// 6.00 max (6.00 − 2.00 − 0.2 − 1.2 = 2.6).
//
// Origin: centre of the module PCB, z = 0 on the PCB back face (header
// side), +Z towards the viewer, +Y towards the header edge (portrait, as
// drawn). Rotate 90° about Z for landscape.

import { part, param, sketch, extrude, cut, plane, color, circle, text } from 'fluidcad/core';
import { rect } from 'fluidcad/shapes';

const BLUE = '#1f4fa3', SILK = '#f4f4f4', PAD = '#d9d9d9', BLACK = '#111111';

export const display279 = part('Display 2.79in', () => {
  const header = param('Male header', true, 'checkbox');
  const backParts = param('Back-side parts', true, 'checkbox');
  const back = param('Back-side keep-out block', false, 'checkbox');

  const pcbW = 25.9, pcbH = 78.0, pcbT = 1.2;
  const top = pcbH / 2;
  const tape = 0.2, lcmT = 2.0;
  const bl = { w: 24.38, h: 69.43, top: top - 4.06 };
  const glass = { w: 23.08, h: 67.89 };
  const aa = { w: 21.28, h: 64.14 };
  const blCy = bl.top - bl.h / 2;
  const holeX = 10.0, holeY = -top + 1.91;
  const pitch = 2.54, pins = 8;
  const pinY = top - 1.65;
  const pinX = (i) => (i - (pins - 1) / 2) * pitch;
  const labels = ['GND', 'VDD', 'SCL', 'SDA', 'RES', 'DC', 'CS', 'BL'];
  const backT = 6.0 - lcmT - tape - pcbT;          // 2.6

  // module PCB with the two mounting holes and the header holes
  sketch('xy', () => { rect([0, 0], pcbW, pcbH).centered(); });
  extrude(pcbT);
  sketch(plane('xy', pcbT), () => {
    for (const sx of [-1, 1]) circle([sx * holeX, holeY], 2.5);
    for (let i = 0; i < pins; i++) circle([pinX(i), pinY], 1.0);
  });
  cut(pcbT);
  color(BLUE);                                     // only the PCB exists so far

  // pads, front and back
  for (const z of [pcbT, -0.03]) {
    sketch(plane('xy', z), () => {
      for (const sx of [-1, 1]) { circle([sx * holeX, holeY], 3.4); circle([sx * holeX, holeY], 2.5); }
      rect([pinX(0), pinY], 1.7, 1.7).centered();
      circle([pinX(0), pinY], 1.0);
      for (let i = 1; i < pins; i++) { circle([pinX(i), pinY], 1.7); circle([pinX(i), pinY], 1.0); }
    });
    color(PAD, extrude(0.03).new());
  }

  // pin names between the header and the panel
  sketch(plane('xy', pcbT), () => {
    labels.forEach((l, i) => text(l).size(0.7).bold().align('center').at([pinX(i), pinY - 2.2]));
  });
  color(SILK, extrude(0.02).new());

  // 3M tape, backlight + TFT stack, active area skin
  sketch(plane('xy', pcbT), () => { rect([0, blCy], bl.w, bl.h).centered(); });
  color('#9a9a9a', extrude(tape).new());
  sketch(plane('xy', pcbT + tape), () => { rect([0, blCy], bl.w, bl.h).centered(); });
  color('#d8d8d8', extrude(lcmT - 0.3).new());     // white backlight frame
  sketch(plane('xy', pcbT + tape + lcmT - 0.3), () => { rect([0, blCy], glass.w, glass.h).centered(); });
  color(BLACK, extrude(0.3).new());                // glass
  sketch(plane('xy', pcbT + tape + lcmT), () => { rect([0, blCy], aa.w, aa.h).centered(); });
  color('#1b2433', extrude(0.02).new());

  // back-side parts, approximate (front-view x; y measured from the top edge)
  if (backParts) {
    const box = (x, d, w, h, t, c) => {
      sketch(plane('xy', -t), () => { rect([x, top - d], w, h).centered(); });
      color(c, extrude(t).new());
    };
    const CAP = '#b5865a', IC = '#1a1a1a', RES = '#2a2a2a';
    // power: U1 regulator (SOT-89-ish) between C1/C2 and C3/C4 (0805)
    box(0, 13.5, 4.5, 2.5, 1.5, IC);
    for (const x of [3.0, 5.0, -3.0, -5.0]) box(x, 13.0, 1.25, 2.0, 1.25, CAP);
    // backlight switch and reset: Q1 (SOT-23) with R1–R4, C5, D1 (0603)
    box(0.3, 22.0, 2.9, 1.3, 1.1, IC);
    for (const x of [5.4, 4.2, 3.0]) box(x, 22.0, 0.8, 1.6, 0.5, RES);
    for (const x of [-2.2, -3.4, -4.6]) box(x, 22.0, 0.8, 1.6, 0.6, RES);
    // panel flex through the slot, into the FPC socket
    box(0, 37.0, 8.5, 11.0, 0.15, '#d9952b');
    box(0, 45.0, 10.5, 5.0, 2.5, '#e8e2d0');
  }

  // optional flat keep-out over the whole back
  if (back) {
    sketch(plane('xy', -backT), () => { rect([0, 0], pcbW - 4, pcbH - 12).centered(); });
    color('#8a8a8a', extrude(backT).new());
  }

  // male header on the back (typical: 2.5 body, 6 below it, 1.0 above the PCB)
  if (header) {
    sketch(plane('xy', -2.5), () => { rect([0, pinY], pins * pitch, 2.5).centered(); });
    color(BLACK, extrude(2.5).new());
    sketch(plane('xy', -2.5 - 6.0), () => {
      for (let i = 0; i < pins; i++) rect([pinX(i), pinY], 0.64, 0.64).centered();
    });
    color('#d4af37', extrude(6.0 + 2.5 + pcbT + 1.0).new());
  }
});

// 1.54" 240×240 ST7789 module ("1.54TFT-SPI-ST7789 Ver:1.1", NOMEN_TEC V2.0
// family), reference model for fit checks. Outline from the seller drawing
// in hardware/libs/datasheets/display/ (see display.md there); silkscreen,
// pads and back-side parts from the product photo in the same folder — part
// positions are approximate (±0.5 mm).
//
// Side view (drawing): LCM 2.14 + bond layer 0.18 + PCB 1.2 = 3.52, plus
// 1.5 of SMD parts on the back = 5.02 overall. (The parameter table says
// 5.32; the drawing adds up, so 5.02 is used.)
//
// Origin: centre of the module PCB, z = 0 on the PCB back face (header
// side), +Z towards the viewer, +Y towards the header edge. "From the top
// edge" below means along −Y from the PCB edge at y = +21.85.

import { part, param, sketch, extrude, cut, plane, color, circle, text } from 'fluidcad/core';
import { rect } from 'fluidcad/shapes';

const BLUE = '#1f4fa3', SILK = '#f4f4f4', PAD = '#d9d9d9', BLACK = '#111111';

export const display154 = part('Display 1.54in', () => {
  const header = param('Male header', true, 'checkbox');
  const parts = param('Back-side parts', true, 'checkbox');
  const keepOut = param('SMD keep-out block', false, 'checkbox');

  const pcbW = 32.0, pcbH = 43.7, pcbT = 1.2;
  const top = pcbH / 2;
  const holeX = 27.0 / 2, holeY = top - 2.5;       // 4 × Ø2, 2.5 in from the edges
  const lcmW = 31.52, lcmH = 33.72, lcmT = 2.14;
  const bond = 3.52 - lcmT - pcbT;                 // 0.18
  const lcmTop = top - 5.0;                        // drawing "5"
  const aa = 27.72, aaTop = lcmTop - 1.45;         // drawing "(1.45)": panel edge → AA
  const pitch = 2.54, pins = 8;
  const pinY = top - 1.5;                          // drawing "1.5": top edge → pin-row centre
  const pinHole = 0.9;                             // drawing "Ø0.9"
  const pinX = (i) => (i - (pins - 1) / 2) * pitch; // centred row, pin 1 = GND on the left (front view)
  const labels = ['GND', 'VCC', 'SCL', 'SDA', 'RST', 'DC', 'CS', 'BL'];
  const smdT = 1.5;

  // module PCB with mounting and header holes
  sketch('xy', () => { rect([0, 0], pcbW, pcbH).centered(); });
  extrude(pcbT);
  sketch(plane('xy', pcbT), () => {
    for (const sx of [-1, 1]) for (const sy of [-1, 1]) circle([sx * holeX, sy * holeY], 2.0);
    for (let i = 0; i < pins; i++) circle([pinX(i), pinY], pinHole);
  });
  cut(pcbT);
  color(BLUE);                                     // only the PCB exists so far

  // pads (both faces): rings on the mounting holes, header pads, square pin 1
  for (const [pl, dir] of [[plane('xy', pcbT), 1], [plane('xy', -0.03), 1]]) {
    sketch(pl, () => {
      for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
        circle([sx * holeX, sy * holeY], 3.8);
        circle([sx * holeX, sy * holeY], 2.0);
      }
      rect([pinX(0), pinY], 1.7, 1.7).centered();       // pad size not drawn: from the photo
      circle([pinX(0), pinY], pinHole);
      for (let i = 1; i < pins; i++) {
        circle([pinX(i), pinY], 1.7);
        circle([pinX(i), pinY], pinHole);
      }
    });
    color(PAD, extrude(0.03 * dir).new());
  }

  // front silkscreen: pin names under the header, above the panel
  sketch(plane('xy', pcbT), () => {
    labels.forEach((l, i) => text(l).size(0.8).bold().align('center').at([pinX(i), top - 4.3]));
  });
  color(SILK, extrude(0.02).new());

  // bond layer between PCB and LCM (fills the 0.18 gap)
  const lcmCy = lcmTop - lcmH / 2;
  sketch(plane('xy', pcbT), () => { rect([0, lcmCy], lcmW, lcmH).centered(); });
  color('#9a9a9a', extrude(bond).new());

  // LCM: black glass panel, dark active area, gold FPC at its lower edge
  sketch(plane('xy', pcbT + bond), () => { rect([0, lcmCy], lcmW, lcmH).centered(); });
  color(BLACK, extrude(lcmT).new());
  sketch(plane('xy', pcbT + bond + lcmT), () => { rect([0, aaTop - aa / 2], aa, aa).centered(); });
  color('#1b2433', extrude(0.02).new());
  sketch(plane('xy', pcbT), () => { rect([-0.5, top - 39.6], 17.0, 0.9).centered(); });
  color('#c9a227', extrude(0.1).new());

  // back silkscreen, on the −XY plane so it reads correctly from behind
  // (that plane's local x is world −x)
  sketch(plane('-xy', 0.0), () => {
    labels.forEach((l, i) => text(l).size(0.6).align('center').at([-pinX(i), top - 3.9]));
    text('1.54TFT-SPI-ST7789').size(1.4).at([-11.2, top - 32.7]);
    text('Ver:1.1').size(1.4).at([-11.2, top - 34.8]);
  });
  color(SILK, extrude(0.02).new());

  // back-side parts (photo): U7 SOT-89 regulator, U9 SOT-23, 0603 R/C in two rows
  if (parts) {
    const box = (x, y, w, h, t, c) => {
      sketch(plane('xy', -t), () => { rect([x, y], w, h).centered(); });
      color(c, extrude(t).new());
    };
    const row1 = top - 10.1, row2 = top - 16.3;
    box(0.3, row1, 4.5, 2.5, 1.5, '#1a1a1a');                       // U7 body
    box(0.3, row1 + 1.9, 1.6, 1.3, 0.4, '#bfbfbf');                 // U7 tab
    for (const x of [5.7, 3.9, -3.1, -4.9]) box(x, row1, 0.8, 1.6, 0.8, '#b5865a');      // C11 C5 C4 C3
    box(0.4, row2 - 0.5, 2.9, 1.3, 1.1, '#1a1a1a');                 // U9, pins up/down
    for (const x of [9.5, 7.8, 6.0, 4.4, 2.8, -4.5, -5.9, -7.5, -9.2]) box(x, row2, 0.8, 1.6, 0.45, '#2a2a2a'); // R47…R13, R16…R51
    box(-2.9, row2, 0.8, 1.6, 0.8, '#b5865a');                      // C2
  }

  // optional flat 1.5 mm keep-out over the area the parts occupy
  if (keepOut) {
    sketch(plane('xy', -smdT), () => { rect([0, top - 13.5], 22.0, 10.0).centered(); });
    color('#8a8a8a', extrude(smdT).new());
  }

  // male header on the back, plugs into a 1×8 2.54 mm socket on the main board;
  // its 2.5 mm plastic body is taller than the 1.5 mm SMD layer.
  // Header dimensions are typical, not from a datasheet: common pins are
  // 6 + 2.5 + 3 = 11.5 mm (also 5.84 + 2.54 + 2.41); this uses 6 below the
  // body and 1.0 sticking out above the module PCB. Measure the shipped one.
  if (header) {
    sketch(plane('xy', -2.5), () => { rect([0, pinY], pins * pitch, 2.5).centered(); });
    color(BLACK, extrude(2.5).new());
    sketch(plane('xy', -2.5 - 6.0), () => {
      for (let i = 0; i < pins; i++) rect([pinX(i), pinY], 0.64, 0.64).centered();
    });
    color('#d4af37', extrude(6.0 + 2.5 + pcbT + 1.0).new());
  }
});

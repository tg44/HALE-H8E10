// Top of the case: one printed part, segments at different heights
// (parts.js SEG):
//   keys     — 1.5 mm switch plate, top at 5.0 (KS-20 clips), 14 × 14
//              cutouts
//   display  — clears the 2.79" glass, window over the active area; top
//              flush with the encoders
//   encoders — rests on the 6.5 mm encoder bodies, Ø7.4 holes for the M7
//              bushings; washer + nut clamp it (2.0 + 0.5 + 2.0 ≤ 5)
// Built as a solid block to the highest top, cut down per well (the
// layout's PLATE.wells), then hollowed from below (PLATE.hollows; walls
// stay WALL thick, also between segments). The encoder area stays solid
// with pockets for the encoder bodies and a light channel per LED, topped
// by a stepped window for the transparent plug (windows.js). No steel
// near the sensors.
// Call inside a part() body.

import { sketch, extrude, cut, plane, circle, color, fillet, chamfer } from 'fluidcad/core';
import { rect } from 'fluidcad/shapes';
import { PLATE_Z, SEG, TOP_Z, WINDOW_PAD, LED_WINDOW, ENC_POCKET, MOUNT } from './parts.js';

const box = (x0, x1, y0, y1, r = 0) => {
  const g = rect([(x0 + x1) / 2, (y0 + y1) / 2], x1 - x0, y1 - y0).centered();
  return r ? g.radius(r) : g;
};

export function buildPlate({ CASE, PLATE, KEYS, ENCODERS, DISPLAY_AA, ENC_LEDS = [] }) {
  // solid block, plate underside to the highest top
  sketch(plane('xy', PLATE_Z), () => { rect([0, 0], CASE.w, CASE.h).centered().radius(CASE.r); });
  extrude(TOP_Z - PLATE_Z);

  // wells cut down from the top (the step walls belong to the higher neighbour)
  const cuts = PLATE.wells.map((w) => {
    sketch(plane('xy', TOP_Z), () => { box(w.x0, w.x1, w.y0, w.y1); });
    return cut(TOP_Z - w.top);
  });

  // round off the raised edges around a well (its cut's top rim is exactly
  // the step lines; the other sides run outside the case)
  PLATE.wells.forEach((w, i) => {
    if (!w.edge) return;
    if (w.edge.kind === 'chamfer') chamfer(w.edge.size, cuts[i].startEdges());
    else fillet(w.edge.size, cuts[i].startEdges());
  });

  // hollow the raised segments from below, leaving WALL all round
  for (const h of PLATE.hollows) {
    sketch(plane('xy', PLATE_Z), () => { box(h.x0, h.x1, h.y0, h.y1, 2); });
    cut(-(h.under - PLATE_Z));
  }

  // openings
  sketch(plane('xy', SEG.keys.top), () => {
    for (const [x, y] of KEYS) rect([x, y], 14.0, 14.0).centered();
  });
  cut(SEG.keys.top - SEG.keys.under);
  if (ENCODERS.length) {
    sketch(plane('xy', SEG.encoders.top), () => {
      for (const [x, y] of ENCODERS) circle([x, y], 7.4);
    });
    cut(SEG.encoders.top - SEG.encoders.under);
  }
  sketch(plane('xy', SEG.display.top), () => {
    rect([DISPLAY_AA.x, DISPLAY_AA.y], DISPLAY_AA.w + 2 * WINDOW_PAD, DISPLAY_AA.h + 2 * WINDOW_PAD).centered();
  });
  cut(SEG.display.top - SEG.display.under);

  // solid encoder area (PLATE.fill): a pocket per encoder body, from the
  // plate underside up to the body top the plate rests on; asymmetric, the
  // switch-pin side faces the encoder's LED
  if (PLATE.fill && ENCODERS.length) {
    sketch(plane('xy', PLATE_Z), () => {
      ENCODERS.forEach(([x, y], i) => {
        const dir = Math.sign(ENC_LEDS[i][1] - y) || -1;
        const y0 = y + dir * ENC_POCKET.led, y1 = y - dir * ENC_POCKET.back;
        box(x - ENC_POCKET.x, x + ENC_POCKET.x, Math.min(y0, y1), Math.max(y0, y1), 1);
      });
    });
    cut(-(SEG.encoders.under - PLATE_Z));
  }

  // encoder LED windows: w × h opening through the top skin, and a flange
  // (w, h) + 2 · flange in the middle layers — the void the transparent plug
  // (windows.js) fills. With a solid encoder area the opening carries on
  // down to the plate underside as the LED's light channel.
  if (ENC_LEDS.length) {
    const { w, h, r, flange, skin } = LED_WINDOW;
    const { top, under } = SEG.encoders;
    sketch(plane('xy', top), () => {
      for (const [x, y] of ENC_LEDS) rect([x, y], w, h).centered().radius(r);
    });
    cut(top - (PLATE.fill ? PLATE_Z : under));
    sketch(plane('xy', top - skin), () => {
      for (const [x, y] of ENC_LEDS) rect([x, y], w + 2 * flange, h + 2 * flange).centered().radius(r + flange);
    });
    cut(top - under - 2 * skin);
  }

  // heat-set insert holes from below (screws come up through the tray)
  if (PLATE.inserts?.length) {
    sketch(plane('xy', PLATE_Z), () => { for (const [x, y] of PLATE.inserts) circle([x, y], MOUNT.insertHole); });
    cut(-MOUNT.insertDepth);
  }

  color('#3a3d42');
}

// Top of the case for the layout sketch: one printed part, three segments
// at different heights (layout.js SEG):
//   keys     — front-left, 1.5 mm switch plate, top at 5.0 (KS-20 clips),
//              14 × 14 cutouts
//   display  — behind the keys, clears the 2.79" glass, window over the
//              active area; top flush with the encoders
//   encoders — right, rests on the 6.5 mm encoder bodies, Ø7.4 holes for
//              the M7 bushings; washer + nut clamp it (2.0 + 0.5 + 2.0 ≤ 5)
// Built as a solid block to the highest top, cut down per segment, then
// hollowed from below (walls stay WALL thick, also between segments).
// No steel near the sensors.

import { part, sketch, extrude, cut, plane, circle, color, fillet, chamfer } from 'fluidcad/core';
import { rect } from 'fluidcad/shapes';
import {
  CASE, WALL, PLATE_Z, SEG, TOP_Z, STEP, STEP_EDGE, KEYS, ENCODERS, DISPLAY_AA, WINDOW_PAD,
} from './layout.js';

export const plate = part('Top (sketch)', () => {
  const L = -CASE.w / 2, R = CASE.w / 2, B = -CASE.h / 2, T = CASE.h / 2;
  const box = (x0, x1, y0, y1, r = 0) => {
    const g = rect([(x0 + x1) / 2, (y0 + y1) / 2], x1 - x0, y1 - y0).centered();
    return r ? g.radius(r) : g;
  };

  // solid block, plate underside to the highest top
  sketch(plane('xy', PLATE_Z), () => { rect([0, 0], CASE.w, CASE.h).centered().radius(CASE.r); });
  extrude(TOP_Z - PLATE_Z);

  // segment tops (the step walls belong to the higher neighbour)
  sketch(plane('xy', TOP_Z), () => { box(L - 1, STEP.x - WALL / 2, B - 1, STEP.y - WALL / 2); });
  const keyArea = cut(TOP_Z - SEG.keys.top);
  if (SEG.display.top < TOP_Z) {
    sketch(plane('xy', TOP_Z), () => { box(L - 1, STEP.x - WALL / 2, STEP.y - WALL / 2, T + 1); });
    cut(TOP_Z - SEG.display.top);
  }

  // round off the raised edges around the key area (the key cut's top rim
  // is exactly those two step lines)
  if (STEP_EDGE.kind === 'chamfer') chamfer(STEP_EDGE.size, keyArea.startEdges());
  else fillet(STEP_EDGE.size, keyArea.startEdges());

  // hollow the raised segments from below, leaving WALL all round
  sketch(plane('xy', PLATE_Z), () => { box(L + WALL, STEP.x - WALL / 2, STEP.y + WALL / 2, T - WALL, 2); });
  cut(-(SEG.display.under - PLATE_Z));
  sketch(plane('xy', PLATE_Z), () => { box(STEP.x + WALL / 2, R - WALL, B + WALL, T - WALL, 2); });
  cut(-(SEG.encoders.under - PLATE_Z));

  // openings
  sketch(plane('xy', SEG.keys.top), () => {
    for (const [x, y] of KEYS) rect([x, y], 14.0, 14.0).centered();
  });
  cut(SEG.keys.top - SEG.keys.under);
  sketch(plane('xy', SEG.encoders.top), () => {
    for (const [x, y] of ENCODERS) circle([x, y], 7.4);
  });
  cut(SEG.encoders.top - SEG.encoders.under);
  sketch(plane('xy', SEG.display.top), () => {
    rect([DISPLAY_AA.x, DISPLAY_AA.y], DISPLAY_AA.w + 2 * WINDOW_PAD, DISPLAY_AA.h + 2 * WINDOW_PAD).centered();
  });
  cut(SEG.display.top - SEG.display.under);

  color('#3a3d42');
});

// Dimension marks for the layout sketch — drawing-style Y dimensions
// (extension ticks, dimension line, arrowheads, value) as thin coloured
// solids floating above the model, readable in the top view. Values come
// from layout.js, so they follow every layout change. View-only: used by
// h8e10-dims.assembly.js, never by the print/export assembly.

import { part, sketch, extrude, plane, line, text, color } from 'fluidcad/core';
import { rect } from 'fluidcad/shapes';
import { CASE, KEYS, ENCODERS, KEYCAP, KNOB_D, DISPLAY_AA, WINDOW_PAD } from './layout.js';

const Z = 30;                 // above the knob tops (~28.5)
const COLOR = '#ff7a00';
const LINE_W = 0.3, ARROW_L = 1.6, ARROW_W = 1.2, TICK = 6, TEXT = 2.2;

// one Y dimension from y0 to y1 at x; the value is written beside it
function dimY(x, y0, y1, side = 1) {
  const [a, b] = y0 < y1 ? [y0, y1] : [y1, y0];
  const len = b - a;
  sketch(plane('xy', Z), () => {
    rect([x, (a + b) / 2], LINE_W, Math.max(len - 2 * ARROW_L, 0.1)).centered();   // dimension line
    for (const [y, dir] of [[a, 1], [b, -1]]) {
      const p0 = [x, y], p1 = [x - ARROW_W / 2, y + dir * ARROW_L], p2 = [x + ARROW_W / 2, y + dir * ARROW_L];
      line(p0, p1); line(p1, p2); line(p2, p0);                                     // arrowhead
      rect([x, y], TICK, LINE_W).centered();                                        // extension tick
    }
    text(len.toFixed(1)).size(TEXT).bold()
      .align(side > 0 ? 'left' : 'right')
      .at([x + side * 1.5, (a + b) / 2 - TEXT / 2]);
  });
  color(COLOR, extrude(0.2).new());
}

export const annotations = part('Dimensions (view only)', () => {
  const front = -CASE.h / 2, back = CASE.h / 2;
  const encYs = ENCODERS.map((e) => e[1]);
  const keyYs = KEYS.map((k) => k[1]);
  const encX = ENCODERS[0][0], keyX = KEYS[0][0];

  // bottom knob row → front edge
  dimY(encX, Math.min(...encYs) - KNOB_D / 2, front);
  // front keycap row → front edge
  dimY(keyX, Math.min(...keyYs) - KEYCAP / 2, front);
  // top knob row → back edge
  dimY(encX, Math.max(...encYs) + KNOB_D / 2, back);
  // screen window top edge → back edge
  dimY(DISPLAY_AA.x, DISPLAY_AA.y + DISPLAY_AA.h / 2 + WINDOW_PAD, back);
});

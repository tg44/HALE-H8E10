// Dimension marks for a layout sketch — drawing-style dimensions
// (extension ticks, dimension line, arrowheads, value) as thin coloured
// solids floating above the model, readable in the top view. Values come
// from the layout, so they follow every change. View-only: used by the
// *-dims assemblies, never by the print/export ones. Call inside a part()
// body.

import { sketch, extrude, plane, line, text, color } from 'fluidcad/core';
import { rect } from 'fluidcad/shapes';
import { KEYCAP, KNOB_D, WINDOW_PAD } from './parts.js';

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

// the same along X, value written above (side > 0) or below
function dimX(y, x0, x1, side = 1) {
  const [a, b] = x0 < x1 ? [x0, x1] : [x1, x0];
  const len = b - a;
  sketch(plane('xy', Z), () => {
    rect([(a + b) / 2, y], Math.max(len - 2 * ARROW_L, 0.1), LINE_W).centered();
    for (const [x, dir] of [[a, 1], [b, -1]]) {
      const p0 = [x, y], p1 = [x + dir * ARROW_L, y - ARROW_W / 2], p2 = [x + dir * ARROW_L, y + ARROW_W / 2];
      line(p0, p1); line(p1, p2); line(p2, p0);
      rect([x, y], LINE_W, TICK).centered();
    }
    text(len.toFixed(1)).size(TEXT).bold().align('center')
      .at([(a + b) / 2, side > 0 ? y + 1.2 : y - 1.2 - TEXT]);
  });
  color(COLOR, extrude(0.2).new());
}

export function buildAnnotations({ CASE, KEYS, ENCODERS, DISPLAY_AA, DIMS = [] }) {
  const front = -CASE.h / 2, back = CASE.h / 2;
  const keyYs = KEYS.map((k) => k[1]);
  const keyX = KEYS[0][0];
  const encYs = ENCODERS.map((e) => e[1]);
  const encX = ENCODERS.length ? ENCODERS[0][0] : 0;

  // bottom knob row → front edge
  if (ENCODERS.length) dimY(encX, Math.min(...encYs) - KNOB_D / 2, front);
  // front keycap row → front edge
  dimY(keyX, Math.min(...keyYs) - KEYCAP / 2, front);
  // top knob row → back edge
  if (ENCODERS.length) dimY(encX, Math.max(...encYs) + KNOB_D / 2, back);
  // screen window top edge → back edge
  dimY(DISPLAY_AA.x, DISPLAY_AA.y + DISPLAY_AA.h / 2 + WINDOW_PAD, back);

  // layout-specific marks: { axis: 'x' | 'y', at, from, to, side? }
  for (const d of DIMS) (d.axis === 'x' ? dimX : dimY)(d.at, d.from, d.to, d.side ?? 1);
}

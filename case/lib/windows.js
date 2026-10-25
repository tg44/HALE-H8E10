// Transparent plugs for the encoder LED windows (parts.js LED_WINDOW):
// they fill the stepped holes plate.js cuts (the bottom opening only with
// style 'fill'), so the top prints as two bodies in the same coordinates —
// black top + these — one per extruder.
// Call inside a part() body.

import { sketch, extrude, plane, color } from 'fluidcad/core';
import { rect } from 'fluidcad/shapes';
import { SEG, LED_WINDOW } from './parts.js';

export function buildWindows({ ENC_LEDS }) {
  const { w, h, r, flange, skin, style } = LED_WINDOW;
  const { top, under } = SEG.encoders;
  const plugFrom = style === 'fill' ? under : under + skin;     // 'bridge': the opening below left empty
  sketch(plane('xy', plugFrom), () => {
    for (const [x, y] of ENC_LEDS) rect([x, y], w, h).centered().radius(r);
  });
  extrude(top - plugFrom);
  sketch(plane('xy', under + skin), () => {
    for (const [x, y] of ENC_LEDS) rect([x, y], w + 2 * flange, h + 2 * flange).centered().radius(r + flange);
  });
  extrude(top - under - 2 * skin);
  color('#d8ecff');
}

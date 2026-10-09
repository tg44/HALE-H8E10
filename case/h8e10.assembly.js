// Layout sketch: board + case + parts. Left: keys at the front, the 2.79"
// bar display behind them; right: encoders. Positions come from layout.js.
// Keycaps and knobs are placeholders.

import { assembly, insert } from 'fluidcad/core';
import { KEYS, ENCODERS, DISPLAY_POS, DISPLAY_Z, DISPLAY_ROT, KEYCAP_Z, SEG } from './layout.js';
import { board } from './board.part.js';
import { plate } from './plate.part.js';
import { tray } from './tray.part.js';
import { ks20 } from './ref/ks20.part.js';
import { pec11r } from './ref/pec11r.part.js';
import { m7hardware } from './ref/m7-hardware.part.js';
import { display279 } from './ref/display-279.part.js';
import { keycap, knob } from './ref/placeholders.part.js';

export const h8e10 = assembly('H8E10 layout sketch', () => {
  insert(board).grounded().name('PCB');
  insert(tray).name('Tray');
  insert(plate).name('Top');

  insert(display279).rotate('z', DISPLAY_ROT).translate(DISPLAY_POS[0], DISPLAY_POS[1], DISPLAY_Z).name('Display');

  KEYS.forEach(([x, y], i) => {
    insert(ks20).translate(x, y, 0).name(`K${i + 1}`);
    insert(keycap).translate(x, y, KEYCAP_Z).name(`Keycap ${i + 1}`);
  });

  const nutTop = SEG.encoders.top + 0.5 + 2.0;
  ENCODERS.forEach(([x, y], i) => {
    insert(pec11r).translate(x, y, 0).name(`E${i + 1}`);
    insert(m7hardware).translate(x, y, SEG.encoders.top).name(`Nut ${i + 1}`);
    insert(knob).translate(x, y, nutTop + 0.5).name(`Knob ${i + 1}`);
  });
});

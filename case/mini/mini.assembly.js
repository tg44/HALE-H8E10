// Mini test board layout sketch (H4): the H8E10's left 2×2 keys and the
// 2.79" display, plus 1–4 encoders. Variant picks the encoder layout
// (layout.js VARIANTS). Keycaps and knobs are placeholders.

import { assembly, insert, param, section } from 'fluidcad/core';
import { miniLayout, VARIANTS, DEFAULT_VARIANT, DISPLAY_Z, DISPLAY_ROT, KEYCAP_Z, SEG } from './layout.js';
import { board } from './board.part.js';
import { plate } from './plate.part.js';
import { tray } from './tray.part.js';
import { windows } from './windows.part.js';
import { ks20 } from '../ref/ks20.part.js';
import { pec11r } from '../ref/pec11r.part.js';
import { m7hardware } from '../ref/m7-hardware.part.js';
import { display279 } from '../ref/display-279.part.js';
import { keycap, knob } from '../ref/placeholders.part.js';

export const mini = assembly('H4 mini layout sketch', () => {
  const variant = param('Variant', DEFAULT_VARIANT, 'select', { options: VARIANTS });
  const { KEYS, ENCODERS, DISPLAY_POS, ENC_LEDS } = miniLayout(variant);
  const v = { Variant: variant };

  insert(board, v).grounded().name('PCB');
  insert(tray, v).name('Tray');
  insert(plate, v).name('Top');
  insert(windows, v).name('LED windows');

  // section views (viewport → Section views): through the LED windows
  if (ENC_LEDS.length) section('LED windows', 'yz', { offset: ENC_LEDS[0][0] });

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

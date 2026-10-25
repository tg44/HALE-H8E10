// Mini bottom tray (../lib/tray.js).
// Variant: the encoder layout, see layout.js VARIANTS.

import { part, param } from 'fluidcad/core';
import { buildTray } from '../lib/tray.js';
import { miniLayout, VARIANTS, DEFAULT_VARIANT } from './layout.js';

export const tray = part('Mini tray (sketch)', () => {
  const variant = param('Variant', DEFAULT_VARIANT, 'select', { options: VARIANTS });
  buildTray(miniLayout(variant));
});

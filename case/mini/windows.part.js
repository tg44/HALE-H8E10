// Mini encoder LED windows, the transparent half of the top
// (../lib/windows.js). Print together with plate.part.js, same origin.
// Variant: the encoder layout, see layout.js VARIANTS.

import { part, param } from 'fluidcad/core';
import { buildWindows } from '../lib/windows.js';
import { miniLayout, VARIANTS, DEFAULT_VARIANT } from './layout.js';

export const windows = part('Mini LED windows (transparent)', () => {
  const variant = param('Variant', DEFAULT_VARIANT, 'select', { options: VARIANTS });
  buildWindows(miniLayout(variant));
});

// Mini top (../lib/plate.js): 2×2 keys in a well front-left, display and
// encoders raised around it, same heights and fillet as the H8E10.
// Variant: the encoder layout, see layout.js VARIANTS.

import { part, param } from 'fluidcad/core';
import { buildPlate } from '../lib/plate.js';
import { miniLayout, VARIANTS, DEFAULT_VARIANT } from './layout.js';

export const plate = part('Mini top (sketch)', () => {
  const variant = param('Variant', DEFAULT_VARIANT, 'select', { options: VARIANTS });
  buildPlate(miniLayout(variant));
});

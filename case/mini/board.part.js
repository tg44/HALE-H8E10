// Mini main PCB for the layout sketch (../lib/board.js).
// Variant: the encoder layout, see layout.js VARIANTS.

import { part, param } from 'fluidcad/core';
import { buildBoard } from '../lib/board.js';
import { miniLayout, VARIANTS, DEFAULT_VARIANT } from './layout.js';

export const board = part('Mini PCB (sketch)', () => {
  const variant = param('Variant', DEFAULT_VARIANT, 'select', { options: VARIANTS });
  buildBoard(miniLayout(variant));
});

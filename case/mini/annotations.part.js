// Mini dimension marks (../lib/annotations.js), incl. keycap → knob and
// knob → screen window. View-only: used by mini-dims.assembly.js.
// Variant: the encoder layout, see layout.js VARIANTS.

import { part, param } from 'fluidcad/core';
import { buildAnnotations } from '../lib/annotations.js';
import { miniLayout, VARIANTS, DEFAULT_VARIANT } from './layout.js';

export const annotations = part('Mini dimensions (view only)', () => {
  const variant = param('Variant', DEFAULT_VARIANT, 'select', { options: VARIANTS });
  buildAnnotations(miniLayout(variant));
});

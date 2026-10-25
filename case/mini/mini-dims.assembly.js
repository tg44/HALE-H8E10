// View-only: the mini layout sketch plus dimension marks
// (annotations.part.js). Open this one to check distances; export/print
// from mini.assembly.js.

import { assembly, insert, param } from 'fluidcad/core';
import { VARIANTS, DEFAULT_VARIANT } from './layout.js';
import { mini } from './mini.assembly.js';
import { annotations } from './annotations.part.js';

export const miniDims = assembly('H4 mini layout sketch + dimensions', () => {
  const variant = param('Variant', DEFAULT_VARIANT, 'select', { options: VARIANTS });
  insert(mini, { Variant: variant }).grounded().name('Layout');
  insert(annotations, { Variant: variant }).name('Dimensions');
});

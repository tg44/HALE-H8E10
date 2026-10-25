// View-only: every mini variant side by side (layout.js VARIANTS), front
// to back in list order, for comparing them in the top view.

import { assembly, insert } from 'fluidcad/core';
import { VARIANTS, miniLayout } from './layout.js';
import { mini } from './mini.assembly.js';

const GAP = 15;

export const miniVariants = assembly('H4 mini variants', () => {
  let y = 0;
  VARIANTS.forEach(({ value }) => {
    const { CASE } = miniLayout(value);
    insert(mini, { Variant: value }).translate(CASE.w / 2, y, 0).name(value);
    y += CASE.h + GAP;
  });
});

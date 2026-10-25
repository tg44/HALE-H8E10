// View-only: the layout sketch plus dimension marks (annotations.part.js).
// Open this one to check distances; export/print from h8e10.assembly.js.

import { assembly, insert } from 'fluidcad/core';
import { h8e10 } from './h8e10.assembly.js';
import { annotations } from './annotations.part.js';

export const h8e10Dims = assembly('H8E10 layout sketch + dimensions', () => {
  insert(h8e10).grounded().name('Layout');
  insert(annotations).name('Dimensions');
});

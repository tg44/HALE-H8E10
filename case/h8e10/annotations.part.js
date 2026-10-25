// H8E10 dimension marks (../lib/annotations.js). View-only: used by
// h8e10-dims.assembly.js, never by the print/export assembly.

import { part } from 'fluidcad/core';
import { buildAnnotations } from '../lib/annotations.js';
import { LAYOUT } from './layout.js';

export const annotations = part('Dimensions (view only)', () => buildAnnotations(LAYOUT));

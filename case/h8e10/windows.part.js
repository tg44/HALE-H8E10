// H8E10 encoder LED windows, the transparent half of the top
// (../lib/windows.js). Print together with plate.part.js, same origin.

import { part } from 'fluidcad/core';
import { buildWindows } from '../lib/windows.js';
import { LAYOUT } from './layout.js';

export const windows = part('LED windows (transparent)', () => buildWindows(LAYOUT));

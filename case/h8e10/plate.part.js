// H8E10 top for the layout sketch (../lib/plate.js): keys front-left at
// the switch-plate height, the display strip behind them and the encoder
// block on the right flush at the encoder height, a 3.5 fillet on the step.

import { part } from 'fluidcad/core';
import { buildPlate } from '../lib/plate.js';
import { LAYOUT } from './layout.js';

export const plate = part('Top (sketch)', () => buildPlate(LAYOUT));

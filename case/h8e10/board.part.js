// H8E10 main PCB for the layout sketch (../lib/board.js). No KiCad STEP
// import yet — this stands in until the real export replaces it.

import { part } from 'fluidcad/core';
import { buildBoard } from '../lib/board.js';
import { LAYOUT } from './layout.js';

export const board = part('Main PCB (sketch)', () => buildBoard(LAYOUT));

// H8E10 bottom tray for the layout sketch (../lib/tray.js).

import { part } from 'fluidcad/core';
import { buildTray } from '../lib/tray.js';
import { LAYOUT } from './layout.js';

export const tray = part('Tray (sketch)', () => buildTray(LAYOUT));

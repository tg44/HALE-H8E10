// Bottom tray for the layout sketch: floor + walls up to the plate. Room
// under the board for the XIAO and encoder pins (layout.js UNDER). No USB-C
// opening, bosses or antenna spot yet.

import { part, sketch, extrude, plane, color } from 'fluidcad/core';
import { rect } from 'fluidcad/shapes';
import { CASE, PCB_T, UNDER, FLOOR, PLATE_Z, WALL } from './layout.js';

export const tray = part('Tray (sketch)', () => {
  const bottom = -PCB_T - UNDER - FLOOR;
  sketch(plane('xy', bottom), () => { rect([0, 0], CASE.w, CASE.h).centered().radius(CASE.r); });
  extrude(FLOOR);
  sketch(plane('xy', bottom + FLOOR), () => {
    rect([0, 0], CASE.w, CASE.h).centered().radius(CASE.r);
    rect([0, 0], CASE.w - 2 * WALL, CASE.h - 2 * WALL).centered().radius(CASE.r - WALL);
  });
  extrude(PLATE_Z - (bottom + FLOOR));
  color('#55595f');
});

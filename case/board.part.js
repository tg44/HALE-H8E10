// Main PCB for the layout sketch: outline from layout.js, plus the M2
// spacers under the display's two mounting holes. The display's male
// header is soldered straight into this board; the module back sits on the
// spacers (DISPLAY_Z) because its back-side parts are taller than the
// header body. No KiCad board yet — this stands in until the real STEP
// export replaces it.

import { part, sketch, extrude, plane, cylinder, color } from 'fluidcad/core';
import { rect } from 'fluidcad/shapes';
import { PCB, PCB_T, DISPLAY_HOLES, DISPLAY_Z } from './layout.js';

export const board = part('Main PCB (sketch)', () => {
  sketch(plane('xy', -PCB_T), () => { rect([0, 0], PCB.w, PCB.h).centered().radius(2); });
  color('#1d6b3a', extrude(PCB_T));

  for (const [x, y] of DISPLAY_HOLES) color('#c8a24a', cylinder(1.75, DISPLAY_Z).translate(x, y, 0));
});

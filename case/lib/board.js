// Main PCB for a layout sketch: outline from the layout, plus the M2
// spacers under the display's two mounting holes. The display's male
// header is soldered straight into this board; the module back sits on the
// spacers (DISPLAY_Z) because its back-side parts are taller than the
// header body. Stands in until the real KiCad STEP export replaces it.
// Call inside a part() body.

import { sketch, extrude, cut, plane, cylinder, circle, color } from 'fluidcad/core';
import { rect } from 'fluidcad/shapes';
import { PCB_T, DISPLAY_Z, MOUNT } from './parts.js';

export function buildBoard({ PCB, DISPLAY_HOLES, TRAY = {} }) {
  sketch(plane('xy', -PCB_T), () => { rect([0, 0], PCB.w, PCB.h).centered().radius(2); });
  color('#1d6b3a', extrude(PCB_T));

  // holes for the tray's screws and locating pins (mini, D27)
  const holes = [...(TRAY.screws ?? []), ...(TRAY.towers ?? []).filter((t) => t.pin).map((t) => [t.x, t.y])];
  if (holes.length) {
    sketch(plane('xy', 0), () => { for (const [x, y] of holes) circle([x, y], MOUNT.pcbHole); });
    cut(PCB_T);
  }

  for (const [x, y] of DISPLAY_HOLES) color('#c8a24a', cylinder(1.75, DISPLAY_Z).translate(x, y, 0));
}

// M7 × 0.75 washer + hex nut supplied with the Bourns PEC11R (datasheet
// "Hardware": nut 10.0 across flats × 2.0, washer Ø12.0 / Ø7.1 × 0.5).
// Thread not modelled. Origin: washer underside on the panel, on the axis.

import { part, sketch, extrude, plane, line, circle, color } from 'fluidcad/core';

export const m7hardware = part('M7 washer + nut', () => {
  sketch('xy', () => {
    circle([0, 0], 12.0);
    circle([0, 0], 7.1);
  });
  color('#c0c4c8', extrude(0.5));

  const r = 10.0 / Math.sqrt(3);          // hex corner radius from 10 mm across flats
  const pts = [0, 1, 2, 3, 4, 5].map((i) => [r * Math.cos(i * Math.PI / 3), r * Math.sin(i * Math.PI / 3)]);
  sketch(plane('xy', 0.5), () => {
    pts.forEach((p, i) => line(p, pts[(i + 1) % 6]));
    circle([0, 0], 7.0);
  });
  color('#a8adb2', extrude(2.0).new());
});

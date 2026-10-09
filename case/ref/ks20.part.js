// Gateron KS-20 magnetic switch, reference model for fit checks. Dimensions
// from the Gateron drawing (hardware/libs/datasheets/switch/gateron-ks-20-…pdf,
// p.5). Envelope only: the top-housing taper and stem are simplified, no
// clips, no LED window.
//
// Origin: switch centre on the main-PCB top surface, z = 0 there, +Z up.
// Pegs lie on the X axis; +Y is the LED-window side.

import { part, param, sketch, extrude, plane, cylinder, color } from 'fluidcad/core';
import { rect } from 'fluidcad/shapes';

export const ks20 = part('Gateron KS-20', () => {
  const travel = param('Travel', 0, 'slider', { min: 0, max: 4.1, step: 0.1 });

  const plateTop = 5.0;          // PCB top → plate top (drawing: 5.00 ± 0.05)
  const housingTop = 11.1;       // PCB top → top of the housing
  const stemAbove = 4.0;         // stem above the housing at rest (measured off the drawing)
  const flange = 1.2;            // full-size part of the top housing above the plate
  const topW = 9.6;              // top face of the housing (measured off the drawing)

  // bottom housing: sits on the PCB, passes through the 14 mm plate cutout
  sketch('xy', () => { rect([0, 0], 14.0, 14.0).centered(); });
  const bottom = extrude(plateTop);
  color('#f2f2f2', bottom);

  // top housing: 15.4 × 15.1 flange on the plate, tapering to the top
  sketch(plane('xy', plateTop), () => { rect([0, 0], 15.4, 15.1).centered(); });
  extrude(flange);
  const taperH = housingTop - plateTop - flange;
  const angle = Math.atan((15.1 - topW) / 2 / taperH) * 180 / Math.PI;
  sketch(plane('xy', plateTop + flange), () => { rect([0, 0], 15.4, 15.1).centered(); });
  const cover = extrude(taperH).draft(-angle);
  color('#dfe8ef', cover);

  // MX cross stem (4.0 × 1.3 and 1.1 × 4.0 arms), moves down with Travel
  const stemZ = housingTop - travel;
  sketch(plane('xy', stemZ), () => {
    rect([0, 0], 4.0, 1.3).centered();
    rect([0, 0], 1.1, 4.0).centered();
  });
  const stem = extrude(stemAbove).new();
  color('#ffffff', stem);

  // two plastic locating pegs, Ø1.7 holes at ±5.08, ~2.7 below the housing
  for (const x of [-5.08, 5.08]) {
    const peg = cylinder(0.8, 2.7).translate(x, 0, -2.7);
    color('#f2f2f2', peg);
  }
});

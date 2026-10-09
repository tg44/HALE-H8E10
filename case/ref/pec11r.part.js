// Bourns PEC11R-4215F-S0024 (24 detents / 24 pulses, 15 mm flatted shaft,
// push switch), reference model for fit checks. Dimensions from the Bourns
// datasheet (hardware/libs/datasheets/encoder/bourns-pec11r.pdf,
// "PEC11R-4xxxF-Sxxxx" and the L/LB/F table): body 12.5 × 13.4 × 6.5 to the
// mounting surface, M7 bushing LB = 5 (thread not modelled), Ø6 shaft to
// L = 15 above the mounting surface, D-flat to 4.5 over F = 7 at the tip.
//
// Origin: shaft axis on the main-PCB top surface, z = 0 there, +Z up.
// A/C/B pins at −Y, switch pins at +Y.

import { part, param, sketch, extrude, cut, plane, cylinder, color } from 'fluidcad/core';
import { rect } from 'fluidcad/shapes';

export const pec11r = part('Bourns PEC11R-4215F-S0024', () => {
  const push = param('Push', 0, 'slider', { min: 0, max: 0.5, step: 0.1 });

  const bodyH = 6.5, bushL = 5.0, shaftL = 15.0, flatL = 7.0, flatW = 4.5;
  const tip = bodyH + shaftL - push;

  // body
  sketch('xy', () => { rect([0, 0], 12.5, 13.4).centered(); });
  color('#9aa0a6', extrude(bodyH));

  // M7 bushing
  color('#c0c4c8', cylinder(3.5, bushL).translate(0, 0, bodyH));

  // Ø6 shaft with the D-flat at the tip; moves down with Push
  const shaft = cylinder(3.0, tip - bodyH - bushL).translate(0, 0, bodyH + bushL);
  color('#d8dadc', shaft);
  sketch(plane('xy', tip), () => { rect([flatW - 3.0, -3.5], 2.0, 7.0); });
  cut(flatL);

  // pins: A C B at −7.5 (2.5 pitch), switch pins at +7.0 (5.0 apart),
  // mounting lugs at ±6.6 — all 3.7 below the body
  for (const x of [-2.5, 0, 2.5]) color('#c9a227', cylinder(0.4, 3.7).translate(x, -7.5, -3.7));
  for (const x of [-2.5, 2.5]) color('#c9a227', cylinder(0.4, 3.7).translate(x, 7.0, -3.7));
  sketch(plane('xy', -3.7), () => {
    rect([-6.6, 0], 0.6, 2.0).centered();
    rect([6.6, 0], 0.6, 2.0).centered();
  });
  color('#9aa0a6', extrude(3.7).new());
});

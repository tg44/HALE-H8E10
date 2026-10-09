// Placeholder keycap and knob — not chosen yet, sizes are generic guesses so
// the sketch has something on top. Replace with real models once picked.

import { part, sketch, extrude, cylinder, color } from 'fluidcad/core';
import { rect } from 'fluidcad/shapes';

// DSA-like keycap: 18 × 18 base, ~12.7 top, 7.5 tall. Origin: bottom centre.
export const keycap = part('Keycap (placeholder)', () => {
  sketch('xy', () => { rect([0, 0], 18, 18).centered(); });
  color('#ececec', extrude(7.5).draft(-20));
});

// Ø15 × 17 knob (common 6 mm D-shaft size; bore not modelled). Origin: bottom centre.
export const knob = part('Knob (placeholder)', () => {
  color('#222222', cylinder(7.5, 17));
});

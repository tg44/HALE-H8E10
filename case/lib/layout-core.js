// Geometry shared by the layouts. Coordinates before centring: front key
// row at y = 0, first key column at x = 0, +Y away from the player; z = 0
// on the main-PCB top surface. finish() centres everything on the board
// and returns what the parts and assemblies read.

import {
  U, KEYCAP, MARGIN, WALL, CLEAR, DISPLAY, AA_SIZE, AA_OFF_X, DISPLAY_HOLE_OFFS,
  ENC_BODY, KNOB_D, KEY_KNOB_GAP, SEG, TOP_Z, STEP_EDGE, WINDOW_LAND, WINDOW_PAD, BED,
  ENC_LED_OFF, LED_WINDOW,
} from './parts.js';

// The H8E10 front block: two key rows, the 2.79" bar in a strip behind
// them, centred over four key columns. The mini keeps the same display
// position over its two columns, so both boards share these numbers.
export function frontBlock() {
  const half = KEYCAP / 2;
  const keyX4 = [0, 1, 2, 3].map((i) => i * U);
  const keyY = [0, U];
  const dispX = (keyX4[0] + keyX4[3]) / 2;                // centred over the 4-key block
  const stepY = keyY[1] + half + 0.5 + WALL / 2;          // keys | display step: pressed keycap clears it
  const dispY = Math.max(
    stepY + WALL / 2 + 0.5 + DISPLAY.h / 2,                                  // module clears the step wall
    stepY - WALL / 2 + STEP_EDGE.size + WINDOW_LAND + WINDOW_PAD + AA_SIZE.h / 2,   // window starts after the land
  );
  const bottom = keyY[0] - U / 2 - MARGIN;
  // back edge: window → back edge equals front keycap → front edge (symmetry)
  const keycapFrontGap = MARGIN + CLEAR + WALL + (U / 2 - half);
  const windowBottom = dispY - AA_SIZE.h / 2 - WINDOW_PAD;
  const windowTop = dispY + AA_SIZE.h / 2 + WINDOW_PAD;
  const top = windowTop + keycapFrontGap - CLEAR - WALL;               // board edge
  if (top < dispY + DISPLAY.h / 2 + 1) throw new Error('layout: display module too close to the board edge');
  return {
    half, keyX4, keyY, dispX, dispY, stepY, bottom, top, windowBottom,
    dispL: dispX - DISPLAY.w / 2, dispR: dispX + DISPLAY.w / 2, dispB: dispY - DISPLAY.h / 2,
  };
}

// First encoder column: knob KEY_KNOB_GAP from the block edge on its left.
export const firstEncoderX = (blockRight) => blockRight + KEY_KNOB_GAP + KNOB_D / 2;

// Step wall centre between a block edge (keycap or display) and the first
// encoder column: the pressed keycap clears it on one side, the encoder
// body on the other; the wall sits in the middle of what's left.
export function stepWallX(blockRight, encX, what) {
  const b2Min = blockRight + 0.5 + WALL / 2;
  const b2Max = encX - ENC_BODY.w / 2 - 0.5 - WALL / 2;
  if (b2Min > b2Max) throw new Error(`layout: ${what} too close to the encoders for the step wall`);
  return (b2Min + b2Max) / 2;
}

// Encoder LEDs: ENC_LED_OFF from the shaft towards the encoder above or
// below in the same column (as on the H8E10, where they face each other
// between the rows); an encoder alone in its column gets it in front.
// LED i belongs to encoder i. Each window must clear every knob by 1 mm,
// and neighbouring windows keep at least 1.2 mm of black between their
// flanges (two perimeters).
export function encoderLeds(encoders) {
  const leds = encoders.map(([x, y]) => {
    const col = encoders.filter(([ox, oy]) => Math.abs(ox - x) < 1 && oy !== y);
    const below = col.some(([, oy]) => oy < y);
    const above = col.some(([, oy]) => oy > y);
    return [x, below && !above ? y - ENC_LED_OFF : above && !below ? y + ENC_LED_OFF : y - ENC_LED_OFF];
  });
  const { w, h, flange } = LED_WINDOW;
  for (const [lx, ly] of leds) {
    for (const [ex, ey] of encoders) {
      const dx = Math.max(Math.abs(ex - lx) - w / 2, 0), dy = Math.max(Math.abs(ey - ly) - h / 2, 0);
      const clear = Math.hypot(dx, dy) - KNOB_D / 2;
      if (clear < 1) throw new Error(`layout: LED window at (${lx.toFixed(1)}, ${ly.toFixed(1)}) is ${clear.toFixed(1)} mm from a knob`);
    }
  }
  leds.forEach((a, i) => leds.slice(i + 1).forEach((b) => {
    const gx = Math.abs(a[0] - b[0]) - (w + 2 * flange), gy = Math.abs(a[1] - b[1]) - (h + 2 * flange);
    if (Math.max(gx, gy) < 1.2) throw new Error('layout: two LED windows too close for a black wall between them');
  }));
  return leds;
}

// Centre everything on the board and derive board, case and plate data.
//   raw.keys / raw.encoders: [[x, y]] before centring
//   raw.left/right/bottom/top: board edges before centring
//   raw.plate(c): plate spec in centred coordinates; c = { sx, sy, CASE }
//   raw.tray(c) (optional): tray spec — PCB towers, screw columns
export function finish(raw, F) {
  const { left, right, bottom, top } = raw;
  const sx = -(left + right) / 2, sy = -(bottom + top) / 2;
  const PCB = { w: right - left, h: top - bottom };
  const CASE = { w: PCB.w + 2 * (CLEAR + WALL), h: PCB.h + 2 * (CLEAR + WALL), r: 4 };
  if (Math.max(CASE.w, CASE.h) > BED.long - BED.spare || Math.min(CASE.w, CASE.h) > BED.short - BED.spare) {
    throw new Error(`layout: case ${CASE.w.toFixed(1)} × ${CASE.h.toFixed(1)} doesn't fit the ${BED.long} × ${BED.short} bed`);
  }
  const leds = encoderLeds(raw.encoders);
  return {
    KEYS: raw.keys.map(([x, y]) => [x + sx, y + sy]),
    ENCODERS: raw.encoders.map(([x, y]) => [x + sx, y + sy]),
    ENC_LEDS: leds.map(([x, y]) => [x + sx, y + sy]),
    DISPLAY_POS: [F.dispX + sx, F.dispY + sy],
    DISPLAY_AA: { x: F.dispX + AA_OFF_X + sx, y: F.dispY + sy, ...AA_SIZE },
    DISPLAY_HOLES: DISPLAY_HOLE_OFFS.map(([hx, hy]) => [F.dispX + hx + sx, F.dispY + hy + sy]),
    PCB,
    CASE,
    SHIFT: { sx, sy },
    PLATE: raw.plate({ sx, sy, CASE }),
    TRAY: raw.tray ? raw.tray({ sx, sy, CASE }) : {},
    DIMS: raw.dims ? raw.dims({ sx, sy }) : [],
  };
}

// Plate spec for a key well in the front-left corner with everything
// else raised: the well's right wall at stepX, its back wall at stepY
// (centred coordinates). Hollows from below:
//   behind the well — clears the display glass
//   right of the well — only with fill: false; by default that part stays
//   solid and plate.js pockets the encoders and LED channels into it
//   extra (optional) — more glass clearance where the display module
//   reaches over the encoder area
//   inserts: heat-set insert holes from below (screws through the tray)
export function wellPlate({ stepX, stepY, CASE, extra = [], fill = true, inserts = [] }) {
  const L = -CASE.w / 2, R = CASE.w / 2, B = -CASE.h / 2, T = CASE.h / 2;
  const wells = [{ x0: L - 1, x1: stepX - WALL / 2, y0: B - 1, y1: stepY - WALL / 2, top: SEG.keys.top, edge: STEP_EDGE }];
  if (SEG.display.top < TOP_Z) {
    wells.push({ x0: L - 1, x1: stepX - WALL / 2, y0: stepY - WALL / 2, y1: T + 1, top: SEG.display.top });
  }
  return {
    wells,
    hollows: [
      { x0: L + WALL, x1: stepX - WALL / 2, y0: stepY + WALL / 2, y1: T - WALL, under: SEG.display.under },
      ...(fill ? [] : [{ x0: stepX + WALL / 2, x1: R - WALL, y0: B + WALL, y1: T - WALL, under: SEG.encoders.under }]),
      ...extra,
    ],
    fill,
    inserts,
  };
}

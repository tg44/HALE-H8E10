// H8E10 panel layout, shared by its board, top, tray and assembly — one
// place to move things (D18). Sketch only: positions are a starting point,
// not final. Part sizes and spacing rules: ../lib/parts.js.
//
// Coordinates: origin at the board centre, z = 0 on the main-PCB top
// surface, +Y away from the player. Left block: 2×4 keys at the front,
// the 2.79" bar display in a strip behind them. Right block: 2×5
// encoders.

import { U, KEYCAP, KNOB_D, ENC_BODY, ENC_PX, ENC_PY, MARGIN } from '../lib/parts.js';
import { frontBlock, firstEncoderX, stepWallX, finish, wellPlate } from '../lib/layout-core.js';

export * from '../lib/parts.js';

// how the two encoder rows sit in the board height:
//   'even'  — equal gaps: edge / between the knobs / edge
//   'align' — bottom row level with the front key row, top row with the screen centre
//   'pitch' — ENC_PY apart, centred
export const ENC_ROWS = 'align';

// --- positions before centring: front key row at y = 0, first column at x = 0
const F = frontBlock();
const keyX = F.keyX4;
const half = KEYCAP / 2;

const leftEdge = Math.min(keyX[0] - U / 2, F.dispL);
const blockRight = Math.max(keyX[3] + half, F.dispR);
const e0 = firstEncoderX(blockRight);
const stepX = stepWallX(blockRight, e0, 'left block');
const encX = [0, 1, 2, 3, 4].map((i) => e0 + i * ENC_PX);

const left = leftEdge - MARGIN;
const right = encX[4] + Math.max(KNOB_D / 2, ENC_BODY.w / 2) + MARGIN;
const { bottom, top } = F;
const encRowsY = (() => {
  if (ENC_ROWS === 'align') return [F.dispY, F.keyY[0]];
  if (ENC_ROWS === 'even') {
    const gap = (top - bottom - 2 * KNOB_D) / 3;
    return [top - gap - KNOB_D / 2, bottom + gap + KNOB_D / 2];
  }
  const c = (bottom + top) / 2;
  return [c + ENC_PY / 2, c - ENC_PY / 2];
})();

const L = finish({
  keys: F.keyY.flatMap((y) => keyX.map((x) => [x, y])),
  encoders: encRowsY.flatMap((y) => encX.map((x) => [x, y])),
  left, right, bottom, top,
  plate: ({ sx, sy, CASE }) => wellPlate({ stepX: stepX + sx, stepY: F.stepY + sy, CASE }),
}, F);

export const { KEYS, ENCODERS, DISPLAY_POS, DISPLAY_AA, DISPLAY_HOLES, PCB, CASE, PLATE, DIMS } = L;
export const STEP = { x: stepX + L.SHIFT.sx, y: F.stepY + L.SHIFT.sy };   // wall centres: left block | encoders, keys | display
export const LAYOUT = L;

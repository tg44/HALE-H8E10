// Panel layout shared by the board, top, tray and assembly — one place to
// move things. Sketch only: positions are a starting point, not final.
//
// Coordinates: origin at the board centre, z = 0 on the main-PCB top
// surface, +Y away from the player. Left block: 2×4 keys at the front,
// the 2.79" bar display in a strip behind them. Right block: 2×5
// encoders. Spacing references: docs/layout-references.md; display:
// hardware/libs/datasheets/display/candidates.md.

export const U = 19.05;                 // MX key pitch
export const ENC_PX = 27;               // along a row: Intech EN16 ~26.75 — docs/layout-references.md
export const ENC_PY = 27;               // row to row, used by ENC_ROWS = 'pitch'
// how the two encoder rows sit in the board height:
//   'even'  — equal gaps: edge / between the knobs / edge
//   'align' — bottom row level with the front key row, top row with the screen centre
//   'pitch' — ENC_PY apart, centred
export const ENC_ROWS = 'align';
export const KEY_KNOB_GAP = 8;          // keycap/display edge → knob edge
export const MARGIN = 4;                // board edge beyond the outermost part
export const PCB_T = 1.6;               // D14

// parts (datasheets / reference models)
export const KEYCAP = 18;               // placeholder keycap base
export const KEYCAP_Z = 11.6;           // keycap underside at rest
export const TRAVEL = 4.1;              // KS-20 total travel
export const KNOB_D = 15;               // placeholder knob
export const ENC_BODY = { w: 12.5, h: 13.4, z: 6.5 };   // PEC11R-4xxxF-S

// 2.79" NV3007 bar (case/ref/display-279.part.js), landscape, header on the left
export const DISPLAY = { w: 78.0, h: 25.9 };            // module PCB, landscape
export const DISPLAY_ROT = 90;          // portrait model → landscape
export const HEADER_BODY = 2.5;         // male header plastic (typical)
export const DISPLAY_BACK = 2.6;        // back-side parts: 6.00 max − 2.0 − 0.2 − 1.2
export const DISPLAY_Z = Math.max(HEADER_BODY, DISPLAY_BACK) + 0.4;   // module back on spacers
export const GLASS_Z = DISPLAY_Z + 1.2 + 0.2 + 2.0;
const AA_SIZE = { w: 64.14, h: 21.28 };
const AA_OFF_X = -((78.0 / 2 - 4.06) - 69.43 / 2);      // AA centre, landscape, from the module centre
const HOLES = [[37.09, 10.0], [37.09, -10.0]];          // module holes, landscape, from the centre

// case — 3D printed, PLA/PETG, 0.4 mm nozzle
export const WALL = 2.0;                // outer and step walls (5 perimeters)
export const FLOOR = 2.0;
export const CLEAR = 0.5;               // board-to-wall gap
export const UNDER = 6.0;               // space under the board: XIAO (~4.4), header pins, encoder pins
export const PLATE_Z = 3.5;             // lowest underside of the top (switch plate)
export const SEG = {
  display: { under: GLASS_Z + 0.3, top: ENC_BODY.z + 2.0 },     // clears the glass; flush with the encoders
  keys: { under: PLATE_Z, top: 5.0 },                            // KS-20 clips: 1.5 plate, top at 5.0
  encoders: { under: ENC_BODY.z, top: ENC_BODY.z + 2.0 },        // sits on the bodies; nut clamps it
};
export const TOP_Z = Math.max(SEG.display.top, SEG.keys.top, SEG.encoders.top);
export const STEP_EDGE = { kind: 'fillet', size: 3.499 };   // the raised edges around the key area: 'fillet' | 'chamfer'
export const WINDOW_LAND = 5.3;         // flat top between the end of the step fillet and the screen window
export const WINDOW_PAD = 0.5;          // screen window = active area + this on every side

// --- positions before centring: front key row at y = 0, first column at x = 0
const half = KEYCAP / 2;
const keyX = [0, 1, 2, 3].map((i) => i * U);
const keyY = [0, U];
const dispX = (keyX[0] + keyX[3]) / 2;                  // centred over the key block
const stepY = keyY[1] + half + 0.5 + WALL / 2;          // keys | display step: pressed keycap clears it
const dispY = Math.max(
  stepY + WALL / 2 + 0.5 + DISPLAY.h / 2,                                  // module clears the step wall
  stepY - WALL / 2 + STEP_EDGE.size + WINDOW_LAND + WINDOW_PAD + AA_SIZE.h / 2,   // window starts after the land
);

const leftEdge = Math.min(keyX[0] - U / 2, dispX - DISPLAY.w / 2);
const blockRight = Math.max(keyX[3] + half, dispX + DISPLAY.w / 2);
const e0 = blockRight + KEY_KNOB_GAP + KNOB_D / 2;
const b2Min = blockRight + 0.5 + WALL / 2;
const b2Max = e0 - ENC_BODY.w / 2 - 0.5 - WALL / 2;
if (b2Min > b2Max) throw new Error('layout.js: left block and encoders too close for the step wall');
const stepX = (b2Min + b2Max) / 2;
const encX = [0, 1, 2, 3, 4].map((i) => e0 + i * ENC_PX);

const left = leftEdge - MARGIN;
const right = encX[4] + Math.max(KNOB_D / 2, ENC_BODY.w / 2) + MARGIN;
const bottom = keyY[0] - U / 2 - MARGIN;
// back edge: window → back edge equals front keycap → front edge (symmetry)
const keycapFrontGap = MARGIN + CLEAR + WALL + (U / 2 - half);
const windowTop = dispY + AA_SIZE.h / 2 + WINDOW_PAD;
const top = windowTop + keycapFrontGap - CLEAR - WALL;               // board edge
if (top < dispY + DISPLAY.h / 2 + 1) throw new Error('layout.js: display module too close to the board edge');
const encRowsY = (() => {
  if (ENC_ROWS === 'align') return [dispY, keyY[0]];
  if (ENC_ROWS === 'even') {
    const gap = (top - bottom - 2 * KNOB_D) / 3;
    return [top - gap - KNOB_D / 2, bottom + gap + KNOB_D / 2];
  }
  const c = (bottom + top) / 2;
  return [c + ENC_PY / 2, c - ENC_PY / 2];
})();
const sx = -(left + right) / 2, sy = -(bottom + top) / 2;

export const KEYS = keyY.flatMap((y) => keyX.map((x) => [x + sx, y + sy]));
export const ENCODERS = encRowsY.flatMap((y) => encX.map((x) => [x + sx, y + sy]));
export const DISPLAY_POS = [dispX + sx, dispY + sy];
export const DISPLAY_AA = { x: dispX + AA_OFF_X + sx, y: dispY + sy, ...AA_SIZE };
export const DISPLAY_HOLES = HOLES.map(([hx, hy]) => [dispX + hx + sx, dispY + hy + sy]);
export const STEP = { x: stepX + sx, y: stepY + sy };   // wall centres: left block | encoders, keys | display

export const PCB = { w: right - left, h: top - bottom };
export const CASE = { w: PCB.w + 2 * (CLEAR + WALL), h: PCB.h + 2 * (CLEAR + WALL), r: 4 };

// printer bed (top and tray print separately, each this footprint); keep
// room for a skirt/brim
export const BED = { long: 256, short: 235, spare: 4 };
if (Math.max(CASE.w, CASE.h) > BED.long - BED.spare || Math.min(CASE.w, CASE.h) > BED.short - BED.spare) {
  throw new Error(`layout.js: case ${CASE.w.toFixed(1)} × ${CASE.h.toFixed(1)} doesn't fit the ${BED.long} × ${BED.short} bed`);
}

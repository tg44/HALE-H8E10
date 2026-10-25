// Mini test board layout (H4): the H8E10's left 2×2 keys and the 2.79"
// display at exactly the same place relative to each other, plus 1–4
// encoders. The same part sizes and spacing rules as the big board
// (../lib/parts.js); only the encoder placement differs per variant.
//
// The free slot is where H8E10 keys 3–4 / 7–8 sit: right of the two key
// columns, in front of the display's right half. Rules used there:
//   - keycap edge → knob edge KEY_KNOB_GAP (8), as on the big board
//   - knob within the display width where possible, so the display keeps
//     setting the board width
//   - lowest knob MARGIN from the board edge, like every other part
//   - encoder body 0.5 clear of the display module (it sits on the same PCB)
// Knob → screen window is reported (WINDOW_GAP), not enforced: on the big
// board no knob sits in front of the screen.

import {
  U, KEYCAP, KNOB_D, ENC_BODY, ENC_PX, ENC_PY, MARGIN, KEY_KNOB_GAP, SEG, WALL, CLEAR, STEP_EDGE, MOUNT, ENC_POCKET,
} from '../lib/parts.js';
import { frontBlock, firstEncoderX, stepWallX, finish, wellPlate, encoderLeds } from '../lib/layout-core.js';

export * from '../lib/parts.js';

export const VARIANTS = [
  { value: 'h4e1', label: 'H4E1 — 1 encoder in the free slot' },
  { value: 'h4e2-row', label: 'H4E2 row — 2 side by side (board +10.5)' },
  { value: 'h4e2-stack', label: 'H4E2 stack — 2 stacked in front of the screen' },
  { value: 'h4e4', label: 'H4E4 — 2 × 2 (board +10.5)' },
  { value: 'h4e2-big', label: 'H4E2 big — H8E10 ENC1/ENC6 positions, slot empty' },
  { value: 'h4e3-big', label: 'H4E3 big — H8E10 ENC1/ENC6 + 1 in the slot' },
];
export const DEFAULT_VARIANT = 'h4e2-stack';

const F = frontBlock();
const half = KEYCAP / 2;
const keyX = [0, U];
const keyRight = keyX[1] + half;

// free slot
const slotMinX = firstEncoderX(keyRight);                     // 8 from the keycap
const slotMaxX = F.dispR - KNOB_D / 2;                        // knob inside the display width
const slotX = (slotMinX + slotMaxX) / 2;                      // one column, centred in the slot
// one column without the H8E10 column: the key well's wall leaves the same
// gap right of the keys as the case edge leaves left of them, and the
// column sits centred on the flat top between the end of the step slope
// and the case edge (board width still set by the display)
const caseLeft = Math.min(keyX[0] - U / 2, F.dispL) - MARGIN - CLEAR - WALL;
const caseRight = F.dispR + MARGIN + CLEAR + WALL;
const wellX = keyRight + ((keyX[0] - half) - caseLeft) + WALL / 2;   // wall centre
const colX = (wellX - WALL / 2 + STEP_EDGE.size + caseRight) / 2;
if (colX + KNOB_D / 2 > F.dispR) throw new Error('mini layout: centred column wider than the display');
if (stepWallX(keyRight, colX, 'keys') < keyRight + 0.5 + WALL / 2 || wellX > colX - ENC_BODY.w / 2 - 0.5 - WALL / 2) {
  throw new Error('mini layout: key well wall too close to the keys or the encoders');
}
const keyMidY = (F.keyY[0] + F.keyY[1]) / 2;                  // centre of the 2×2 key block
const frontY = F.bottom + MARGIN + KNOB_D / 2;                // lowest knob row
const backY = frontY + ENC_PY;                                // row behind it, 27 up
// H8E10's first encoder column (ENC1 top, ENC6 bottom; ENC_ROWS 'align')
const bigBlockRight = Math.max(F.keyX4[3] + half, F.dispR);
const bigX = firstEncoderX(bigBlockRight);

function encodersFor(v) {
  switch (v) {
    case 'h4e1': return { slot: [[colX, keyMidY]], big: [], well: wellX };
    case 'h4e2-row': return { slot: [[slotMinX, keyMidY], [slotMinX + ENC_PX, keyMidY]], big: [] };
    case 'h4e2-stack': return { slot: [[colX, backY], [colX, frontY]], big: [], well: wellX };
    case 'h4e4': return {
      slot: [[slotMinX, backY], [slotMinX + ENC_PX, backY], [slotMinX, frontY], [slotMinX + ENC_PX, frontY]],
      big: [],
    };
    case 'h4e2-big': return { slot: [], big: [[bigX, F.dispY], [bigX, F.keyY[0]]] };
    case 'h4e3-big': return { slot: [[slotX, keyMidY]], big: [[bigX, F.dispY], [bigX, F.keyY[0]]] };
    default: throw new Error(`mini layout: unknown variant ${v}`);
  }
}

export function miniLayout(variant = DEFAULT_VARIANT) {
  const { slot, big, well } = encodersFor(variant);
  const encoders = [...big.slice(0, 1), ...slot, ...big.slice(1)];   // back to front, left to right

  // encoder bodies in the slot must clear the display module on the PCB
  for (const [, y] of slot) {
    if (y + ENC_BODY.h / 2 + 0.5 > F.dispB) throw new Error(`mini layout ${variant}: encoder body under the display module`);
  }

  // key well: right wall between the keys and the slot encoders; with the
  // slot empty it is the H8E10 step wall (keys well under the whole display)
  const stepX = well ?? (slot.length
    ? stepWallX(keyRight, Math.min(...slot.map(([x]) => x)), 'keys')
    : stepWallX(bigBlockRight, bigX, 'left block'));

  const left = Math.min(keyX[0] - U / 2, F.dispL) - MARGIN;
  const right = Math.max(
    F.dispR,
    ...encoders.map(([x]) => x + Math.max(KNOB_D / 2, ENC_BODY.w / 2)),
  ) + MARGIN;
  const { bottom, top } = F;

  // mounting (D27): screws from below into inserts in the top's solid right
  // side, 3 mm in from the board edge — front corner, and just in front of
  // the display glass; one that would cut into an encoder pocket is dropped
  const leds = encoderLeds(encoders);
  const pockets = encoders.map(([x, y], i) => {
    const dir = Math.sign(leds[i][1] - y) || -1;
    const ya = y + dir * ENC_POCKET.led, yb = y - dir * ENC_POCKET.back;
    return { x0: x - ENC_POCKET.x, x1: x + ENC_POCKET.x, y0: Math.min(ya, yb), y1: Math.max(ya, yb) };
  });
  const r = MOUNT.insertHole / 2 + 1.2;                         // hole + two perimeters
  const clearOfPockets = ([x, y]) => pockets.every((p) =>
    x + r < p.x0 || x - r > p.x1 || y + r < p.y0 || y - r > p.y1);
  const screwX = right - 3;
  const screws = [[screwX, bottom + 3], [screwX, F.dispB - 0.5 - r]].filter(clearOfPockets);
  // towers: PCB support in the key area (centre of the 2×2 block, front-left
  // corner) and two locating pins under the display, clear of its M2 spacers
  const towers = [
    { x: U / 2, y: U / 2 },
    { x: keyX[0] - 8, y: F.keyY[0] - 8 },
    { x: F.dispL + 2.5, y: F.dispY + 8, pin: true },
    { x: F.dispX + 20, y: F.dispY + 8, pin: true },
  ];

  const L = finish({
    keys: F.keyY.flatMap((y) => keyX.map((x) => [x, y])),
    encoders,
    left, right, bottom, top,
    plate: ({ sx, sy, CASE }) => wellPlate({
      stepX: stepX + sx, stepY: F.stepY + sy, CASE,
      inserts: screws.map(([x, y]) => [x + sx, y + sy]),
      // the display module reaches over the encoder hollow: clear its glass there too
      extra: slot.length ? [{
        x0: F.dispL - 0.5 + sx, x1: Math.min(F.dispR + 0.5 + sx, CASE.w / 2 - WALL),
        y0: F.dispB - 0.5 + sy, y1: CASE.h / 2 - WALL, under: SEG.display.under,
      }] : [],
    }),
    tray: ({ sx, sy }) => ({
      towers: towers.map((t) => ({ ...t, x: t.x + sx, y: t.y + sy })),
      screws: screws.map(([x, y]) => [x + sx, y + sy]),
    }),
    dims: ({ sx, sy }) => {
      const d = [];
      if (slot.length) {
        // keycap edge → nearest knob edge
        const [ex, ey] = slot.reduce((a, b) => (b[0] < a[0] ? b : a));
        d.push({ axis: 'x', at: ey + sy - KNOB_D / 2 - 2, from: keyRight + sx, to: ex - KNOB_D / 2 + sx, side: -1 });
        // highest slot knob → screen window
        const [tx, ty] = slot.reduce((a, b) => (b[1] > a[1] ? b : a));
        d.push({ axis: 'y', at: tx + sx + KNOB_D / 2 + 3, from: ty + KNOB_D / 2 + sy, to: F.windowBottom + sy });
      }
      return d;
    },
  }, F);

  const topSlot = slot.length ? Math.max(...slot.map(([, y]) => y)) : null;
  return {
    ...L,
    VARIANT: variant,
    WINDOW_GAP: topSlot === null ? null : F.windowBottom - (topSlot + KNOB_D / 2),
    KEY_KNOB: KEY_KNOB_GAP,
  };
}

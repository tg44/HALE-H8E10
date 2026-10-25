// Part sizes, spacing rules and print rules shared by every layout
// (h8e10/, mini/). Moved here unchanged from the H8E10 layout.js; the
// layouts only decide where things go. Spacing references:
// docs/layout-references.md; display:
// hardware/libs/datasheets/display/candidates.md.

export const U = 19.05;                 // MX key pitch
export const ENC_PX = 27;               // along a row: Intech EN16 ~26.75 — docs/layout-references.md
export const ENC_PY = 27;               // row to row
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
export const AA_SIZE = { w: 64.14, h: 21.28 };
export const AA_OFF_X = -((78.0 / 2 - 4.06) - 69.43 / 2);      // AA centre, landscape, from the module centre
export const DISPLAY_HOLE_OFFS = [[37.09, 10.0], [37.09, -10.0]];   // module holes, landscape, from the centre

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

// encoder LED windows (pcb-notes "Per-encoder cell"): one reverse-mount
// SK6812MINI-E per encoder, 10.5 from the shaft towards the other encoder
// row (board: cutout 3.48 × 3.08, courtyard ±1.87 across). The top over it
// prints in two materials: a transparent plug locked in a black sandwich,
//   black skin, opening w × h          (top, `skin` thick)   plug fills it
//   transparent, (w, h) + 2 · flange   (middle, the rest)    plug
//   black, opening w × h               (below)
// so the plug can't push in or out even if the two materials don't bond.
// In the 2.0 mm encoder segment: 0.6 / 0.8 / 0.6 = 3 / 4 / 3 layers at 0.2.
// w runs across the shaft → LED line, h along it (away from the knob).
// style: 'bridge' — the opening below stays empty and the flange bridges
//   over it, resting on the black around it (printing bottom-up, top layer
//   last); 'fill' — the plug also fills the bottom skin (printing top-down).
export const ENC_LED_OFF = 10.5;
export const LED_WINDOW = { w: 4.0, h: 2.0, r: 0.5, flange: 1.0, skin: 0.6, style: 'bridge' };
// The encoder area of the top is solid from PLATE_Z up (it can't go lower:
// printed bottom-up, PLATE_Z is the first layer), with
//   - a pocket per encoder: ±x across, `led` towards its LED (switch pins at
//     7.0, Ø2 pads), `back` on the A-C-B side (courtyard 9.0); the top
//     still rests on the body at ENC_BODY.z
//   - a light channel w × h per LED, straight up into its window, so no LED
//     can light another's window (the 3.5 mm gap over the PCB leaves no
//     straight path into a neighbour's channel and out of its window)
export const ENC_POCKET = { x: 7.35, led: 8.0, back: 9.0 };
// Assembly (mini, D27): tray, PCB on tray towers, top dropped on (resting
// on the tray walls, encoders through their holes), keys clipped in,
// encoder nuts, then M2 screws from under the tray into heat-set inserts
// in the top. Brass or nylon only (no steel near the sensors).
//   insert hole: Ø3.2 × 4.0 deep — typical for an M2 × 3 brass insert,
//     not from the chosen insert's datasheet (unverified)
//   screw: Ø2.4 clearance through tray and column, head counterbore
//     Ø4.4 × 1.5 from below (M2 heads are ~Ø3.8–4.0)
//   tower: Ø6 post from the tray floor to the PCB underside; a pin tower
//     adds a Ø2.0 pin into a Ø2.2 PCB hole, tip flush with the PCB top
export const MOUNT = {
  insertHole: 3.2, insertDepth: 4.0, boss: 6.0,
  screwHole: 2.4, head: 4.4, headDepth: 1.5,
  tower: 6.0, pin: 2.0, pcbHole: 2.2,
};

// printer bed (top and tray print separately, each this footprint); keep
// room for a skirt/brim
export const BED = { long: 256, short: 235, spare: 4 };

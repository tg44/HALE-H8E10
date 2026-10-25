// Bottom tray for a layout sketch: floor + walls up to the plate. Room
// under the board for the XIAO and encoder pins (parts.js UNDER). No USB-C
// opening or antenna spot yet. Call inside a part() body.
//
// Optional, from the layout's TRAY spec (the mini, D27):
//   towers  — Ø MOUNT.tower posts holding the PCB from below; `pin` adds a
//             locating pin through a PCB hole
//   screws  — the same posts with a clearance hole and a head counterbore
//             from below, for the screws into the top's inserts

import { sketch, extrude, cut, plane, color, circle } from 'fluidcad/core';
import { rect } from 'fluidcad/shapes';
import { PCB_T, UNDER, FLOOR, PLATE_Z, WALL, MOUNT } from './parts.js';

export function buildTray({ CASE, TRAY = {} }) {
  const bottom = -PCB_T - UNDER - FLOOR;
  const floorTop = bottom + FLOOR;

  sketch(plane('xy', bottom), () => { rect([0, 0], CASE.w, CASE.h).centered().radius(CASE.r); });
  extrude(FLOOR);
  sketch(plane('xy', floorTop), () => {
    rect([0, 0], CASE.w, CASE.h).centered().radius(CASE.r);
    rect([0, 0], CASE.w - 2 * WALL, CASE.h - 2 * WALL).centered().radius(CASE.r - WALL);
  });
  extrude(PLATE_Z - floorTop);

  const posts = [...(TRAY.towers ?? []).map((t) => [t.x, t.y]), ...(TRAY.screws ?? [])];
  if (posts.length) {
    sketch(plane('xy', floorTop), () => { for (const [x, y] of posts) circle([x, y], MOUNT.tower); });
    extrude(-PCB_T - floorTop);
  }
  const pins = (TRAY.towers ?? []).filter((t) => t.pin);
  if (pins.length) {
    sketch(plane('xy', -PCB_T), () => { for (const { x, y } of pins) circle([x, y], MOUNT.pin); });
    extrude(PCB_T);
  }
  if (TRAY.screws?.length) {
    sketch(plane('xy', -PCB_T), () => { for (const [x, y] of TRAY.screws) circle([x, y], MOUNT.screwHole); });
    cut(-PCB_T - bottom);
    sketch(plane('xy', bottom), () => { for (const [x, y] of TRAY.screws) circle([x, y], MOUNT.head); });
    cut(-MOUNT.headDepth);
  }

  color('#55595f');
}

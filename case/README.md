# Case

Tray + plate, 3D printed for v0. Plate: FR4 or printed, no steel.
Modelled in [FluidCAD](https://github.com/Fluid-CAD/FluidCAD) (parametric
CAD written as JavaScript), alongside the board — track B in
[docs/plan.md](../docs/plan.md). Reference models are in `ref/`;
downloaded STEP models in `../hardware/libs/3dmodels/`.

## Setup

```
cd case
npm install fluidcad
npx fluidcad init
npx fluidcad serve
```

Parts are `*.part.js`, assemblies `*.assembly.js`.

## Board in, case out

- board → case: `kicad-cli pcb export step` from the KiCad project, import
  the STEP into the assembly. Re-export after every placed part group.
- case → print: `npx fluidcad export stl`
- reference parts (keycap, knob, display module, XIAO): STEP where a model
  exists, drawn from the datasheet where it doesn't (`ref/`).

## Files

- `lib/` — shared by both boards
  - `parts.js` — part sizes, spacing and print rules (D18); change
    shared numbers here
  - `layout-core.js` — the key block + display strip both boards keep,
    step walls, centring, the plate's wells and hollows
  - `board.js`, `plate.js` (the stepped top), `tray.js`, `annotations.js`
    — builders that turn any layout into geometry
  - `tray.js` also builds the mini's PCB towers and screw columns (D27)
  - `windows.js` — the transparent plugs of the encoder LED windows; print
    them with the plate, same origin, on the second extruder
- `h8e10/` — the full board
  - `layout.js` — every H8E10 position (D18); move things here
  - `h8e10.assembly.js` — the layout sketch (board, tray, top, parts);
    export and print from this one
  - `h8e10-dims.assembly.js` — the same plus dimension marks, for
    checking distances only
  - `board.part.js`, `plate.part.js`, `windows.part.js`, `tray.part.js`,
    `annotations.part.js` — thin wrappers around `lib/`
- `mini/` — the H4E2 test board (D26): the left 2×2 keys and the display
  of the H8E10, plus two stacked encoders (`h4e2-stack`, the default
  variant; the other 1–4 encoder layouts are kept for comparison)
  - `layout.js` — `VARIANTS`, `miniLayout(variant)`
  - `mini.assembly.js` / `mini-dims.assembly.js` — one variant (pick it
    in the Parameters panel)
  - `variants.assembly.js` — every variant side by side, view only
- `ref/` — KS-20, PEC11R, M7 nut/washer, 2.79" and 1.54" displays,
  placeholder keycap and knob

Exporting: while a `fluidcad serve` runs, `npx fluidcad export` exports
the file open in that viewer, not the one named with `-e`, and `export
png` can capture the previous model. Export with the viewer closed, or
from a copy of this folder (`-w`).

## Things the case must do

- hold the KS-20 switches in the plate (they are not soldered)
- clamp the encoders with their M7 nuts (D17)
- display window over the active area
- USB-C opening at the XIAO, access to its BOOT button
- room under the board for the XIAO, which hangs from the bottom
- a spot for the U.FL antenna away from the hall sensors
- no steel near the sensors: brass or nylon hardware

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

- `layout.js` — every position and height (D18); change things here
- `h8e10.assembly.js` — the layout sketch (board, tray, top, parts); export
  and print from this one
- `h8e10-dims.assembly.js` — the same plus dimension marks
  (`annotations.part.js`), for checking distances only
- `board.part.js`, `plate.part.js` (the stepped top), `tray.part.js`
- `ref/` — KS-20, PEC11R, M7 nut/washer, 2.79" and 1.54" displays,
  placeholder keycap and knob

## Things the case must do

- hold the KS-20 switches in the plate (they are not soldered)
- clamp the encoders with their M7 nuts (D17)
- display window over the active area
- USB-C opening at the XIAO, access to its BOOT button
- room under the board for the XIAO, which hangs from the bottom
- a spot for the U.FL antenna away from the hall sensors
- no steel near the sensors: brass or nylon hardware

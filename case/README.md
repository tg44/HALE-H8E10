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
  exists, a dimensioned block where it doesn't. Display dimensions are in
  hardware/libs/datasheets/display/display.md.

## Things the case must do

- hold the KS-20 switches in the plate (they are not soldered)
- display window over the active area
- USB-C opening at the XIAO, access to its BOOT button
- room under the board for the XIAO, which hangs from the bottom
- a spot for the U.FL antenna away from the hall sensors
- no steel near the sensors: brass or nylon hardware

# Hardware

- `kicad/` — KiCad 10 project `h8e10.kicad_pro`
- `libs/` — project-local symbols (`h8e10.kicad_sym`), footprints
  (`h8e10.pretty/`), 3D models (`3d/`), datasheets (`datasheets/`). Every
  part used on the board gets all of them here, so the project opens
  without any globally installed library.

Where parts come from:

- LCSC parts: `easyeda2kicad --full --lcsc_id=Cxxxx` gives symbol, footprint
  and 3D model in one go. Check the result against the datasheet.
- switches: marbastlib, ai03 MX_V2
- XIAO: Seeed OPL_Kicad_Library
- display: Cuprum77/kicad-displays

Copy what is used into `libs/`; don't reference the upstream libraries.

See `docs/pcb-notes.md` before placing anything, and `docs/plan.md` for the
order parts are collected and placed in.

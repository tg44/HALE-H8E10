# Hardware

- `H8E10/` — KiCad 10 project `HALE-H8E10.kicad_pro`, the full board
- `H4E2/` — KiCad 10 project `H4E2.kicad_pro`, the mini test board (D26);
  started as a copy of the H8E10 project
- `libs/` — project-local symbols (`HALE-git.kicad_sym`), footprints
  (`HALE-git.pretty/`), 3D models (`3dmodels/`, sources in its SOURCES.md), datasheets
  (`datasheets/<group>/`: adc, display, encoder, hall, io-expander, led,
  mcu, power, switch). Every
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

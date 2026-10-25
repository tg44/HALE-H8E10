# HALE H8E10

Open-hardware USB-MIDI pad controller: 8 hall-effect keys, 10 push
encoders, 2.79" bar display, 18 RGB LEDs, Seeed XIAO ESP32S3 Plus. Board
routed, nothing ordered yet; firmware not started. Before v0, a mini test
board H4E2 (4 keys, 2 encoders, the same display; D26) is built first:
KiCad project `hardware/H4E2/` (started as a copy of `hardware/H8E10/`),
case in `case/mini/`.

## How to work here

The owner is learning electronics with this project. It is AI-assisted, not
AI-generated, and the README says so publicly.

- Explain the why behind every EE suggestion (what the part does, what
  breaks without it), briefly. Don't just hand over a result.
- The owner draws the schematic and layout in KiCad. Don't generate or
  bulk-edit `.kicad_sch` / `.kicad_pcb` files unless asked; review, check
  and advise instead.
- Part facts (pinouts, package dimensions, ratings, LCSC numbers) come from
  the datasheet, not from memory. If a datasheet isn't in
  `hardware/libs/datasheets/` or wasn't looked up, say the value is
  unverified.
- Say so plainly when a choice in the docs looks wrong.
- Before advising on a design decision, read `docs/plan.md` and the docs it
  touches (`decisions.md`, `pinout.md`, `bom.md`, `pcb-notes.md`). Advice
  has to start from what's already decided — e.g. the hall sensors go to an
  external MCP3208 (D5), not the ESP32's own ADC; reasoning about the
  wrong ADC once cost a round of corrections.

## Fixed decisions (docs/decisions.md has the reasons)

- Hall/magnetic switches only (Gateron KS-20 + DRV5055A3, D15). No mechanical or
  hot-swap switches anywhere.
- All soldered parts on the bottom, including the XIAO. Top: switches,
  encoders (bolted to the case top, D17), display (header soldered, D16) only.
- v0 is fully hand-soldered by a professional. No fab assembly, no
  pick-and-place constraints.
- No breadboard bench tests; the H4E2 mini board (D26) is the one test
  before v0.
- The case top prints bottom-up (top layer last): nothing may hang below
  its underside (3.5 mm above the PCB) — no bosses, no baffles (D27).
- 1.6 mm 2-layer board (D14), no steel near the sensors.

## Workflow

`docs/plan.md` is the source of truth. Three parallel tracks:

- A. collect + build: per part group — symbol + footprint + 3D model +
  datasheet → schematic → placed on the board → fit check. Schematic and
  layout grow together; a group can be placed before the nets it depends
  on exist.
- B. case and 3D models in FluidCAD, checked against the board STEP after
  every placed group.
- C. firmware.

## Docs

- `docs/decisions.md` — append a new `D<n>` entry when a decision changes;
  don't rewrite old ones (history starts with the first commit).
- `docs/pinout.md`, `docs/bom.md`, `docs/pcb-notes.md` describe the current
  design; keep them in sync with each other when one changes.
- Firmware docs follow `firmware/AGENTS.md` (feature folders, task lists,
  test IDs, manual check tables); read it before touching `firmware/`.
- Datasheets live in `hardware/libs/datasheets/<group>/` (adc, display,
  encoder, hall, io-expander, led, mcu, power, switch); notes about one
  part sit next to them (e.g. `display/1.54/display.md`, `display/candidates.md`). 3D models are in
  `hardware/libs/3dmodels/`, sources in its `SOURCES.md`.
- Tick the checkboxes in `docs/plan.md` as steps are done.

## Tools

- KiCad 10. `kicad-cli` is not on PATH:
  `/Applications/KiCad/KiCad.app/Contents/MacOS/kicad-cli`
  (ERC/DRC: `sch erc`, `pcb drc`; board model: `pcb export step`).
- FluidCAD in `case/` (`*.part.js`, `*.assembly.js`; `npx fluidcad serve`,
  `npx fluidcad export step|stl|png`). Shared sizes and builders in
  `case/lib/`, the boards in `case/h8e10/` and `case/mini/`. While a
  `fluidcad serve` runs, `export` exports the file open in that viewer, not
  `-e`; `export png` also lags one file behind. Export from a copy of
  `case/` (`-w`) or with the viewer closed. It has an MCP server:
  `claude mcp add --scope user FluidCAD -- npx -y fluidcad mcp`.
- Project-local libraries only (`hardware/libs/`); LCSC parts via
  `easyeda2kicad`.

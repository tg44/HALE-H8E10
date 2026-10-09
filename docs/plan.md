# Build plan

v0 is one hand-soldered board. There is no bench-test phase: the v0 board
is the test (see D12 in decisions.md). Nothing is ordered yet.

Three tracks run side by side:

- **A. Collect + build** — the board, one part group at a time
- **B. Mechanical** — case, plate and 3D models in FluidCAD
- **C. Firmware** — starts on a bare XIAO, long before the board exists

## Track A — collect + build

Schematic and layout grow together. For every part group:

1. **Collect**: symbol + footprint + 3D model + datasheet into
   `hardware/libs/`. Check the footprint against the datasheet drawing
   (pad pitch, pin 1, body outline), not against another library.
2. **Draw**: add the group to the schematic, with its local passives.
3. **Place**: put the group on the board, as a KiCad group if it repeats.
   Nets that belong to a later group stay as labels / unrouted ratsnest.
4. **Check the fit**: export STEP, look at it against the case (track B).

A group is done when it sits on the board and fits. Wiring it to the rest
can wait for the group that owns the other end — e.g. keys and encoders
are placed with their LEDs before the LED power/data section exists.

### A0. Project setup

- [ ] KiCad project `hardware/kicad/h8e10`, project-local lib tables
- [ ] board setup: 2-layer, 1.6 mm, fab's design rules
- [ ] rough outline and origin; key grid 19.05 mm
- [ ] STEP export working (`kicad-cli pcb export step`)

### A1. XIAO ESP32S3 Plus

- [ ] symbol with all 20 GPIO, footprint with the half-pitch castellations,
      3D model
- [ ] **double-check the XIAO footprint** against Seeed's
      `datasheets/mcu/seeed-xiao-esp32s3-plus-bottom.dxf` and the pinout sheet
      (`…-pinout.xlsx`): castellation pitch, half-pitch pads, pin 1
      orientation when flipped to the bottom
- [ ] placed on the **bottom**, USB-C at a board edge
- [ ] power labels: 5V, 3V3 (XIAO), GND

### A2. Key cell ×8

- [ ] KS-20 footprint + 3D model
- [ ] **double-check the KS-20 footprint** against the Gateron drawing
      (`hardware/libs/datasheets/switch/gateron-ks-20-…pdf` p.5, "Layout of
      PCB"): two Ø1.70 mm peg holes at ±5.08 mm, **no Ø4 mm centre
      hole** (that's where the sensor goes), no electrical pads
- [ ] peg clearance on B.Cu: pegs stick out ~1.1 mm below a 1.6 mm board;
      nothing soldered on top of them, case floor clear
- [ ] DRV5055A3 (SOT-23) + 100 nF + 1 kΩ, sensor position from a reference
      design (D12, D15)
- [ ] **double-check the sensor footprint** against both datasheets: TI
      DBZ land pattern (DRV5055 p.30) and SS39ET fig. 4 — feet of both
      parts must land on the pads; pin 1 VCC, 2 OUT, 3 GND; package
      centre on the switch axis (pcb-notes, per-key cell)
- [ ] SK6812MINI-E(A) + 100 nF, cutout at the LED window
- [ ] one cell grouped, checked, then copied ×8 in 2×4

### A3. Encoder cell ×10

- [ ] EC11-class encoder footprint + 3D model, knob model
- [ ] 2 × 1 nF on A/B
- [ ] LED + 100 nF; position decided with the knob/case model
- [ ] one cell grouped, then copied ×10 in two rows of five

### A4. Display

- [ ] 8-pin socket + 4 × M2 holes (27 × 38.7 mm), module 3D model
- [ ] **double-check the socket position together** against the drawing
      (`hardware/libs/datasheets/display/display-1.54-front.png`) and a real module with calipers:
      pin row centre 1.5 from the module top edge = **1.0 above the top
      hole centres**, pins centred (±8.89), pin 1 GND on the left from the
      front, pin holes Ø0.9
- [ ] outline and active area on Dwgs.User for the case window

### A5. ADC + analog rail

- [ ] MCP3208, VREF on the filtered rail, 1 µF at VREF
- [ ] **double-check the MCP3208 footprint** (SOIC-16) and pin 1 against
      `datasheets/adc/microchip-mcp3208.pdf`
- [ ] ferrite + 10 µF + 100 nF → `3V3A`
- [ ] 100 nF at each ADC input (other half of the sensor RC)
- [ ] sensor nets from A2 connected

### A6. Expanders

- [ ] 2 × MCP23017, 0x20/0x21, I2C pull-ups, INT wired-OR
- [ ] 30 encoder lines from A3 connected, 2 pins spare

### A7. LED chain

- [ ] 74AHCT1G125, 220 Ω series, bulk cap on 5 V
- [ ] chain order chosen for short data hops; 2 status LEDs placed

### A8. Power

- [ ] 3.3 V LDO from the XIAO 5V pin, in/out caps
- [ ] test points: 5V, 3V3, 3V3A, GND, both SPIs, I2C, LED_DATA

### A9. Finish

- [ ] final pin assignment on the XIAO, written back to pinout.md
- [ ] ERC clean
- [ ] route; ground pour both sides; stitching around the sensor cluster
- [ ] mounting holes agreed with the case
- [ ] silkscreen on the bottom: designators, pin 1, LED and cap polarity
- [ ] DRC clean against the fab's 2-layer rules
- [ ] full-assembly check in 3D with case, knobs and keycaps
- [ ] someone else looks at it before ordering (see README, feedback)

## Track B — mechanical (parallel to A)

- [x] FluidCAD project in `case/`
- [ ] reference models: keycap, knob, display module, XIAO (STEP imports
      where they exist, simple blocks where they don't)
  - [x] display module: `case/ref/display-154.part.js` (drawn)
  - [x] KS-20: `case/ref/ks20.part.js` (drawn) + Gateron STEP in
        `hardware/libs/3dmodels/`
  - [x] XIAO, PEC11R, EC11E: STEP in `hardware/libs/3dmodels/` (see
        SOURCES.md; orientations differ, check before use)
  - [ ] keycap, knob
- [ ] board STEP from KiCad imported; re-import after every placed group
- [ ] plate: switch cutouts, encoder holes, display window
- [ ] tray: USB-C opening, BOOT/RESET access, antenna spot, standoffs,
      bottom clearance for the XIAO
- [ ] stack-up check: keycap top, knob top and display glass heights
- [ ] test print of the plate before the PCB is ordered

## Track C — firmware

Before the board exists (bare XIAO on USB):

- [ ] C0. project skeleton, builds and flashes
- [ ] C1. USB-MIDI device enumerates, sends a test note
- [ ] C2. settings storage (NVS) and the settings data model
- [ ] C3. BLE-MIDI
- [ ] C4. Wi-Fi settings page skeleton

Needs the board (doubles as bring-up, in this order):

- [ ] C5. LEDs (confirms 5 V rail and level shifter)
- [ ] C6. display
- [ ] C7. expanders + encoders: Gray-code decode, push, acceleration
- [ ] C8. ADC + sensors: raw dump, per-key calibration
- [ ] C9. key engine: actuation, velocity, aftertouch, rapid trigger
- [ ] C10. MIDI mapping: notes, relative CC, DJ / Ableton modes
- [ ] C11. settings mode on the device (see firmware/README.md)
- [ ] C12. web UI: MIDI map editor, calibration view

## Order and assembly

- [ ] PCBs: 5 × bare, 2-layer, 1.6 mm
- [ ] re-check every LCSC number in bom.md against its part and stock
      (C22412 was wrong once; stock moves daily)
- [ ] parts per bom.md, with spares of the small stuff, incl. 3–4
      DRV5055A4 as clip spares
- [ ] interactive BOM (iBom) for the person soldering
- [ ] assembly: bottom SMD → XIAO → encoders and display socket on top
- [ ] power rails checked before first USB plug-in to a computer
- [ ] bring-up = C5…C8
- [ ] rev-1 notes

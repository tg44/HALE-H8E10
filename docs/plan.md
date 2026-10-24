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

- [x] KiCad project `hardware/kicad/HALE-H8E10.kicad_pro` (made in pcbjam; libs pinned in `pcbjam.lock.json`, own parts in `libs/HALE-git.*`)
- [ ] project-local lib tables / `${KIPRJMOD}` model paths so desktop KiCad opens it too
- [x] board setup: 2-layer, 1.6 mm, fab's design rules (JLCPCB `.kicad_dru`)
- [x] rough outline and origin; key grid 19.05 mm (217 × 77.68, R5 corners)
- [ ] STEP export working (`kicad-cli pcb export step`)

### A1. XIAO ESP32S3 Plus

- [x] symbol with all 20 GPIO, footprint with the half-pitch castellations,
      3D model
- [x] **double-check the XIAO footprint** against Seeed's
      `datasheets/mcu/seeed-xiao-esp32s3-plus-bottom.dxf` and the pinout sheet
      (`…-pinout.xlsx`): castellation pitch, half-pitch pads, pin 1
      orientation when flipped to the bottom (2026-10-19: pads overlaid on
      the DXF, D0 top-left / 5V top-right after the flip)
- [x] placed on the **bottom**, USB-C at a board edge (back edge, ~1.5 mm overhang)
- [x] power labels: 5V, 3V3 (XIAO), GND

### A2. Key cell ×8

- [x] KS-20 footprint + 3D model
- [x] **double-check the KS-20 footprint** against the Gateron drawing
      (`hardware/libs/datasheets/switch/gateron-ks-20-…pdf` p.5, "Layout of
      PCB"): two Ø1.70 mm peg holes at ±5.08 mm, **no Ø4 mm centre
      hole** (that's where the sensor goes), no electrical pads
- [x] peg clearance on B.Cu: pegs stick out ~1.1 mm below a 1.6 mm board;
      nothing soldered on top of them, case floor clear
- [x] DRV5055A3 (SOT-23) + 100 nF (the 1 kΩ moved to A5, D19), sensor position from a reference
      design (D12, D15)
- [x] **double-check the sensor footprint** (superseded by D21: stock SOT-23; pinout checked 2026-10-19) against both datasheets: TI
      DBZ land pattern (DRV5055 p.30) and SS39ET fig. 4 — feet of both
      parts must land on the pads; pin 1 VCC, 2 OUT, 3 GND; package
      centre on the switch axis (pcb-notes, per-key cell)
- [x] SK6812MINI-E(A) + 100 nF, cutout at the LED window
- [x] one cell grouped, checked, then copied ×8 in 2×4

### A3. Encoder cell ×10

- [x] PEC11R-4215F-S0024 footprint (check against the Bourns drawing) + 3D model; knob model still open;
      lug slots ≥ 2.6 × 1.8 at 11.4 centres (pcb-notes)
- [x] **double-check the encoder pad numbers against the schematic symbol**
      (`RotaryEncoder_Switch_MP`: A, B, C, S1, S2, MP): the easyeda2kicad
      footprint numbers pads its own way, and a mismatch swaps A/C or wires
      the push switch into the quadrature lines
- [x] 2 × 1 nF on A/B
- [x] LED + 100 nF, 10.5 mm from the shaft; the case needs a light pipe there (pcb-notes)
- [x] one cell grouped, then copied ×10 in two rows of five

### A4. Display

- [x] 2.79" bar (D16): 8 × Ø1.0 header holes + 2 × M2 spacer holes,
      module 3D model (`case/ref/display-279.part.js`)
- [x] **double-check the header and spacer positions together** against
      the drawing (`hardware/libs/datasheets/display/2.79/`) and a real
      module with calipers: header row 1.65 from the module edge, pins
      centred (±8.89), GND first; spacer holes 20.0 apart, 1.91 from the far
      edge (74.44 from the header row); back-part height ≤ 2.6
- [x] find an NV3007 datasheet (`datasheets/display/nv3007-datasheet-v1.0.pdf`)
- [ ] outline and active area on Dwgs.User for the case window

### A5. ADC + analog rail

- [x] MCP3208, VREF on the filtered rail, 1 µF at VREF
- [x] **double-check the MCP3208 footprint** (SOIC-16) and pin 1 against
      `datasheets/adc/microchip-mcp3208.pdf`
- [x] ferrite + 10 µF + 100 nF → `3V3A`
- [x] sensor RC at the ADC (D19): 2 × 1 kΩ 4-resistor arrays (`R_Pack04`,
      `R_Array_Convex_4x0603`) + 100 nF at each ADC input
- [x] **double-check the array pairing**: symbol resistor n is pins n ↔ 9−n;
      the footprint and the 4D03 datasheet must pair the same pads
- [x] sensor nets from A2 connected

### A6. Expanders

- [x] 2 × MCP23017, 0x20/0x21, I2C pull-ups, INT wired-OR
- [x] 28 encoder lines from A3 on bits 0–6 (GPA7/GPB7 are output-only, D20), ENC1_SW + one more push to the XIAO; pinout.md rules

### A7. LED chain

- [x] 74AHCT1G125, 220 Ω series; bulk = 4 × 10 µF on `+5V_LED` behind a soft-start switch (D23)
- [x] chain order chosen for short data hops, **ENC1's LED first** (D22)

### A8. Power

- [x] 3.3 V LDO from the XIAO 5V pin, CE to VIN, in/out caps (output cap before the ferrite, pcb-notes)
- [x] 5 V split into `+5V_AUX` / `+5V_LED` with TPS22810 switches (D23)
- [x] test points: 5V, 5V_AUX, 5V_LED, 3V3, 3V3A, GND (no signal test points; pcb-notes)

### A9. Finish

- [x] final pin assignment on the XIAO, written back to pinout.md (movable pins listed there)
- [x] ERC clean (0 errors, 2026-10-15)
- [x] route; ground pour both sides (stitching around the sensor cluster: check)
- [x] mounting holes on the board, 12 on a grid (pcb-notes, D24)
- [ ] case: insert bosses (3.5 mm in the key area) and tray pins at those holes
- [x] silkscreen: designators hidden (iBoM instead), pin 1 and LED marks, test-point labels, `Logo H8E10` mark (HALE-git) top and bottom, `${REVISION}` set in the title block
- [x] LCSC fields: fix C1004/C1005/C2016 (C15849), add the missing ones from bom.md, then Update PCB from Schematic
- [x] DRC clean against the fab's 2-layer rules (2026-10-19, before the holes)
- [ ] full-assembly check in 3D with case, knobs and keycaps
- [ ] decide: a test pad on GPIO43 (UART0 TX) for logs once USB carries MIDI (firmware/docs/usb.md, system feature)
- [ ] someone else looks at it before ordering (see README, feedback)

## Track B — mechanical (parallel to A)

- [x] FluidCAD project in `case/`
- [ ] reference models: keycap, knob, display module, XIAO (STEP imports
      where they exist, simple blocks where they don't)
  - [x] display modules: `case/ref/display-279.part.js` (chosen, D16),
        `display-154.part.js` (fallback)
  - [x] KS-20: `case/ref/ks20.part.js` (drawn) + Gateron STEP in
        `hardware/libs/3dmodels/`
  - [x] XIAO, PEC11R, EC11E: STEP in `hardware/libs/3dmodels/` (see
        SOURCES.md; orientations differ, check before use)
  - [ ] keycap, knob
- [ ] board STEP from KiCad imported; re-import after every placed group
- [x] layout sketch: `case/layout.js` + `h8e10.assembly.js` (D18);
      dimensions view `h8e10-dims.assembly.js`
- [x] top (sketch): switch cutouts, encoder holes, display window,
      stepped heights with fillet (`case/plate.part.js`)
- [ ] test coupon: switch cutouts 13.9 / 14.0 / 14.1, bushing holes
      7.3 / 7.4 / 7.5, a 3.5 fillet step
- [ ] stiffer switch plate: thicker with 1.5 mm clip pockets
- [ ] translucent parts (LED diffusers, knob skirts), PETG, dual toolhead
- [ ] tray: USB-C opening, BOOT/RESET access, antenna spot, standoffs,
      bottom clearance for the XIAO
- [ ] stack-up check: keycap top, knob top and display glass heights
- [ ] test print of the plate before the PCB is ordered

## Track C — firmware

Milestones only. The detailed task lists and hardware checks live per
feature: [firmware/docs/features.md](../firmware/docs/features.md); the
order of checks on a fresh board: [bringup.md](../firmware/docs/bringup.md).

Before the board exists (bare XIAO on USB):

- [ ] C0. project skeleton (pioarduino, envs `native` / `xiao` /
      `xiao-usbmidi`, firmware/docs/toolchain.md), builds and flashes
- [ ] C1. USB-MIDI spike: enumerates, sends a test note, back to the
      bootloader; test "reboot without MIDI" (firmware/docs/usb.md). Then
      develop on the `xiao` env; MIDI goes to the log / BLE until C13
- [ ] C2. settings storage (NVS) and the settings data model
- [ ] C3. BLE-MIDI
- [ ] C4. Wi-Fi settings page skeleton + OTA update

Needs the board (doubles as bring-up, in this order; C9–C12 logic can
start earlier in the `native` env):

- [ ] C5. LEDs (confirms 5 V rail and level shifter)
- [ ] C6. display (NV3007: Arduino_GFX `Arduino_NV3007` or an esp_lcd component)
- [ ] C7. expanders + encoders: Gray-code decode, push, acceleration
- [ ] C8. ADC + sensors: raw dump, per-key calibration
- [ ] C9. key engine: actuation, velocity, aftertouch, rapid trigger
- [ ] C10. MIDI mapping: notes, relative CC, DJ / Ableton modes
- [ ] C11. settings mode on the device (firmware/docs/features/settings/)
- [ ] C12. web UI: MIDI map editor, calibration view
- [ ] C13. USB-MIDI on: needs OTA and a log path without the USB console
      (firmware/docs/usb.md), then switch to the `xiao-usbmidi` env

## Order and assembly

- [ ] PCBs: 5 × bare, 2-layer, 1.6 mm
- [ ] re-check every LCSC number in bom.md against its part and stock
      (C22412 was wrong once; stock moves daily)
- [ ] parts per bom.md, with spares of the small stuff, incl. 3–4
      DRV5055A4 as clip spares
- [ ] interactive BOM (iBom) for the person soldering
- [ ] assembly: bottom SMD → XIAO → encoders and display (spacers, header) on top
- [ ] power rails checked before first USB plug-in to a computer
- [ ] bring-up = C5…C8
- [ ] rev-1 notes

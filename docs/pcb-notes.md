# PCB and assembly notes

## Stack and sides

- 2-layer, **1.6 mm** FR4 (D14: the KS-20 magnet is strong; the extra
  0.4 mm keeps the sensor out of clipping at bottom-out. 1.6 mm is also
  what the open hall boards use, D15)
- Bottom (B.Cu): everything that is soldered flat — sensors, LEDs, ICs,
  passives **and the XIAO**. All SMD work happens on one side.
- Top (F.Cu): only what the user touches — hall switches, encoders,
  the display (header soldered in, D16).
- v0 is hand-soldered (D10). No pick-and-place constraints, but keep it
  friendly to an iron: see "Hand assembly" below.

## Per-key cell

Three separate footprints, placed once and copied as a KiCad **group**
(Ctrl+G); do not merge them into one footprint — each part needs its own
designator.

- KS-20 switch footprint: two Ø1.70 mm peg holes at ±5.08 mm, **no
  centre post hole** — the centre is where the sensor sits (KS-20 drawing,
  "Layout of PCB"). Don't use a stock MX footprint; its Ø4 mm centre hole
  would cut the sensor pads. 19.05 mm pitch. The switch has nothing to
  solder; the plate (1.5 mm, 14.00 mm cutout) holds it, the pegs only
  locate it. Pegs reach ~2.7 mm below the housing, ~1.1 mm through a
  1.6 mm board: keep bottom parts clear of them.
- Hall sensor (DRV5055A3, D15) on B.Cu under the magnet, position taken
  from a reference design (D12). Flip the footprint with F — KiCad mirrors
  the pads; don't mirror anything by hand.
  - **Footprint: KiCad's stock `Package_TO_SOT_SMD:SOT-23`** (D21).
    Pads 1.475 × 0.6, rows 1.875 apart, reaching 0.2–1.675 mm from the
    centre. TI's DBZ land pattern (0.4–1.7) would also do; the stock one
    holds the DRV5055 (feet end ±1.05–1.32 mm), the DRV5055A4 spare and the
    wider SS39ET (±1.4 mm), so any of them can go on any key.
  - Pinout on all three: 1 VCC, 2 OUT, 3 GND.
  - Hall element: 0.65 ± 0.08 mm deep, centred ± 50 µm (DRV5055); the
    package centre goes on the switch axis.
- `LED_SK6812MINI-E_3.2x2.8mm_P1.5mm` on B.Cu with its Edge.Cuts cutout at
  the switch LED window (the stock KiCad footprint is drawn LED-down;
  check the pad order against the datasheet)

## Per-encoder cell

- EC11-class footprint on F.Cu (through-hole, joints on the bottom).
  PEC11R-4xxxF-S (Bourns layout, cross-checked with the LCSC/EasyEDA
  footprint for C143790): A-C-B at 2.5 pitch and the switch pins 5.0 apart
  on rows 14.5 apart, Ø1.0–1.1 holes; mounting lugs on the shaft line,
  centres 11.4 apart (Bourns' 13.2 is across the slots' outer edges),
  slots ≥ 2.6 × 1.8 (long side across the pin rows; EasyEDA uses 2.8 ×
  1.4). Checked against the Bourns drawing (2026-10-19): A-C-B 7.5 mm
  from the shaft, switch pins 7.0 on the other side. The footprint is
  still named `RotaryEncoder_Alps_EC12E-…` but it is the PEC11R one
  (model `bourns-pec11r.step`); rename it some time. Pin holes are Ø1.0,
  the bottom of Bourns' 1.0–1.1; Ø1.1 would leave room for plating
  tolerance.
- 1 nF on A and B, on B.Cu next to the pins
- one reverse-mount LED + 100 nF, 10.5 mm from the shaft (between the two
  encoder rows), outside the 13.4 mm body and outside a 15 mm knob. It
  shines up through its cutout into its own light channel in the top: the
  encoder area of the top is solid from 3.5 mm above the PCB, with a
  pocket per encoder body and a 4 × 2 channel per LED, ending in a
  two-material window (`case/lib/windows.js`: 4 × 2 opening, flange 1 mm
  wider in the middle layers, bridged over the channel). No LED reaches
  another's window, also in the mini's stacked pair (6 mm apart). The pin
  side facing the LED is the switch side (S1/S2 at 7.0); encoder courtyard
  and LED courtyard are 0.13 mm apart; nothing else may stand on the top
  side within 3.5 mm of the PCB in the encoder area
- Bolted to the case top with its M7 nut (D17): the top rests on the 6.5 mm
  body, so nothing on the top side may stand taller than the body inside
  the encoder area

## Magnetics

- Copper (planes, traces) between magnet and sensor is fine.
- Keep **steel** out: no steel screws, inserts or plate near the sensors.
  Brass or nylon standoffs; FR4/acrylic/printed plate.
- Per-key calibration at boot absorbs fixed offsets from neighbours, and
  the sign of the swing — magnet polarity doesn't need to be known up
  front. That's why the sensor is bipolar (DRV5055, rests at VCC/2): a
  unipolar part (DRV5056) would read nothing if the pole is the other way
  round, and HE60 reports the DRV5055A3 as inverted with Gateron switches
  (D15).

## Analog

- Two 3.3 V rails, never tied together (D21): `+3.3V` (digital:
  expanders, I2C pull-ups) is the XIAO's own 3V3_OUT; `+3.3VA` (sensors,
  MCP3208) comes from our LDO, which runs from the switched `+5V_AUX`
  (D23).
- LDO (ME6211C33): CE tied to VIN (active-high enable; grounded it stays
  off). 10 µF at VIN; 10 µF + 100 nF right at VOUT, *before* the ferrite —
  the LDO's loop needs its output cap at the pin. VOUT feeds only the
  ferrite → 10 µF + 100 nF → `+3.3VA`.
- 100 nF at each sensor VCC (TI: ≥ 0.01 µF close to the device).
- Sensor RC filter, both halves at the ADC (D19): 1 kΩ (2 × 4-resistor
  arrays) then 100 nF to GND at each CH pin. The cap doubles as the
  sample-and-hold reservoir; no extra 1 nF needed. The long trace from the
  sensor is driven by the sensor output, so it picks up less than a 1 kΩ
  node would.
- MCP3208 VREF/VDD (pins 15/16): one shared 1 µF plus a 100 nF at each
  pin (datasheet §6.4 asks for 1 µF; its figures put 0.1 µF on each).
- ADC_CS has a 10 kΩ pull-up to `+3.3VA` (R2001), not to `+3.3V`: the
  ESP32's pins float while it boots, and a pull-up to the digital rail
  would feed the ADC through its CS pin while `+5V_AUX` is off. LCD_CS has
  no pull-up for the same reason: the display is unpowered until the
  firmware switches `+5V_AUX` on (D23).
- Ferrite GZ1608D601TF: 200 mA rated, 0.45 Ω max DCR; the analog load is
  ~33 mA (8 × DRV5055 ≤ 4 mA at 3.3 V + MCP3208), so ~15 mV drop, which
  ratiometric reading ignores.
- One solid ground plane; no split. Ring of stitching vias around the
  sensor cluster.
- Route LED data, 5 V and I2C away from sensor traces; cross on the other
  layer if they must cross.

## 5 V rails (D23)

- `+5V` is VBUS from XIAO pad 14 (before the XIAO's Schottky). It feeds
  only the two TPS22810 load switches (1 µF at each VIN):
  - U1003 → `+5V_AUX`: display VDD and the ME6211 → `+3.3VA`. Enable
    EN_AUX (GPIO4).
  - U1004 → `+5V_LED`: the 18 LEDs and the 74AHCT1G125. Enable EN_LED
    (GPIO42).
- EN pins have 10 kΩ pull-downs: both rails are off through boot and
  reset (EN threshold 1.23 V rising; GPIO4 and GPIO42 have no internal pull
  at reset).
- CT = 100 nF: TI's SR = 46.62 / CT[pF] gives ~0.47 V/ms, ~9 ms for the
  rail to rise. Inrush into `+5V_LED`'s ~42 µF is then ~20 mA.
- QOD tied to VOUT (TI's option 2, internal discharge resistor) — ERC
  flags open-collector vs power-out on that pin; it is intended.
- Firmware rules:
  - Turn `+5V_AUX` on and wait ≥ 10 ms before setting up the display and
    ADC pins; on the way down, set those pins to inputs first. Driving
    them while the rail is off feeds the chips through their pin
    protection diodes.
  - Cap LED brightness globally. 18 LEDs at full white are ~650 mA,
    the backlight ~110 mA, plus the ESP32, against 500 mA from a USB 2
    port, and the XIAO doesn't expose CC, so the firmware can't tell what
    the host allows.

## LEDs

- 100 nF at every LED VDD (strips do this; skipping it causes downstream
  data corruption).
- 18 LEDs: 8 keys + 10 encoders, no status LEDs (D22). **ENC1's LED is
  first in the chain**, so it still lights when a later LED is dead; the
  level shifter and the bulk cap sit near it, or the first data hop runs
  to it.
- No 220 µF bulk any more: 4 × 10 µF (C1006–C1009) along `+5V_LED`.
  The load switch's soft start takes care of inrush (D23), and USB limits
  the capacitance a device may show at plug-in.
- 220 Ω series on data at the first LED; 74AHCT1G125 shifts 3.3 → 5 V.

## XIAO

- On B.Cu, soldered flush. Footprint with all castellations incl. the
  half-pitch ones; mask web between pads.
- Its components then face **down** into the tray: USB-C, BOOT and RESET
  buttons, U.FL socket. The tray needs an opening for USB-C and a way to
  reach BOOT (hole or a printed plunger).
- The XIAO has pads on its underside (battery, debug). Under the module:
  no exposed copper and no untented vias on B.Cu.
- Seeed's footprint carries those underside pads (24–34). They stay
  unconnected: isolated copper only touches its own module pad, so it
  can't short anything, but no trace or via may run between or under
  them (checked 2026-10-19: EN_LED and EN_AUX pass ~1.2 mm clear, under
  mask). Drop B.Paste from them so an assembled rev doesn't solder them —
  not done yet.
- Placement (checked 2026-10-19): module edge at the back board edge, USB-C
  overhangs it by ~1.5 mm, so the case's USB opening is in the back wall.
  Pad order after the flip matches Seeed's pinout (D0 top-left, 5V
  top-right seen from the component side) and the footprint matches
  `seeed-xiao-esp32s3-plus-bottom.dxf`.
- Antenna is an external FPC/rod on U.FL, not a PCB antenna: no copper
  keep-out needed on the main board, but the case needs a spot for it away
  from the sensors and any metal.
- Its USB-C is the device's USB port: no USB jack, CC resistors or ESD on
  the main board. USB-C sits at a board edge.
- It is the tallest part on the bottom (≈ USB-C height + its own PCB);
  tray depth comes from the 3D model.

## Display

- 2.79" NV3007 bar (D16), landscape, header end on the left. Its male
  header is soldered straight into this board — no socket.
- Footprint: 8 × Ø1.0 holes, 2.54 pitch, the row 1.65 from the module's
  header-end edge; 2 × M2 holes under the module's Ø2.5 holes (20.0 apart,
  1.91 from the far edge) — 78.0 − 1.65 − 1.91 = 74.44 from the header row
  to the hole line. Drawing: `hardware/libs/datasheets/display/2.79/`.
- The module back carries parts up to ~2.6 (regulator, FPC socket), taller
  than the 2.5 header body: it sits on 3.0 mm M2 spacers. Nothing on our
  top side under the module (there is nothing on top anyway).
- Header pin 2 (VDD) on `+5V_AUX` (D16, D23): keeps the backlight's
  ~100 mA PWM steps off the 3.3 V rails. No caps at our header: the module
  has 10 µF + 100 nF on its own VDD input. All other header pins are 3.3 V
  logic straight to the ESP32; RES has a 10 kΩ pull-up on the module.
- Pin 1 (GND) is at the key-side end of the header (checked against the
  TZT drawing): the image is rotated 180° from the drawing, a firmware
  setting.
- Board position comes from `case/h8e10/layout.js` (D18).

## Mounting holes (D24)

12 × non-plated Ø2.2 (`MountingHole_2.2mm_M2`), on a grid: rows y = 65.2 /
95.8 / 134.8 (the two edge rows mirror each other about the board centre
y = 100.0, 4.04 mm in), columns on the key-block centre (69.5 ± 16.5),
the keys|encoders step wall (112.7) and the encoder gaps (137.5, 164.5,
218.5). Board coordinates as in the KiCad file (y down).

| Ref | Position | Kind | Why there |
|---|---|---|---|
| H1001 | (30.5, 134.8) | screw | front-left corner; 3.6 mm from the R5 corner arc |
| H1002 | (69.5, 134.8) | pin | front edge of the key block; 2.3 mm to the KS-20 courtyards, too tight for an insert boss (DRC courtyard overlap with K26001/K27001 is expected) |
| H1003 | (112.7, 134.8) | screw | front end of the keys/encoders step wall |
| H1004 | (53.0, 95.8) | screw | keys/display step wall |
| H1005 | (86.0, 95.8) | screw | keys/display step wall |
| H1006 | (112.7, 95.8) | screw | where the two step walls meet |
| H1007 | (137.5, 65.2) | screw | tray, back edge between ENC1 and ENC2 |
| H1008 | (164.5, 134.8) | pin | front edge between ENC7 and ENC8 |
| H1009 | (164.5, 65.2) | pin | back edge between ENC2 and ENC3 |
| H1010 | (218.5, 65.2) | pin | back edge between ENC4 and ENC5 |
| H1011 | (218.5, 134.8) | screw | tray, front edge between ENC9 and ENC10 |
| H1012 | (38.5, 69.9) | pin from the tray | under the display, top-left corner; pin tip flush with the PCB top (the module's back parts are 3 mm above). DRC courtyard/NPTH-in-courtyard with DS1001 is expected |

- Screws: brass M2 heat-set inserts in bosses on the top, screws from
  under the tray through tray and PCB. One set of screws holds all three
  parts together.
- The key-block bosses must be exactly 3.5 mm long (plate underside to
  PCB top, the KS-20 housing height below the plate): they set every
  sensor's distance to its magnet. The KS-20s aren't soldered, so these
  screws are what holds the left half of the board up against the plate.
- Encoder side: the ten encoder nuts already clamp the board to the top;
  H1007 and H1011 only hold the tray, the rest locate it.
- Every hole is ≥ 12.6 mm from the nearest hall sensor; brass or nylon
  hardware only (Magnetics).
- Copper-free radius around each hole ≥ 2.3 mm (more than the Ø3.8 M2
  head needs on the screw holes).

## Hand assembly

- Use the `_HandSolder` 0603 footprints (longer pads). SOT-23, SOIC and
  SSOP as stock, the hall sensor included (see Per-key cell).
- Reference designators are hidden on the silkscreen: the five-digit
  references (C21001…) don't fit around 0603 parts. The interactive BOM
  is the assembly drawing. Silkscreen keeps the footprints' pin-1 and
  LED marks, the test-point labels, and the `Logo H8E10` mark (HALE-git) with
  `${REVISION}` (set in Board Setup → Title Block). The mark goes at
  (69.5, 94.2) on top and, flipped, on the bottom: clear of pads, vias
  and holes on both sides (checked 2026-10-19). The case covers this
  strip, so it shows on the bare board only.
- Generate an interactive BOM (InteractiveHtmlBom plugin) and hand it over
  with the board.
- SK6812MINI-E are heat-sensitive: low iron temperature, short dwell. Order
  spares.
- A 180° SOT-23 or LED is the classic first-board bug; the sensor and LED
  orientation get a second look before soldering.
- Order of work: bottom ICs and passives → LEDs and sensors → XIAO →
  encoders and the display (on its spacers, header soldered) from the top.
  Switches go in last, with the top.
- Test points (Ø2 mm pads, bottom): 5V, 5V_AUX, 5V_LED, 3V3, 3V3A, GND.
  No signal test points; probe SPI/I2C at the IC legs and LED_DATA at
  R1001.
- Keep the `LCSC` field on every symbol: it makes the parts order a
  copy-paste, and keeps a fab-assembled rev possible later.

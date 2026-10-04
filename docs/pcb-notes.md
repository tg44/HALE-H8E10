# PCB and assembly notes

## Stack and sides

- 2-layer, **1.2 mm** FR4 (keeps the magnet close to the sensor through the
  board)
- Bottom (B.Cu): everything that is soldered flat — sensors, LEDs, ICs,
  passives **and the XIAO**. All SMD work happens on one side.
- Top (F.Cu): only what the user touches — hall switches, encoders,
  display socket.
- v0 is hand-soldered (D10). No pick-and-place constraints, but keep it
  friendly to an iron: see "Hand assembly" below.

## Per-key cell

Three separate footprints, placed once and copied as a KiCad **group**
(Ctrl+G); do not merge them into one footprint — each part needs its own
designator.

- KS-20 switch footprint (MX pattern: centre post + two pegs, no
  electrical pads), 19.05 mm pitch. The switch has nothing to solder; the
  plate holds it.
- `SOT-23` sensor on B.Cu under the magnet, position taken from a
  reference design (D12). Flip the footprint with F — KiCad mirrors the
  pads; don't mirror anything by hand.
- `LED_SK6812MINI-E_3.2x2.8mm_P1.5mm` on B.Cu with its Edge.Cuts cutout at
  the switch LED window (the stock KiCad footprint is drawn LED-down;
  check the pad order against the datasheet)

## Per-encoder cell

- EC11-class footprint on F.Cu (through-hole, joints on the bottom)
- 1 nF on A and B, on B.Cu next to the pins
- one reverse-mount LED + 100 nF; where it shines (beside the shaft, under
  a translucent knob skirt) is decided with the knob model

## Magnetics

- Copper (planes, traces) between magnet and sensor is fine.
- Keep **steel** out: no steel screws, inserts or plate near the sensors.
  Brass or nylon standoffs; FR4/acrylic/printed plate.
- Per-key calibration at boot absorbs fixed offsets from neighbours, and
  the sign of the swing — magnet polarity doesn't need to be known up
  front.

## Analog

- Sensors and MCP3208 VREF on one filtered rail: 3.3 V → ferrite → 10 µF +
  100 nF.
- 100 nF at each sensor VCC. 1 kΩ series near the sensor, 100 nF to GND
  near the ADC pin (this cap doubles as the sample-and-hold reservoir; no
  extra 1 nF needed).
- One solid ground plane; no split. Ring of stitching vias around the
  sensor cluster.
- Route LED data, 5 V and I2C away from sensor traces; cross on the other
  layer if they must cross.

## LEDs

- 100 nF at every LED VDD (strips do this; skipping it causes downstream
  data corruption).
- Bulk 220 µF on the 5 V LED rail at the chain head.
- 220 Ω series on data at the first LED; 74AHCT1G125 shifts 3.3 → 5 V.

## XIAO

- On B.Cu, soldered flush. Footprint with all castellations incl. the
  half-pitch ones; mask web between pads.
- Its components then face **down** into the tray: USB-C, BOOT and RESET
  buttons, U.FL socket. The tray needs an opening for USB-C and a way to
  reach BOOT (hole or a printed plunger).
- The XIAO has pads on its underside (battery, debug). Under the module:
  no exposed copper and no untented vias on B.Cu.
- Antenna is an external FPC/rod on U.FL, not a PCB antenna: no copper
  keep-out needed on the main board, but the case needs a spot for it away
  from the sensors and any metal.
- Its USB-C is the device's USB port: no USB jack, CC resistors or ESD on
  the main board. USB-C sits at a board edge.
- It is the tallest part on the bottom (≈ USB-C height + its own PCB);
  tray depth comes from the 3D model.

## Display

- 8-pin socket on top; four M2 holes at 27 × 38.7 mm; see display.md.

## Hand assembly

- Use the `_HandSolder` 0603 footprints (longer pads). SOT-23, SOIC and
  SSOP as stock.
- Bottom silkscreen is the assembly drawing: every designator readable,
  pin-1 marks, LED orientation mark, electrolytic polarity.
- Generate an interactive BOM (InteractiveHtmlBom plugin) and hand it over
  with the board.
- SK6812MINI-E are heat-sensitive: low iron temperature, short dwell. Order
  spares.
- A 180° SOT-23 or LED is the classic first-board bug; the sensor and LED
  orientation get a second look before soldering.
- Order of work: bottom ICs and passives → LEDs and sensors → XIAO →
  encoders and display socket from the top. Switches go in last, with the
  plate.
- Test points for 5V, 3V3, 3V3A, GND, both SPIs, I2C and LED_DATA.
- Keep the `LCSC` field on every symbol: it makes the parts order a
  copy-paste, and keeps a fab-assembled rev possible later.

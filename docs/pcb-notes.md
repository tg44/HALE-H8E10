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
  - **Footprint: TI's DBZ land pattern** (DRV5055 datasheet p.30: 3 pads
    1.3 × 0.6 mm, rows 2.1 mm apart centre to centre, 0.95 mm pitch). Not
    a tight stock SOT-23: it has to hold both the DRV5055 (TO-236 body,
    lead span 2.10–2.64 mm) and the wider SS39ET (body 1.60 mm, lead span
    2.80 mm), so either part — or the DRV5055A4 spare — can be fitted per
    key at assembly time. Feet land on the pads for both (pads reach
    ±0.4…±1.7 mm from centre; feet end at ±1.05…1.32 and ±1.4 mm).
  - Pinout on all three: 1 VCC, 2 OUT, 3 GND.
  - Hall element: 0.65 ± 0.08 mm deep, centred ± 50 µm (DRV5055); the
    package centre goes on the switch axis.
- `LED_SK6812MINI-E_3.2x2.8mm_P1.5mm` on B.Cu with its Edge.Cuts cutout at
  the switch LED window (the stock KiCad footprint is drawn LED-down;
  check the pad order against the datasheet)

## Per-encoder cell

- EC11-class footprint on F.Cu (through-hole, joints on the bottom)
- 1 nF on A and B, on B.Cu next to the pins
- one reverse-mount LED + 100 nF; where it shines (beside the shaft, under
  a translucent knob skirt) is decided with the knob model
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

- 2.79" NV3007 bar (D16), landscape, header end on the left. Its male
  header is soldered straight into this board — no socket.
- Footprint: 8 × Ø1.0 holes, 2.54 pitch, the row 1.65 from the module's
  header-end edge; 2 × M2 holes under the module's Ø2.5 holes (20.0 apart,
  1.91 from the far edge) — 78.0 − 1.65 − 1.91 = 74.44 from the header row
  to the hole line. Drawing: `hardware/libs/datasheets/display/2.79/`.
- The module back carries parts up to ~2.6 (regulator, FPC socket), taller
  than the 2.5 header body: it sits on 3.0 mm M2 spacers. Nothing on our
  top side under the module (there is nothing on top anyway).
- Header pin 2 (VDD) on the **5 V** net, with 10 µF + 100 nF at the header
  (D16): keeps the backlight's ~100 mA PWM steps local and off the 3.3 V
  rail. All other header pins are 3.3 V logic straight to the ESP32.
- Board position comes from `case/layout.js` (D18).

## Hand assembly

- Use the `_HandSolder` 0603 footprints (longer pads). SOT-23, SOIC and
  SSOP as stock — except the hall sensor, which uses the TI DBZ land
  pattern (see Per-key cell).
- Bottom silkscreen is the assembly drawing: every designator readable,
  pin-1 marks, LED orientation mark, electrolytic polarity.
- Generate an interactive BOM (InteractiveHtmlBom plugin) and hand it over
  with the board.
- SK6812MINI-E are heat-sensitive: low iron temperature, short dwell. Order
  spares.
- A 180° SOT-23 or LED is the classic first-board bug; the sensor and LED
  orientation get a second look before soldering.
- Order of work: bottom ICs and passives → LEDs and sensors → XIAO →
  encoders and the display (on its spacers, header soldered) from the top.
  Switches go in last, with the top.
- Test points for 5V, 3V3, 3V3A, GND, both SPIs, I2C and LED_DATA.
- Keep the `LCSC` field on every symbol: it makes the parts order a
  copy-paste, and keeps a fab-assembled rev possible later.

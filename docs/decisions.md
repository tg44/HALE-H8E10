# Design decisions

Short records of the choices made so far and why. Add a new entry rather
than editing an old one when something changes.

## D1. Scope: pad controller first, keybed later

Started as "MPK-mini clone with motorized X32 faders". Motorized faders need
an H-bridge, PID loop, capacitive touch and a ~10 V rail that USB can't
supply from a laptop; they pushed the project into custom power and a much
larger firmware. Dropped for v1. An LPD8-sized board (8 hall keys, 10
encoders, display) is cheap to get wrong and the sensing/encoder/MIDI code
carries straight to a 25-key version.

Every key is a hall key. There are no mechanical/hot-swap switches on the
board; menu and mode functions use the encoder pushes and the keys
themselves.

## D2. Hall-effect keys, MX form factor

Gateron KS-20 magnetic switches (4.1 mm travel, 30 gf, SMD LED window) with
a linear hall sensor on the PCB. Gives velocity (time between two
thresholds), aftertouch (travel past actuation) and rapid trigger. MX
keycaps are fine for pads; a piano feel is explicitly out of scope — if a
playable keybed is wanted later, design a grid with isomorphic layouts
rather than imitate piano geometry.

## D3. Sensor: Honeywell SS39ET (SOT-23)

SOT-23 sits flat on the bottom of the board under the switch and is easy to
solder. Ratiometric output, so it's powered from the same filtered 3.3 V
rail the ADC references. Cheaper clones (OH49E-S, HSS39ET) are the fallback
if stock runs out; HAL9303SO is the higher-sensitivity option.

## D4. MCU: Seeed XIAO ESP32S3 Plus, flush-mounted on the bottom

Needs native USB OTG for class-compliant USB-MIDI, which rules out every
C-series ESP (C3/C5/C6 only have USB-Serial/JTAG; C5 OTG has no IDF driver
as of 2026). S3 gives USB-MIDI + BLE-MIDI + Wi-Fi web UI on one chip. The
Plus exposes 20 GPIO via half-pitch castellations, reachable with an iron
when soldered flush, which is how it's mounted (socketed would leave only
11 pins). It goes on the bottom with the rest of the soldered parts, so the
top of the board carries only switches, encoders and the display.

## D5. External ADC: MCP3208

The S3's ADC is noisy and non-linear at the ends. An 8-channel 12-bit SPI
ADC replaces both the mux and the bad ADC, has a VREF pin for the
ratiometric trick, and is cheap and easy to get. ADS7953 is the 16-channel
upgrade for a 33-key board.

## D6. I/O expansion: 2 × MCP23017

10 encoders × (A, B, push) = 30 inputs. Two MCP23017s on I2C with internal
pull-ups and wired-OR interrupts, 2 pins spare. (Alternative: four chained
74HC165 on SPI, polled at 2 kHz — deterministic, no interrupts; keep in mind
if I2C latency ever shows.) Encoders decode with a Gray-code state table.

## D7. Encoders: all detented push-encoders, 24/24

Mixed detent/smooth was considered (detent for browse, smooth for EQ/macros).
Rejected: smooth encoders are hard to push without a stray step, and all
ten need push (push-to-reset stands in for a centre detent on EQ knobs).
Elektron uses detented push-encoders everywhere, with acceleration for
sweeps and a fine mode for slow trims. Soft-detent Bourns PEC11R-4215F-S0024
or Alps EC11E light-detent; sample both before buying ten.

## D8. LEDs: SK6812MINI-E(A), reverse mount

Reverse-mount so they sit on the bottom with the rest of the SMD and shine
up through a cutout. The -EA and plain -E variants share the footprint;
either works for hand soldering. (-EA is the one a fab's economic assembly
line accepts, which only matters for a later assembled rev.) 3.3 V data
through a 74AHCT1G125 level shifter.

## D9. Display: generic 1.54" 240×240 ST7789, 8-pin

Has a CS pin, so it can share SPI; socketed on a header with four M2
standoffs so a swap is a footprint change. Full mechanical drawing is in
docs/display.md. 0.96" OLEDs were considered and are fine for a settings
display; the IPS panel is the cheap way to look expensive.

## D10. v0 is hand-soldered, all soldering on the bottom

One board, soldered by a person who does SMD professionally. No fab
assembly for v0: it would add setup and feeder fees for a single unit and
tie part choices to one fab's stock list. Everything soldered sits on the
bottom of a 1.2 mm board (SMD and the XIAO); the top has only switches,
encoders and the display socket. Passives are 0603 with hand-solder pads.
LCSC numbers stay in the symbols so an assembled rev remains an option.

## D11. Power from USB via the XIAO

Total draw < 600 mA (S3 Wi-Fi bursts ~400 mA, 20 LEDs dimmed, sensors,
display). 5 V comes from the XIAO's 5V pin; a dedicated 3.3 V LDO on the
board feeds sensors, ADC and display rather than loading the XIAO's small
regulator. Ferrite + caps isolate the analog rail from LED switching noise.

## D12. No bench test; v0 is the test

The sensor–magnet geometry is not measured on a breadboard first. Instead:

- sensor position under the KS-20 is copied from open hall-keyboard designs
  that use the same switch family (minipad, KBHE 75HE), cross-checked
  against the KS-20 drawing;
- magnet polarity doesn't need to be known: the SS39ET rests at VCC/2 and
  swings either way, and per-key calibration records rest and bottom-out;
- the board is cheap and hand-built, so a wrong offset costs one bare PCB
  respin and a re-solder, not an assembly order.

Accepted risk: too little swing, or saturation, on v0. If that happens the
fix is a moved footprint or a different-sensitivity sensor in the same
SOT-23 (D3).

## D13. Schematic and layout grow together

Not "finish the schematic, then lay out". Each part group is collected
(symbol, footprint, 3D model, datasheet), drawn and placed before the next
one starts, and the case is modelled alongside. Mechanical fit is the
tightest constraint on this board (key pitch, knob clearance, display
height, XIAO under the board), so it gets checked from the first placed
part instead of after routing. See docs/plan.md.

## D14. Board thickness 1.6 mm, not 1.2 mm

Replaces the 1.2 mm in D10 and pcb-notes. 1.2 mm was chosen to bring the
sensor closer to the magnet, assuming the signal would be weak. The
datasheets (now in hardware/libs/datasheets/) say the opposite:

- KS-20: 102 ± 15 G at rest, 905 ± 80 G at bottom-out, magnet face
  0.3 mm above the PCB top at bottom-out. The drawing shows a standard
  ~1.6 mm PCB, so 905 G is most likely measured through 1.6 mm.
- SS39ET at 3.3 V: ~0.9 mV/G typical (0.27 mV/G/V nominal, up to
  ~0.35), output limited to ~0.95–1.05 V from either rail, so it clips at
  roughly 520–780 G. Even at 5 V the guaranteed range is only ±650 G.

So the sensor clips over the last part of the travel at 1.6 mm already;
1.2 mm would add roughly 10–40 % more field (dipole estimate) and clip
earlier. 1.6 mm costs nothing and keeps more of the travel linear.
Velocity (two thresholds high in the travel) is unaffected by clipping;
aftertouch range near bottom-out is what's at stake. Still the D12
accepted risk; the remaining fix is a lower-sensitivity sensor (open).

## D15. Sensor: TI DRV5055A3 (replaces D3's SS39ET)

DRV5055A3QDBZR (LCSC C266128), SOT-23, on the 3.3 V analog rail. Datasheet
(TI SBAS640C) at 3.3 V: 15 mV/mT, guaranteed linear range ±88 mT, output
linear to 0.2 V from either rail, VCC/2 at rest. That is ~1.7× the SS39ET's
signal and ~2.5× its room before clipping, in the same pinout.

- Proven setup: KBHE 75HE uses DRV5055A3 at 3.3 V on a 1.6 mm board; HE60
  lists it (and SS39ET) as working with Gateron magnetic switches. Every
  open hall board checked runs its sensors at 3.3 V.
- The field under a 1.6 mm board is probably below Gateron's 905 G: TI app
  note SLYA093 models ~2.1 mm magnet-to-sensor at bottom-out and picks a
  ±80 mT part. So D14's clipping estimate was pessimistic; the SS39ET is
  borderline rather than clearly clipping. Inference, not measured.
- Bipolar on purpose. DRV5056 (unipolar, 2× the swing) was rejected: it
  reads only one pole, and HE60 reports DRV5055A3 as "inverted" with
  Gateron switches, so the pole at the sensor isn't certain. With no bench
  test (D12), a wrong guess would mean eight dead keys. DRV5055 swings
  either way; calibration flips the sign.
- Fallback for clipping: DRV5055A4 (7.5 mV/mT, ±176 mT, C266123), same
  footprint, swap per key. SS39ET (C126669) also fits the same footprint.
- Pinout identical on all three: 1 VCC, 2 OUT, 3 GND. Package bodies
  differ (SS39ET 1.60 × 2.80 mm lead span, DRV5055 TO-236 1.2–1.4 ×
  2.10–2.64 mm), so the footprint uses TI's DBZ land pattern, which holds
  both (see pcb-notes).

Ratiometric still holds: sensors and MCP3208 VREF share the 3.3 V analog
rail (D5).

# Pinout and buses

XIAO ESP32S3 Plus, flush-mounted on the bottom, all 20 GPIO available.
The assignment below is what the schematic and the routed board have
(2026-10-19). Pins marked movable could still be swapped, but every move
now means re-routing.

## Buses

| Bus | Signals | Devices |
|---|---|---|
| SPI A | SCK, MOSI, MISO, CS_ADC | MCP3208 (≤ 1 MHz clock at 3.3 V). CS pulled up to `+3.3VA` (R2001) |
| SPI B | SCK, MOSI, CS_LCD, DC_LCD, RST_LCD | NV3007 2.79" bar (D16; write ≤ 100 MHz per datasheet, so the S3's 80 MHz is fine; read ≤ 6.6 MHz). Module VDD on `+5V_AUX`; its pins are 3.3 V logic. No CS pull-up (D23); RES has the module's own 10 kΩ |
| I2C | SDA, SCL (+ 4.7 kΩ pull-ups) | MCP23017 ×2 |
| GPIO | INT_EXP | both MCP23017 INTA, wired-OR (open-drain, 10 kΩ pull-up); INTB unused, so IOCON.MIRROR = 1 |
| GPIO | LED_DATA | → 74AHCT1G125 → SK6812 chain |
| GPIO (PWM) | LCD_BL | display backlight (module NPN via 2.2 kΩ), dim-after-idle |
| GPIO | ENC1_SW, ENC6_SW | encoder pushes that don't fit on the expanders (D20). ENC1 (top left) is the settings button |
| GPIO | EN_AUX, EN_LED | TPS22810 load switches for `+5V_AUX` and `+5V_LED` (D23); 10 kΩ pull-downs, off at boot |

Total: 4 + 5 + 2 + 1 + 1 + 1 + 2 + 2 = **18 GPIO**. Left: GPIO3 (strapping
pin) and GPIO43 (UART0 TX) — no clean spare. The four expander bit-7 pins
are spare slow outputs.

## XIAO assignment

Symbol pin = Seeed's `XIAO-ESP32-S3 Plus-SMD` pin = footprint pad. D-names
and GPIOs from Seeed's wiki and the module schematic (they agree; the
pinout xlsx's "D11/D12" labels on GPIO42/41 don't, ignore them). Footprint
pads checked against `seeed-xiao-esp32s3-plus-bottom.dxf` (2026-10-19).

| Pad | Name | GPIO | Net | Movable? |
|---|---|---|---|---|
| 1 | D0 | 1 | LED_DATA | yes, not to GPIO43 |
| 2 | D1 | 2 | LCD_CS (`D_CS`) | yes (CS is per device, not part of the IO-MUX check) |
| 3 | D2 | 3 | — spare | strapping pin; last resort, inputs only |
| 4 | D3 | 4 | EN_AUX | yes; must have no pull-up at reset (GPIO4 has none) |
| 5 | D4 | 5 | I2C_SDA | yes |
| 6 | D5 | 6 | I2C_SCL | yes |
| 7 | D6 | 43 | — spare | UART0 TX, chatters at boot; keep for a debug console |
| 8 | D7 | 44 | ADC_CS (`KEYS_CS`) | yes. UART0 RX, so the debug console is TX-only (see below) |
| 9 | D8 | 7 | ADC_SCK | yes |
| 10 | D9 | 8 | ADC_MISO | yes |
| 11 | D10 | 9 | ADC_MOSI | yes |
| 12 | 3V3_OUT | — | +3.3V (digital rail, D21) | — |
| 13 | GND | — | GND | — |
| 14 | VBUS | — | +5V (raw USB; the XIAO's Schottky sits after this pin) | — |
| 15 | D11 | 38 | LCD_BL | yes |
| 16 | D12 | 39 | LCD_RST | yes |
| 17 | D13 | 40 | ENC1_SW | yes |
| 18 | D14 | 41 | INT_EXP (`E_INT`) | yes |
| 19 | D15 | 42 | EN_LED | yes; GPIO42 (MTMS) has no pull at reset |
| 20 | D16 | 10 | ENC6_SW | yes. Seeed labels it ADC_BAT, but nothing is wired to it on the Plus |
| 21 | D19 | 11 | LCD_MOSI | **no** — SPI2 IO-MUX FSPID |
| 22 | D18 | 12 | LCD_SCK | **no** — SPI2 IO-MUX FSPICLK |
| 23 | D17 | 13 | LCD_DC | yes (it's FSPIQ, but the display has no MISO) |
| 24–34 | back pads (JTAG, EN, USB, VBAT, GND, PAD) | — | not connected | — |

Where the pads are (footprint, before flipping to the bottom): pads 1–7
(D0–D6) on one long edge with the half-pitch pads 15–20 (GPIO38–42, 10)
between them; pads 8–14 (D7–D10, 3V3, GND, VBUS) on the other edge with
21–23 (GPIO11–13) between D7–D10.

Rules for moving pins:

- Only LCD_SCK and LCD_MOSI are fixed: the display's top speed needs
  SPI2's IO-MUX pins. Everything else goes through the GPIO matrix
  (SPI3 for the ADC at ≤ 1 MHz, I2C, RMT for LED_DATA, LEDC for the
  backlight, plain inputs), so any free GPIO works.
- Swap freely among: GPIO1, 2, 4–9, 38–42, 10, 13, and GPIO44 (UART0 RX).
- GPIO44 carries ADC_CS. USB-MIDI takes the S3's USB port, so the only
  debug console left is UART0, and with GPIO44 used it can only transmit
  (TX on GPIO43). Configure the console TX-only.
- The enable pins (EN_AUX, EN_LED) need a GPIO without an internal pull-up
  at reset, or the rails switch on during boot.
- Not GPIO43 for anything driven at boot (LED_DATA would flash the LEDs,
  LCD lines would get garbage) and not for a button (a pressed button
  would short its boot output to GND).
- GPIO3 is a strapping pin: harmless as an input with the default eFuses,
  but use it last.
- GPIO39–42 are the JTAG pins. Fine as GPIO: the S3 debugs over USB.
- After a swap, update this table and the firmware pin map (C0).

Why two SPI buses: a full display frame is ~115 kB, tens of milliseconds
on the wire. The key scan must not queue behind it, so the ADC gets its own
controller. The S3 has two general-purpose SPI controllers (SPI2, SPI3) and
two I2C controllers, so this uses SPI2 + SPI3 + one I2C.

Which bus goes where: the **display** is the fast one, so it gets SPI2 on
its IO-MUX pins (GPIO10–13, the D16–D19 half-pitch castellations on the
Plus). The ADC at ≤ 1 MHz can sit on any pins through the GPIO matrix.

If forced onto the 11 full-pitch pins: merge the SPIs (SCK, MOSI, MISO,
CS_ADC, CS_LCD, DC_LCD = 6) + I2C 2 + INT 1 + LED 1 = 10, with RST tied to
EN via RC and BL tied high. Possible only because the display module has CS (the 2.79" and the 1.54" both do).

## Expander map

Encoder numbers follow `ENCODERS` in `case/layout.js`: ENC1–5 the back
row (display row) left to right, ENC6–10 the front row. ENC1, top left,
is the settings encoder.

10 encoders × (A, B, push) = 30 inputs, but only **28 expander inputs**:
on the MCP23017, GPA7 and GPB7 are output-only (datasheet rev D, 2022 —
the copy in `datasheets/io-expander/` is rev E). So two pushes go to the
XIAO (D20).

Rules (the map below follows them):

- Bits 0–6 of each port are inputs; bit 7 gets no encoder.
- An encoder's A and B stay on the same port, so one I2C read sees both.
- ENC1_SW goes to the XIAO; the second XIAO push is ENC6 (D21).

Map as wired (2026-10-19):

| Chip | Port | Bit 0 | 1 | 2 | 3 | 4 | 5 | 6 |
|---|---|---|---|---|---|---|---|---|
| U3001 (0x20) | A | ENC1 A | ENC1 B | ENC2 SW | ENC2 A | ENC2 B | ENC3 A | ENC3 B |
| U3001 | B | ENC8 A | ENC8 B | ENC7 SW | ENC7 A | ENC7 B | ENC6 A | ENC6 B |
| U3002 (0x21) | A | ENC3 SW | ENC4 SW | ENC4 A | ENC4 B | ENC5 SW | ENC5 A | ENC5 B |
| U3002 | B | ENC10 SW | ENC10 A | ENC10 B | ENC9 SW | ENC9 A | ENC9 B | ENC8 SW |
| XIAO | GPIO | ENC1 SW → GPIO40, ENC6 SW → GPIO10 | | | | | | |

A/B and SW are active low (switch to GND). Use the MCP23017's internal
pull-ups (GPPU) on all 28 inputs; A/B also have 1 nF to GND. The two XIAO
pushes use the ESP32's internal pull-ups.

Interrupt setup order: IOCON.ODR = 1 and MIRROR = 1 on **both** chips
before enabling GPINTEN. Their INTA pins are tied together, and in the
default push-pull mode one chip pulling low would fight the other.

Spare outputs: the four bit-7 pins (GPA7/GPB7 on U3001 and U3002) still work as
outputs. If XIAO pins run out, only slow, one-shot outputs can move there —
RST_LCD is the candidate. DC/CS (SPI speed), LCD_BL (PWM) and LED_DATA
(timing) can't go through I2C.

## ADC channels

Keys follow the key sheets: key1–4 the back row (display side) left to
right, key5–8 the front row. Designators: key*n* = K2*n*001, sensor
U2*n*001.

| MCP3208 | CH0 | CH1 | CH2 | CH3 | CH4 | CH5 | CH6 | CH7 |
|---|---|---|---|---|---|---|---|---|
| key | 1 | 2 | 3 | 4 | **8** | **7** | **6** | **5** |
| via | RN2001 R1 | R2 | R3 | R4 | RN2002 R1 | R2 | R3 | R4 |

The second array is reversed for routing (H8 on CH4 … H5 on CH7); the
firmware's channel table has to follow it.

## LED chain

Data order (index 0 = first LED after the 74AHCT1G125, ENC1 first per D22):

| Index | 0–4 | 5–9 | 10–13 | 14–17 |
|---|---|---|---|---|
| LED | ENC1, 2, 3, 4, 5 | ENC10, 9, 8, 7, 6 | key4, 3, 2, 1 | key8, 7, 6, 5 |

## Avoid on the S3

- Strapping pins (GPIO0, 3, 45, 46) for anything that must be in a defined
  state at boot. GPIO3 is D2 on the XIAO.
- GPIO43/44 (D6/D7) are UART0 TX/RX — fine to use, but they chatter at
  boot.
- GPIO19/20 are USB D−/D+ (not exposed on the XIAO anyway)
- ADC2 pins don't matter here — we don't use the internal ADC

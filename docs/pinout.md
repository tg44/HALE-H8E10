# Pinout and buses

XIAO ESP32S3 Plus, flush-mounted on the bottom, all 20 GPIO available.
Final pin numbers get fixed during plan step A9; this records the budget.

## Buses

| Bus | Signals | Devices |
|---|---|---|
| SPI A | SCK, MOSI, MISO, CS_ADC | MCP3208 (≤ 1 MHz clock at 3.3 V) |
| SPI B | SCK, MOSI, CS_LCD, DC_LCD, RST_LCD | ST7789 (40–80 MHz) |
| I2C | SDA, SCL (+ 4.7 kΩ pull-ups) | MCP23017 ×2 |
| GPIO | INT_EXP | MCP23017 INTA/INTB wired-OR (open-drain, pull-up) |
| GPIO | LED_DATA | → 74AHCT1G125 → SK6812 chain |
| GPIO (PWM) | LCD_BL | display backlight, dim-after-idle |

Total: 4 + 5 + 2 + 1 + 1 + 1 = **14 GPIO**, 6 spare.

Why two SPI buses: a full display frame is ~115 kB, tens of milliseconds
on the wire. The key scan must not queue behind it, so the ADC gets its own
controller. The S3 has two general-purpose SPI controllers (SPI2, SPI3) and
two I2C controllers, so this uses SPI2 + SPI3 + one I2C.

Which bus goes where: the **display** is the fast one, so it gets SPI2 on
its IO-MUX pins (GPIO10–13, the D16–D19 half-pitch castellations on the
Plus). The ADC at ≤ 1 MHz can sit on any pins through the GPIO matrix.

If forced onto the 11 full-pitch pins: merge the SPIs (SCK, MOSI, MISO,
CS_ADC, CS_LCD, DC_LCD = 6) + I2C 2 + INT 1 + LED 1 = 10, with RST tied to
EN via RC and BL tied high. Possible only because the 1.54" module has CS.

## Expander map

10 encoders × (A, B, push) = 30 inputs on 32 pins.

| Chip | Port | Inputs |
|---|---|---|
| U2 (0x20) | A | ENC1..4 A/B |
| U2 | B | ENC5..8 A/B |
| U3 (0x21) | A | ENC9..10 A/B, ENC1..4 push |
| U3 | B | ENC5..10 push, 2 spare |

## Avoid on the S3

- Strapping pins (GPIO0, 3, 45, 46) for anything that must be in a defined
  state at boot. GPIO3 is D2 on the XIAO.
- GPIO43/44 (D6/D7) are UART0 TX/RX — fine to use, but they chatter at
  boot.
- GPIO19/20 are USB D−/D+ (not exposed on the XIAO anyway)
- ADC2 pins don't matter here — we don't use the internal ADC

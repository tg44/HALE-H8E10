# Display: 1.54" 240×240 IPS, ST7789, 8-pin

Generic AliExpress module ("NOMEN_TEC V2.0" board family). Pick the **1.54"
ST7789** variant in the listing, not the 1.8" 128×160 ST7735 shown in some
photos.

Drawings from the seller's datasheet are in `img/`.

## Electrical

| Pin | Name | Note |
|---|---|---|
| 1 | GND | |
| 2 | VCC | 3.3 V |
| 3 | SCL | SPI clock |
| 4 | SDA | SPI MOSI |
| 5 | RST | active low; 10 kΩ pull-up or GPIO |
| 6 | DC | data/command |
| 7 | CS | chip select — present, so the bus can be shared |
| 8 | BL | backlight; on-board transistor, PWM from GPIO |

4-wire SPI, 3.3 V logic, 262K colours, ST7789. Works with Adafruit_ST7789,
LovyanGFX, TFT_eSPI, esp-idf-st7789 (set 240×240, check X/Y offsets).

## Mechanical (mm)

- Module PCB: 32.0 × 43.7, 1.2 thick; overall thickness 5.32
- Active area 27.72 × 27.72; top of AA 5 mm below top edge
- Mounting holes: 4 × Ø2.0, centres **27.0 apart (X)**, **38.7 apart (Y)**;
  top pair 5.0 from the top edge, bottom pair 2.5 from the bottom edge,
  2.5 in from each side
- Header: 8 × 2.54 mm, span 17.78, on the same line as the top holes; pin 1
  (GND) on the left viewed from the front. Confirm pin-1 X with calipers.
- Panel glass sits ~3.5 mm proud of the module PCB

## On the main board

- `PinSocket_1x08_P2.54mm_Vertical` + 4 × `MountingHole_2.2mm_M2`
- Outline and active-area rectangle on F.Fab / Dwgs.User for the case window
- On a standard female header the glass top ends ~12 mm above the main PCB,
  about level with MX keycaps. Use a low-profile header + standoffs if it
  should sit lower.
- 3D: a 32 × 43.7 × 5.3 box is enough for clearance; Cuprum77/kicad-displays
  may have a model.

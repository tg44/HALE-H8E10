# Display: 1.54" 240×240 IPS, ST7789, 8-pin

Generic AliExpress module ("NOMEN_TEC V2.0" board family). Pick the **1.54"
ST7789** variant in the listing, not the 1.8" 128×160 ST7735 shown in some
photos.

Drawings from the seller's datasheet and a product photo are in this folder
(`display-1.54-*.png`); the ST7789V controller datasheet is one level up
(`../sitronix-st7789v.pdf`). Listing:
[AliExpress 1005009712175802](https://www.aliexpress.com/item/1005009712175802.html).
Alternatives for a strip above the keys: `../candidates.md`.

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

- Module PCB: 32.0 × 43.7, 1.2 thick
- Side view (drawing), front to back: LCM 2.14 + bond layer 0.18 + PCB 1.2
  = **3.52** (glass face to PCB back), + **1.5** of SMD parts on the back =
  **5.02** overall. The parameter table says 5.32; the drawing adds up, so
  use 5.02.
- LCM (panel) 31.52 × 33.72, top edge **5.0** below the PCB top edge
  (the drawing's "5"); active area 27.72 × 27.72, top **6.45** below the PCB
  top edge (the "(1.45)" is panel edge → AA). Panel bottom at 38.72
  matches the photo.
- Mounting holes: 4 × Ø2.0, centres **27.0 apart (X)**, **38.7 apart (Y)**;
  top pair 2.5 from the top edge (43.7 − 38.7 − 2.5; the drawing's "5"
  is to the top of the active area, not to the holes), bottom pair 2.5
  from the bottom edge, 2.5 in from each side
- Header: 8 × 2.54 mm, span 17.78, centred, row centre **1.5 below the PCB top
  edge** (the drawing's "1.5" on the right) — above the top hole centres
  (2.5), not in line with them. Pin holes **Ø0.9**. Pin 1 (GND, square pad) on the left
  viewed from the front.
- Glass face sits 2.32 above the PCB front (3.52 above the PCB back)
- Back-side SMD positions aren't drawn: keep 1.5 mm clear under the whole
  module below the header strip. The male header's 2.5 mm plastic body is
  taller than the SMD layer, so it sets the gap to the main board.

## On the main board

- `PinSocket_1x08_P2.54mm_Vertical` + 4 × `MountingHole_2.2mm_M2`
- Outline and active-area rectangle on F.Fab / Dwgs.User for the case window
- Glass height above the main PCB = socket height + 2.5 (male header
  plastic) + 3.52. With a common 8.5 mm female socket that's ~14.5 mm
  (socket height unverified — check the one you buy). Use a low-profile
  socket + standoffs if it should sit lower.
- 3D: `case/ref/display-154.part.js` (FluidCAD envelope model: PCB,
  LCM, active area, SMD keep-out, male header). Silkscreen, pads and back-side parts
  (U7 SOT-89, U9 SOT-23, 0603 R/C) placed from the product photo, ±0.5 mm.

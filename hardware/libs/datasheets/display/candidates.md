# Display candidates for a strip above the keys

**Chosen: the 2.79" NV3007 (D16 in docs/decisions.md).** The 1.54" stays as
the fallback.

Option B from the layout discussion: drop the 1.54" 240×240 module beside
the keys and put a wide, low screen in a strip above the key rows instead.
That shortens the case (~215 mm instead of 250.7) and leaves room for a
27–30 mm encoder pitch. Collected 2026-10-09; prices are single units,
as listed to a Hungarian account, shipping not included.

Case height estimate: **≈ 50.6 + module height (Y)** — two key rows, the
step a pressed keycap (7.5) needs next to a raised screen segment, the
module, margins.

| | **2.79" NV3007** | **1.47" ST7789P3** | **Waveshare 1.9"** | *current 1.54"* |
|---|---|---|---|---|
| Folder | `2.79/` | `1.47/` | `1.9/` | `1.54/` |
| Resolution | 428 × 142 | 320 × 172 | 320 × 170 | 240 × 240 |
| Controller | **NV3007** | ST7789P3 | ST7789V2 | ST7789 |
| Module W × H × T (landscape) | **78.0 × 25.9 × 6 max** | **44.0 × 20.96 × 2.76** | 51.2 × 27.3 × ? | 43.7 × 32 × 5.02 |
| Active area | **64.14 × 21.28** (1365 mm²) | 32.35 × 17.39 (563 mm²) | 42.72 × 22.70 (970 mm²) | 27.72 × 27.72 (768 mm²) |
| Supply | VDD 3–5 V (on-board 3.3 V LDO) | **VDD 2.8–3.3 V only** | ? | 3.3 V |
| Logic | 3.3 V | 3.3 V | ? | 3.3 V |
| Backlight | 6 LEDs, 100 mA, NPN-switched BL pin | NPN-switched BL pin (Q1) | ? | NPN-switched BL pin |
| Connector | 8 × 2.54 header on a short edge (+ 10-pin FPC socket) | 8 × 2.54 header on a short edge (+ FPC socket on the back) | **MX1.25 8-pin cable on the back, no header** | 8 × 2.54 header |
| Pin order | GND VDD SCL SDA RES DC CS BL — same as now | GND VDD SCL SDA RES DC CS BL — same as now | ? | GND VCC SCL SDA RST DC CS BL |
| Mounting holes | 2 × Ø2.5 at the far end (20.0 apart) | 2 × Ø? at the far end | 4 × M2, 45.6 × 21.7 | 4 × Ø2, 27 × 38.7 |
| Drawing quality | full: outline, side view, AA, schematic | full: outline, AA/VA/CF offsets | Waveshare drawing | seller drawing |
| Price | HUF 1,544 (TZT / ShengYang) | HUF 1,225 (DIYUSER / GoldenMorning) | $11.99 (waveshare.com) | — |
| Case (est.) | **~215 × 77** | ~215 × 72 | ~215 × 78 | 250.7 × 56.7 |
| Listing | [AliExpress 1005012658981762](https://www.aliexpress.com/item/1005012658981762.html) | [AliExpress 1005010487277816](https://www.aliexpress.com/item/1005010487277816.html) | [waveshare.com](https://www.waveshare.com/1.9inch-lcd-module.htm) | [AliExpress 1005009712175802](https://www.aliexpress.com/item/1005009712175802.html) |

## Notes

- **2.79" NV3007** — biggest screen by far (1.8× today's area, a real
  bar: 428 px across 4 keys ≈ 107 px per key label). 78 mm is wider than
  the 4-key block (76.2) but fits over it plus the board margin. Thickest
  (6 mm max). NV3007 is less common than ST7789: drivers exist in
  Arduino_GFX (`Arduino_NV3007`) and as community `esp_lcd` components
  (`lz00qs/esp_lcd_nv3007`, `huming2207/soul-injector`); not in TFT_eSPI or
  LovyanGFX. 100 mA backlight counts against the power budget (D11).
- **1.47" ST7789P3** — thinnest (2.76) and cheapest, same driver family as
  now. Small: less visible area than the current 1.54", and only 44 mm of
  the 76 mm strip. VDD must stay at 3.3 V.
- **Waveshare 1.9"** — good documentation and availability, ST7789V2.
  But its only connector is a cable socket on the back, which doesn't fit
  the "header soldered into the main PCB" mounting; it would need a
  cable or a matching socket on our board. About 3× the AliExpress price,
  ~$8 more for one unit.

NV3007 datasheet: `nv3007-datasheet-v1.0.pdf` in this folder.

All three are 4-wire SPI, so the SPI B bus in `docs/pinout.md` stays as
it is. Nothing here is verified against a part in hand.

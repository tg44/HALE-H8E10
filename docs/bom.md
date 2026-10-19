# Bill of materials

Nothing is ordered yet. Prices are rough (Sept 2026). LCSC numbers are for
ordering loose parts; verify each one against the datasheet before buying,
package suffixes vary. v0 is hand-soldered, so order spares of everything
small.

## Bottom side

Designators are the schematic's (2026-10-19). LCSC numbers checked against
LCSC's product data on 2026-10-19 (part, value, package); stock moves
daily, so check again on order day.

| Ref | Qty | Part | LCSC | Notes |
|---|---|---|---|---|
| U1002 | 1 | Seeed XIAO ESP32S3 Plus (Seeed 102010671) | [C47997983](https://www.lcsc.com/product-detail/C47997983.html) | soldered flush. Low stock at LCSC (152); Seeed / EU resellers too. Not C48405120 — that's the XIAO nRF52840 Plus |
| U2002 | 1 | Microchip MCP3208T-CI/SL, SOIC-16 | [C626764](https://www.lcsc.com/product-detail/C626764.html) | 8-ch 12-bit SPI ADC; T = tape and reel, same chip. (Was C22412, which isn't an MCP3208; MCP3208-CI/SL C16939 had 0 stock on 2026-10-08) |
| U3001, U3002 | 2 | Microchip MCP23017-E/SS, SSOP-28 | [C506653](https://www.lcsc.com/product-detail/C506653.html) | I2C expanders, addr 0x20/0x21. (Was C47023 = MCP23017-E/SO, the SOIC-28 package) |
| U21001–U28001 | 8 | TI DRV5055A3QDBZR, SOT-23 | [C266128](https://www.lcsc.com/product-detail/C266128.html) | linear hall sensor (D15); stock KiCad SOT-23 pads (D21). Low stock (329) |
| — | 3–4 | TI DRV5055A4QDBZR, SOT-23 | [C266123](https://www.lcsc.com/product-detail/C266123.html) | spare: lower sensitivity, swap per key if one clips at bottom-out |
| D21001–D28001, D31001–D40001 | 18 | OPSCO SK6812MINI-EA, 3.2×2.8 reverse mount | [C5378731](https://www.lcsc.com/product-detail/C5378731.html) | SK6812MINI-E ([C5149201](https://www.lcsc.com/product-detail/C5149201.html)) is equivalent for hand soldering |
| U1001 | 1 | TI SN74AHCT1G125DBVR, SOT-23-5 | [C7484](https://www.lcsc.com/product-detail/C7484.html) | LED data level shift. (Was C7482 = SN74AHCT16244, wrong part) |
| U1003, U1004 | 2 | TI TPS22810DBVR, SOT-23-6 | [C205990](https://www.lcsc.com/product-detail/C205990.html) | load switches for `+5V_AUX` / `+5V_LED` (D23). 0 at LCSC on 2026-10-19, 1,518 at JLCPCB |
| U2001 | 1 | Microne ME6211C33M5G-N, SOT-23-5 | [C82942](https://www.lcsc.com/product-detail/C82942.html) | 3.3 V LDO 500 mA, `+5V_AUX` → `+3.3VA` |
| FB2001 | 1 | Sunlord GZ1608D601TF, 0603 | [C1002](https://www.lcsc.com/product-detail/C1002.html) | ferrite 600 Ω @ 100 MHz, 200 mA, analog rail. JLCPCB lists C1002 as this part, but its lcsc.com page is gone: check before ordering at LCSC |
| C1001–C1003, C2003–C2005, C2007–C2015, C3001, C3002, C21001–C28001, C21002–C28002, C31003–C40003 | 43 | 100 nF 50 V X7R 0603, Yageo CC0603KRX7R9BB104 | [C14663](https://www.lcsc.com/product-detail/C14663.html) | 18 LEDs, 8 sensors, 8 ADC inputs, ICs, rails, 2 × TPS22810 CT |
| C31001–C40002 | 20 | 1 nF 50 V X7R 0603, Samsung CL10B102KB8NNNC | [C1588](https://www.lcsc.com/product-detail/C1588.html) | encoder A/B to GND |
| C1006–C1009, C2001, C2002, C2006 | 7 | 10 µF 25 V X5R 0805, Samsung CL21A106KAYNNNE | [C15850](https://www.lcsc.com/product-detail/C15850.html) | 4 × `+5V_LED` bulk, LDO in, LDO out, `+3.3VA` |
| C1004, C1005, C2016 | 3 | 1 µF 50 V X5R 0603, Samsung CL10A105KB8NNNC | [C15849](https://www.lcsc.com/product-detail/C15849.html) | TPS22810 inputs, MCP3208 VREF/VDD. **The schematic still has C14663 (100 nF) on these three — fix the LCSC field** |
| RN2001, RN2002 | 2 | 1 kΩ ×4 array, 0603×4 convex, Uni-Royal 4D03WGJ0102T5E | [C20197](https://www.lcsc.com/product-detail/C20197.html) | sensor RC at the ADC (D19); 5 %, 62.5 mW per resistor, 0.8 pitch |
| R1001 | 1 | 220 Ω 1 % 0603, Uni-Royal 0603WAF2200T5E | [C22962](https://www.lcsc.com/product-detail/C22962.html) | LED data series |
| R3001, R3002 | 2 | 4.7 kΩ 1 % 0603, Uni-Royal 0603WAF4701T5E | [C23162](https://www.lcsc.com/product-detail/C23162.html) | I2C pull-ups |
| R1004, R1005, R2001, R3003, R3004 | 5 | 10 kΩ 1 % 0603, Uni-Royal 0603WAF1002T5E | [C25804](https://www.lcsc.com/product-detail/C25804.html) | EN_LED / EN_AUX pull-downs, ADC_CS pull-up to `+3.3VA`, INT_EXP pull-up, expander RESET |
| TP1001–TP1005, TP2001 | 6 | — | — | Ø2 mm pads: 5V, GND, 3V3, 5V_LED, 5V_AUX, 3V3A |

No 220 µF bulk electrolytic any more (D23).

## Top side

| Qty | Part | Source | Approx |
|---|---|---|---|
| 8 | Gateron KS-20 magnetic switch (not soldered) | keyboard shop (Candykeys, AliExpress) | $5–8 |
| 8 | keycaps | keyboard shop | $2–6 |
| 10 | Bourns PEC11R-4215F-S0024, 24/24, 15 mm D-shaft, push (D17; M7 nut + washer included) | LCSC [C143790](https://www.lcsc.com/product-detail/C143790.html) / TME / Mouser | $10–15 |
| 10 | knobs, 6 mm D-shaft | AliExpress | $3–5 |
| 1 | 2.79" 428×142 NV3007 bar module, 8-pin (TZT "2.79TFT-SPI", D16); male header comes with it, soldered into the main PCB | [AliExpress 1005012658981762](https://www.aliexpress.com/item/1005012658981762.html) | HUF 1,544 (~$4) |
| 2 | M2 spacers 3.0 mm + screws under the display (brass or nylon) | — | — |
| 1 | 1×8 2.54 mm male header (in case the module's doesn't fit or gets lost) | LCSC [C492407](https://www.lcsc.com/product-detail/C492407.html) (XFCN PZ254V-11-08P) | — |
| 7 | M2 brass heat-set inserts in the top's bosses (pcb-notes, mounting holes) | LCSC [C20618296](https://www.lcsc.com/product-detail/C20618296.html) (M2×3×3, only 26 in stock) or any brass M2 insert | — |
| 7 | M2 screws, brass or nylon, length from the tray design | not on LCSC | — |

## Fab

| Item | Approx |
|---|---|
| PCB 5× 2-layer 1.6 mm | $5–10 |
| SMD parts incl. spares | ~$10–15 |
| XIAO ESP32S3 Plus | $8–10 |
| Shipping + EU VAT (PCB and parts orders) | $15–30 |
| 3D-printed plate + case | $5–15 |

Total first unit: roughly **$70–120**, soldering not included.

# Bill of materials

Nothing is ordered yet. Prices are rough (Sept 2026). LCSC numbers are for
ordering loose parts; verify each one against the datasheet before buying,
package suffixes vary. v0 is hand-soldered, so order spares of everything
small.

## Bottom side

| Ref | Qty | Part | LCSC | Notes |
|---|---|---|---|---|
| — | 1 | Seeed XIAO ESP32S3 Plus | — | Seeed / EU reseller; soldered flush |
| U1 | 1 | MCP3208T-CI/SL, SOIC-16 | C626764 | 8-ch 12-bit SPI ADC; T = tape and reel, same chip. (Was C22412, which isn't an MCP3208; MCP3208-CI/SL C16939 had 0 stock on 2026-10-08) |
| U2, U3 | 2 | MCP23017-E/SS, SSOP-28 | C506653 | I2C expanders, addr 0x20/0x21. (Was C47023 = MCP23017-E/SO, the SOIC-28 package) |
| U4..U11 | 8 | DRV5055A3QDBZR, SOT-23 | C266128 | linear hall sensor (D15) |
| — | 3–4 | DRV5055A4QDBZR, SOT-23 | C266123 | spare: lower sensitivity, swap per key if one clips at bottom-out |
| D1..D20 | 20 | SK6812MINI-EA, 3.2×2.8 reverse | C5378731 | SK6812MINI-E is equivalent for hand soldering |
| U12 | 1 | SN74AHCT1G125DBVR, SOT-23-5 | C7484 | LED data level shift. (Was C7482 = SN74AHCT16244, wrong part) |
| U13 | 1 | ME6211C33M5G, SOT-23-5 | C82942 | 3.3 V LDO 500 mA |
| FB1 | 1 | ferrite 600 Ω@100 MHz 0603 | C1002 | analog rail |
| C* | ~60 | 100 nF 50 V X7R 0603 | C14663 | decoupling, RC filters |
| C* | ~20 | 1 nF 50 V 0603 | C1588 | encoder debounce |
| C* | ~6 | 10 µF 25 V 0805 | C15850 | LDO in/out, rails |
| C* | 1 | 1 µF 0603 | C15849 | MCP3208 VREF |
| C* | 1–2 | 220 µF 10 V electrolytic | — | LED rail bulk |
| R* | 8 | 1 kΩ 0603 | 0603WAF1001T5E | sensor output series |
| R* | 1 | 220 Ω 0603 | 0603WAF2200T5E | LED data series |
| R* | 2 | 4.7 kΩ 0603 | 0603WAF4701T5E | I2C pull-ups |
| R* | 3 | 10 kΩ 0603 | 0603WAF1002T5E | resets, display RST |

## Top side

| Qty | Part | Source | Approx |
|---|---|---|---|
| 8 | Gateron KS-20 magnetic switch (not soldered) | keyboard shop (Candykeys, AliExpress) | $5–8 |
| 8 | keycaps | keyboard shop | $2–6 |
| 10 | Bourns PEC11R-4215F-S0024 (LCSC C143790) or Alps EC11E light-detent, 24/24, D-shaft (no Alps part number picked yet) | LCSC / TME / Mouser | $10–15 |
| 10 | knobs, 6 mm D-shaft | AliExpress | $3–5 |
| 1 | 1.54" 240×240 ST7789 IPS module, 8-pin (NOMEN_TEC V2.0 family) | AliExpress | $4–6 |
| 1 | 1×8 female header 2.54 mm | any | — |
| 4+ | M2 standoffs/screws (brass or nylon) | — | — |

## Fab

| Item | Approx |
|---|---|
| PCB 5× 2-layer 1.6 mm | $5–10 |
| SMD parts incl. spares | ~$10–15 |
| XIAO ESP32S3 Plus | $8–10 |
| Shipping + EU VAT (PCB and parts orders) | $15–30 |
| 3D-printed plate + case | $5–15 |

Total first unit: roughly **$70–120**, soldering not included.

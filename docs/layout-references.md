# Layout references: key, knob and case dimensions

Where the spacing and print-thickness numbers in `case/lib/parts.js` come
from. Researched 2026-10-09 (web only, no units measured). Each value is
marked by how much it can be trusted:

- **spec** — from a specification or datasheet
- **inferred** — arithmetic on published overall sizes, not measured
- **rule** — community rule of thumb or forum opinion
- **ours** — a project default chosen from the above

Manufacturers don't publish knob pitch. If a real controller is at hand,
measuring its knob spacing beats everything below.

## Keys (MX / KS-20)

| Item | Value | Trust | Source |
|---|---|---|---|
| Key pitch | 19.05 mm (0.75 in), centre to centre | spec | [ai03 wiki](https://wiki.ai03.com/books/case-and-plate-design/page/switch-dimensions-and-physical-specifications/revisions/97) |
| Plate cutout | 14 × 14 mm | spec | ai03; KS-20 drawing agrees |
| Plate thickness | 1.5 ± 0.1 mm | spec | ai03; KS-20 drawing agrees |
| Plate top to PCB top | 5.0 mm | spec | ai03; KS-20 drawing agrees |
| Keycap | ~18 mm base, ~14 mm top, ~12.4 mm tall | rule | [deskthority](https://deskthority.net/viewtopic.php?p=327612) |
| Gap between caps | ~1 mm (19.05 − 18) | inferred | — |
| LPD8 / MPK / Launchpad pad pitch | not found | — | — |

## Knobs and encoders

| Item | Value | Trust | Source |
|---|---|---|---|
| Intech Grid EN16 (4 × 4) | 107 × 107 × 38 mm module, 16 evenly spaced encoders → ~26.75 mm pitch | inferred (checked by the owner) | [Thomann](https://www.thomann.fr/intech_studio_grid_series_3_en16_detent.htm) |
| 16-encoder unit, 240 × 60 mm (2 × 8) | 30 × 30 mm per encoder | inferred (found by the owner; product not named) | — |
| Midi Fighter Twister (4 × 4) | ≤ 38.5 mm pitch (154 mm / 4) | inferred | [Thomann](https://www.thomannmusic.com/dj_techtools_midi_fighter_twister_black.htm) |
| 12 mm knobs | comfortable at ~18 mm centres | rule | [sdiy.info](https://sdiy.info/wiki/Eurorack_panel_components) |
| Doepfer / Analogue Solutions | 20 mm vertical pot spacing | rule (what those makers do) | sdiy.info |
| 25 mm pitch | "a little tight" for performance use | rule | [LMNC forum](https://lookmumnocomputer.discourse.group/t/panel-layout-best-practices/6780) |
| Knob centre distance | knob Ø + 8…10 mm for a thumb + index grip | rule (no source states it) | — |
| 6 mm D-shaft knobs | 15 × 17 mm, 17 × 17 mm common | rule (shop listings) | [lectronz](https://www.lectronz.com/products/rotary-encoder-knob-15x17-mm), [gogo](https://sparks.gogo.co.nz/catalog/Hardware-270/17mm-Aluminium-Black-Potentiometer-Encoder-Knob-235.html) |
| LPD8, MPK mini, MiniLab 3, LC XL, X-Touch Mini | only overall sizes published | — | — |
| Gap between key block and knob block | not found for any product | — | — |

## 3D printing (0.4 mm nozzle, PLA / PETG)

| Item | Value | Trust | Source |
|---|---|---|---|
| Minimum wall | 0.8 (2 lines), 1.2 (3 lines) recommended, ≥ 1.5 for strength | rule | [JLC3DP](https://jlc3dp.com/blog/what-is-an-appropriate-wall-thickness-for-3D-Printing-Parts) |
| Top / bottom skin | 0.8–1.0 mm (4–5 layers at 0.2) | rule | — |
| Hole clearance | +0.2…0.3 per side; printed holes come out undersize | rule | [sovol](https://www.sovol3d.com/blogs/news/fdm-3d-printing-tolerances-clearances-how-to-design-parts-that-fit) |
| Printed MX plate | thicker plate, thinned to 1.5 where the clips grab; cutouts 13.85–14.0 | rule | [keebtalk](https://keebtalk.com/t/building-with-thicker-plates-than-usual/18844) |
| Diffusers | 0.2–0.8 mm tested; 0.6 brighter, 0.8 more diffuse; translucent PETG keeps colour best; cooler/faster print = more diffuse | rule | [Printables kit](https://www.printables.com/model/64853-diffuser-experiment-kit) |

## Project defaults (ours — iterate from here)

| Item | Value | In `case/lib/parts.js` (or a board's `layout.js`) |
|---|---|---|
| Key pitch | 19.05 | `U` |
| Encoder pitch along a row | 27 (Intech ~26.75); 30 also fits the bed (case ~234 long) | `ENC_PX` |
| Encoder rows | aligned: bottom row with the front key row, top row with the display centre (48.5 apart); `'even'` and `'pitch'` (27) also available | `ENC_ROWS` |
| Knob (placeholder) | Ø15 × 17 | `KNOB_D`, `placeholders.part.js` |
| Keycap edge → knob edge | ≥ 8 (≈ 24.5 key centre → knob centre) | `KEY_KNOB_GAP` |
| Case walls, floor | 2.0 (5 lines), 2.0 | `WALL`, `FLOOR` |
| Encoder panel | 2.0 (≤ 2.5: washer 0.5 + nut 2.0 on the 5 mm thread) | `SEG.encoders` |
| Switch plate | 1.5 (KS-20); a thicker plate with 1.5 clip pockets is the next iteration | `SEG.keys` |
| M7 bushing hole | Ø7.4 | `lib/plate.js` |
| Print bed | 256 × 235, 4 mm spare for skirt/brim; H8E10 case 222.0 × 82.7, mini 91–114 × 82.7 | `BED` (`lib/layout-core.js` throws if exceeded) |
| Display bezel (2.79" strip) | 1.8: 0.3 above the glass (glass at 6.4 on 3.0 spacers), top flush with the encoders at 8.5 | `SEG.display` |
| Step around the key area | 3.5 high (5.0 → 8.5), fillet 3.499 | `STEP_EDGE` |
| Flat strip, fillet → screen window | 5.3 | `WINDOW_LAND` |
| Screen window | active area + 0.5 per side | `WINDOW_PAD` |
| Edge symmetry | window → back edge = front keycap → front edge (7.0) | rule in `lib/layout-core.js` |
| Diffusers (later, LEDs) | 0.6–1.0 translucent PETG, 2–3 mm air gap to the LED | — |

To check with real parts: print a test coupon with 13.9 / 14.0 / 14.1
switch cutouts and 7.3 / 7.4 / 7.5 bushing holes before the full top.

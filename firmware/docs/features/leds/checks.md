# LED checks

Run order: [bringup.md](../../bringup.md). Needs SYS-M8.

| ID | Check | How | Expected (source) | Board | Result | Date |
|---|---|---|---|---|---|---|
| LED-M1 | First LED lights | light index 0 only, red then green then blue | ENC1's LED shows each colour (D22) | | | |
| LED-M2 | Chain order | walk index 0 → 17, one at a time | order as pinout.md, LED chain | | | |
| LED-M3 | Every LED, every colour | all LEDs red, green, blue, white (low brightness) | no dead or swapped colours | | | |
| LED-M4 | No flash at plug-in or reset | plug in, press RESET, watch | all dark until firmware enables `+5V_LED` (D23) | | | |
| LED-M5 | Light visible in the case | full case, room light | visible through key windows and encoder cutouts (pcb-notes: encoders need a light pipe or translucent insert) | | | |

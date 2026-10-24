# Display checks

Run order: [bringup.md](../../bringup.md). Needs SYS-M7.

| ID | Check | How | Expected (source) | Board | Result | Date |
|---|---|---|---|---|---|---|
| LCD-M1 | Init and test pattern | console command: colour bars, corner markers | whole 428 × 142 area filled, colours right (D16) | | | |
| LCD-M2 | Orientation | corner markers labelled | right way up after the 180° rotation setting (pcb-notes) | | | |
| LCD-M3 | Backlight PWM | step 0 → 100 % | dims smoothly, fully off at 0 | | | |
| LCD-M4 | Full-speed SPI | full-screen redraws at 80 MHz for a minute | no stripes or corrupted pixels (pinout.md, SPI B) | | | |
| LCD-M5 | Power cycle | `+5V_AUX` off, on, re-init | comes back without a reset of the ESP32 (D23) | | | |

# System checks

Run order: [bringup.md](../../bringup.md).

| ID | Check | How | Expected (source) | Board | Result | Date |
|---|---|---|---|---|---|---|
| SYS-M1 | Hall sensor and LED orientation, before power | eyes / loupe against the iBOM | pin 1 marks match (pcb-notes, Hand assembly) | | | |
| SYS-M2 | No short to GND on `+5V`, `+3V3`, `+3V3A`, `+5V_AUX`, `+5V_LED` | multimeter, Ω, at the test points | not near 0 Ω; reading may climb as caps charge (general practice) | | | |
| SYS-M3 | `+5V` with USB plugged in | multimeter at TP 5V | USB VBUS, ~5 V (unverified range; USB 2.0 allows roughly 4.75–5.25) | | | |
| SYS-M4 | `+3V3` | TP 3V3 | 3.3 V (XIAO 3V3_OUT, D21) | | | |
| SYS-M5 | `+5V_AUX`, `+5V_LED` while booting and idle | TP 5V_AUX, TP 5V_LED | ~0 V, off until firmware enables them (D23) | | | |
| SYS-M6 | USB console | `pio device monitor -e xiao` | XIAO enumerates as USB-Serial-JTAG, log appears | | | |
| SYS-M7 | EN_AUX on | console command, then TP 5V_AUX and TP 3V3A | `+5V_AUX` ≈ `+5V` (switch drop unverified); `+3V3A` 3.3 V (ME6211C33, tolerance unverified) | | | |
| SYS-M8 | EN_LED on | console command, TP 5V_LED | ≈ `+5V` (D23) | | | |
| SYS-M9 | Reset with both rails on | press RESET, watch both TPs | both rails drop (EN pull-downs, D23) | | | |
| SYS-M10 | Rails off | console command | rail falls quickly (QOD discharge, D23); optional: scope the ~9 ms rise on the way up | | | |
| SYS-M11 | Worst-case USB current | USB meter: Wi-Fi on, backlight full, LEDs at the brightness cap | < 500 mA (pcb-notes, 5 V rails) | | | |

# Keys

Status: planned. Milestones: C8, C9.

Eight hall keys: Gateron KS-20 switches, a DRV5055A3 under each, read
through the MCP3208 (D2, D5, D15). key1–4 the back row, key5–8 the front
row (pinout.md).

## Already decided

- MCP3208 on SPI A (SPI3 through the GPIO matrix): SCK GPIO7, MISO GPIO8,
  MOSI GPIO9, CS GPIO44; clock ≤ 1 MHz at 3.3 V (pinout.md). Its own
  bus so the key scan never waits for the display.
- Powered from `+3V3A`, behind `+5V_AUX` (D23).
- Channel map: CH0–3 = key1–4, **CH4–7 = key8–5** (reversed for routing,
  pinout.md).
- Ratiometric: sensors and the ADC reference share `+3V3A`, so rail
  drift cancels (D5, D15).
- Sensor rests at VCC/2 and swings either way; which way depends on the
  magnet's pole, so calibration records rest, bottom-out and the sign
  (D12, D15, pcb-notes Magnetics).
- DRV5055A3 output is linear to 0.2 V from either rail (D15): at 12 bits
  that's roughly 250–3850 counts. A reading pinned at an end means
  clipping (D14/D15 risk).
- Read loop on core 1 (firmware/README.md).
- Velocity = time between two thresholds high in the travel; aftertouch =
  travel past actuation; rapid trigger (D2).
- The case bosses set the magnet distance (D24), so values from the bare
  board aren't final.

## Parts (files written when work starts)

- `adc.md` — MCP3208 reads, scan rate, filtering
- `calibration.md` — first calibration: rest, bottom-out, sign, per key
- `tuning.md` — adjusting later: thresholds, curves, re-calibration
- `actuation-velocity.md` — actuation point, velocity from two thresholds
- `aftertouch.md`
- `rapid-trigger.md`

## Open questions

- OPEN: target scan rate and filtering.
- OPEN: calibration flow: automatic rest at boot, guided bottom-out
  press, or learning from use.
- OPEN: thresholds, velocity curve, rapid-trigger distances (need real
  traces from KEY-M3).
- OPEN: aftertouch as channel pressure or poly pressure (with midi).

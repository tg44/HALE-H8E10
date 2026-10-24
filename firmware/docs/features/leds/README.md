# LEDs

Status: planned. Milestone: C5.

The 18 SK6812MINI-E LEDs under the keys and encoders: driving the chain,
brightness, the status light.

## Already decided

- One chain, LED_DATA on GPIO1 → 74AHCT1G125 (3.3 → 5 V) → 220 Ω → first
  LED (D8, pcb-notes). Driven over RMT.
- Power on `+5V_LED`, switched by EN_LED (D23). Off through boot and
  reset, so the chain can't flash garbage.
- Chain order (pinout.md, LED chain): index 0–4 ENC1–5, 5–9 ENC10–6,
  10–13 key4–1, 14–17 key8–5.
- **Status light**: ENC1's LED (index 0) shows boot state, fault blink
  codes and recovery / Wi-Fi AP until the display is up, and on errors.
  Otherwise it's a normal encoder LED (D22). It's first so it still works
  when a later LED is dead.
- **Global brightness cap**: 18 LEDs at full white ≈ 650 mA, more than a
  500 mA USB port gives with the backlight and the ESP32 on top
  (pcb-notes, 5 V rails).

## Parts (files written when work starts)

- `driver.md` — RMT output, frame update, rail on/off
- `status-light.md` — blink codes and colours
- `brightness.md` — cap, per-LED scaling

## Open questions

- OPEN: the brightness cap value (needs SYS-M11).
- OPEN: blink codes and colours for the status light.

# Firmware

Target: Seeed XIAO ESP32S3 Plus. Not started. Milestones are track C in
[docs/plan.md](../docs/plan.md); C0–C4 need only a bare XIAO on USB.

Planned stack: ESP-IDF (or Arduino-ESP32) + TinyUSB for class-compliant
USB-MIDI, BLE-MIDI, AsyncWebServer for the settings page.

Modules to write:
- `sense/` — MCP3208 read loop on core 1, per-key calibration, velocity
  (two thresholds), aftertouch, rapid trigger
- `input/` — MCP23017 interrupt read, Gray-code encoder decode, acceleration,
  push with rotation-lockout
- `midi/` — USB-MIDI + BLE-MIDI; relative CC for encoders
- `ui/` — NV3007 2.79" bar (D16: Arduino_GFX `Arduino_NV3007` or an esp_lcd
  component; not in LovyanGFX), dim-after-idle, blank-after-minutes
- `leds/` — SK6812 chain via RMT, 18 LEDs, ENC1's first (index 0)
- `settings/` — settings model, NVS storage, on-device settings mode
- `web/` — Wi-Fi config, MIDI map editor, calibration view

## Settings mode (proposal, not final)

There is no dedicated menu button; the board has 8 keys and 10 push
encoders.

- **Enter/leave**: long-press (~0.7 s) the encoder next to the display.
  A short push keeps its normal function.
- **While in settings**: the board stops sending MIDI and six keys light
  up as a d-pad with OK and back. Unlit keys do nothing.

  ```
  [    ] [ ▲  ] [    ] [back]      ▲ ◀ ▼ ▶  yellow
  [ ◀  ] [ ▼  ] [ ▶  ] [ OK ]      OK green, back red
  ```

  ▲/▼ move through a list or change a value, ◀/▶ go out of / into a
  level or step between fields, OK confirms, back leaves the level (and
  leaves settings from the top level).
- **Encoder as a second way in**: when a value is being edited, the menu
  encoder lights up and turning it changes the value, same as ▲/▼ but
  faster for long ranges. Its LED is off when turning would do nothing.
- **One thing to know**: the long-press. Everything after that is shown by
  the LEDs and the display; there are no hidden pages or chords.
- **Saved on exit** to NVS; the web UI edits the same settings model.
- **Status light**: there are no separate status LEDs (D22). ENC1's LED,
  first in the chain, shows status until the display is up (boot, faults
  as blink codes, recovery / Wi-Fi AP) and on errors; otherwise it behaves
  like every other encoder LED. The display shows connection details.
- **Recovery**: holding that encoder while plugging in boots with defaults
  and Wi-Fi AP on, without touching stored settings until confirmed.
- **Flashing**: with TinyUSB owning the USB port there is no automatic
  reset into the bootloader, so "reboot to bootloader" is a menu item on
  the system page (BOOT on the XIAO stays reachable through the tray as the
  fallback).

If the long-press turns out to be awkward, a dedicated tact switch can go on
one of the spare XIAO GPIOs (pinout.md). The expanders have no spare inputs
left: their bit-7 pins are output-only (D20).

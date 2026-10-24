# Firmware

Target: Seeed XIAO ESP32S3 Plus. Not started. Milestones are track C in
[docs/plan.md](../docs/plan.md); C0–C4 need only a bare XIAO on USB.

Planned stack: PlatformIO + pioarduino, Arduino framework (D25); TinyUSB
for class-compliant USB-MIDI, BLE-MIDI, AsyncWebServer for the settings
page.

Notes on how and why, in [docs/](docs/):
- [toolchain.md](docs/toolchain.md) — pioarduino, pinned platform, envs
  (`native`, `xiao`, `xiao-usbmidi`)
- [usb.md](docs/usb.md) — USB-Serial-JTAG vs TinyUSB, why USB-MIDI is
  switched on last, "reboot without MIDI"

Modules to write:
- `sense/` — MCP3208 read loop on core 1, per-key calibration, velocity
  (two thresholds), aftertouch, rapid trigger
- `input/` — MCP23017 interrupt read, Gray-code encoder decode, acceleration,
  push with rotation-lockout
- `midi/` — one output interface (log, BLE-MIDI, USB-MIDI); relative CC
  for encoders
- `ui/` — NV3007 2.79" bar (D16: Arduino_GFX `Arduino_NV3007` or an esp_lcd
  component; not in LovyanGFX), dim-after-idle, blank-after-minutes
- `leds/` — SK6812 chain via RMT, 18 LEDs, ENC1's first (index 0)
- `settings/` — settings model, NVS storage, on-device settings mode
- `web/` — Wi-Fi config, MIDI map editor, calibration view

## Settings mode

Moved to [docs/features/settings/on-device-menu.md](docs/features/settings/on-device-menu.md).
Features, task lists and hardware checks: [docs/features.md](docs/features.md).

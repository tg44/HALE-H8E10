# Toolchain

PlatformIO with the **pioarduino** platform, `framework = arduino` (D25).

## Why pioarduino, not stock PlatformIO

Espressif stopped supporting PlatformIO in 2024. The official
`platform-espressif32` stayed on Arduino-ESP32 2.x (old ESP-IDF 4.4), so
Arduino core 3.x (ESP-IDF 5.x, newer TinyUSB and esp_lcd) only reaches
PlatformIO through the community fork pioarduino. (From memory, not
re-checked; look at the pioarduino releases page when setting up C0.)

Why not plain ESP-IDF: `idf.py build flash monitor` is just as easy now,
but the libraries the plan uses (`Arduino_GFX` for the NV3007, BLE-MIDI,
ESPAsyncWebServer) are Arduino libraries, and `lib_deps` is the easiest
way to pull them in. If an IDF setting is ever needed that Arduino doesn't
expose, `framework = arduino, espidf` builds both without switching tools.

## Rules

- **Pin a pioarduino release tag** in `platform =`, not `#develop`. A
  platform update in the middle of board bring-up should never be the
  reason something stops working. Bump it on purpose, in its own commit.
- Same layout as luminotaxis (`~/dev/luminotaxis/firmware`):
  - `[env:native]` — host-native Unity tests (`pio test -e native`), for
    logic that doesn't touch hardware (key engine, encoder decode, MIDI
    mapping, settings model).
  - `*_esp.cpp` / `*_native.cpp` split, filtered with `build_src_filter`,
    for the code that does.
  - `-std=gnu++17`, `-Wall -Wextra`.

## Envs (planned)

| Env | USB port | Use |
|---|---|---|
| `native` | — | unit tests on the computer |
| `xiao` | USB-Serial-JTAG (`ARDUINO_USB_MODE=1`) | day-to-day: serial log, auto-reset flashing, JTAG debugging |
| `xiao-usbmidi` | TinyUSB (`ARDUINO_USB_MODE=0`) | the shipping build; see [usb.md](usb.md) |

Both XIAO envs build the same code. The difference is one build flag and
which MIDI output is compiled in.

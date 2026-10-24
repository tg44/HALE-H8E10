# On-device settings mode

Moved from firmware/README.md (2026-10-22). Still a proposal: behaviour
IDs (SET-T…) get added when the menu is specified for real (C11).

## What it does

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
  reset into the bootloader, so the system page has "reboot to
  bootloader" and "reboot without MIDI" (one boot with the USB console,
  [usb.md](../../usb.md)). OTA is the normal way to update; BOOT on the XIAO stays
  reachable through the tray as the fallback.

If the long-press turns out to be awkward, a dedicated tact switch needs a
XIAO pin, and there is no clean one left: since D23 only GPIO3 (strapping)
and GPIO43 (boot chatter; pinout.md rules out a button there) are free.
The pin would have to be given back, e.g. EN_AUX (D23 names it first). The
expanders have no spare inputs either: their bit-7 pins are output-only
(D20).

## Open questions

- OPEN: long-press time (~0.7 s proposed), menu tree, which settings are
  on the device and which only on the web page.

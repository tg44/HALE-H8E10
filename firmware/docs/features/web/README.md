# Web

Status: planned. Milestones: C4, C12.

Wi-Fi, the settings web UI, OTA updates, logs over Wi-Fi.

## Already decided

- ESPAsyncWebServer (D25).
- Recovery boot turns the Wi-Fi access point on (on-device-menu.md).
- OTA is the normal update path once USB carries MIDI, so it has to be
  solid before C13 ([usb.md](../../usb.md)).
- Pages planned: MIDI map editor, calibration view (plan C12).
- Antenna: external, on the XIAO's U.FL, placed in the case away from the
  sensors and metal (pcb-notes, XIAO).

## Parts (files written when work starts)

- `wifi-connect.md` — station mode, access point, how the board gets
  onto a network
- `auth.md` — who may change settings or flash firmware
- `ota.md` — upload, verify, roll back
- `debug-over-wifi.md` — live logs, sensor values
- `components.md` — shared UI pieces
- `pages/<page>.md` — one per page: wifi, midi-map, calibration, system

## Open questions

- OPEN: how the web UI is built and stored (plain HTML/JS in flash, or a
  build step).
- OPEN: auth for OTA and settings.
- OPEN: rollback if a new firmware doesn't boot.

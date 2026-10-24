# MIDI

Status: planned. Milestones: C1, C3, C10, C13.

Turns key and encoder events into MIDI and sends it out.

## Already decided

- One output interface with interchangeable outputs: log, BLE-MIDI,
  USB-MIDI. The key engine and the mapping don't know where messages go
  ([usb.md](../../usb.md)).
- USB-MIDI is class-compliant over TinyUSB, switched on last (C13, D25);
  until then MIDI goes to the log or BLE.
- Encoders send relative CC (firmware/README.md).
- Mapping modes: notes, relative CC, DJ / Ableton modes (plan C10).
- No MIDI while the settings mode is open (on-device-menu.md).

## Parts (files written when work starts)

- `output.md` — the interface, log output, queueing
- `mapping.md` — notes, CC, modes
- `ble.md` — BLE-MIDI
- `usb-midi.md` — USB-MIDI behaviour and tests (the USB mode background
  stays in ../../usb.md)

## Open questions

- OPEN: which relative-CC encoding (several exist; DAWs differ).
- OPEN: aftertouch as channel or poly pressure (with keys).
- OPEN: what the DJ / Ableton modes map to.

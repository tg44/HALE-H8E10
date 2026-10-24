# MIDI checks

| ID | Check | How | Expected (source) | Board | Result | Date |
|---|---|---|---|---|---|---|
| MIDI-M1 | BLE-MIDI pairing | pair with macOS (Audio MIDI Setup) | shows up, notes arrive | | | |
| MIDI-M2 | USB-MIDI enumeration | plug into macOS and Windows | class-compliant device, no driver (usb.md) | | | |
| MIDI-M3 | Nobody listening | USB-MIDI connected, no app open, play for a minute | no hang, no stuck notes later (usb.md) | | | |
| MIDI-M4 | In a DAW | Ableton / any DAW, keys and encoders | notes with velocity, aftertouch, encoders move controls | | | |

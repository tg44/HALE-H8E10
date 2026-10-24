# Features

Every firmware feature, what it does, where it stands. Rules for these
docs: [../AGENTS.md](../AGENTS.md). Milestones are track C in
[docs/plan.md](../../docs/plan.md).

Status words: `planned` → `spec` → `building` → `works native` →
`works on XIAO` → `works on board`.

| Feature | Prefix | Status | Milestones |
|---|---|---|---|
| [system](features/system/) | SYS | planned | C0, C1, C13 |
| [leds](features/leds/) | LED | planned | C5 |
| [display](features/display/) | LCD | planned | C6 |
| [encoders](features/encoders/) | ENC | planned | C7 |
| [keys](features/keys/) | KEY | planned | C8, C9 |
| [midi](features/midi/) | MIDI | planned | C1, C3, C10, C13 |
| [settings](features/settings/) | SET | planned | C2, C11 |
| [web](features/web/) | WEB | planned | C4, C12 |

## system

Everything the other features stand on: the pin map, boot order, the two
switched 5 V rails (D23) and the rules for using them, the reboot modes
(to the bootloader, one boot without MIDI), the recovery boot, and where
logs go. It also holds the bring-up commands used to check a fresh board
step by step ([bringup.md](bringup.md)).

## leds

The 18 SK6812 LEDs, ENC1's first in the chain (D22). Drives the chain over
RMT, keeps total brightness under the USB budget, and owns the status
light: ENC1's LED shows boot state, faults and recovery until the display
is up. First thing checked on a new board (C5), because it proves the
`+5V_LED` rail and the level shifter.

## display

The 2.79" 428 × 142 NV3007 bar above the keys (D16). Driver, the screens
(key labels, encoder values, status and connection details, the settings
menu), backlight PWM, dim after idle and blank after minutes.

## encoders

Ten detented push encoders (D17) on two MCP23017s plus two pushes on XIAO
pins (D20). Gray-code decode, acceleration and a fine mode (D7), push with
rotation lockout, push-to-reset. Produces "encoder n moved by k" and
"encoder n pushed" events for the MIDI mapping and the settings menu.

## keys

Eight hall keys read through the MCP3208 (D5, D15). Per-key calibration
(rest, bottom-out, sign of the swing), then the key engine: actuation,
velocity from two thresholds, aftertouch, rapid trigger (D2). Produces
key events with velocity and pressure. The biggest feature and the one
the v0 board is really testing (D12).

## midi

Turns key and encoder events into MIDI: note mapping, relative CC for the
encoders, DJ / Ableton modes. One output interface with interchangeable
outputs: log, BLE-MIDI, USB-MIDI. USB-MIDI goes on last
([usb.md](usb.md), D25).

## settings

The settings model shared by everything else, stored in NVS, and the
on-device settings mode (long-press ENC1, keys as a d-pad). The web UI
edits the same model.

## web

Wi-Fi (station and the recovery access point), the settings web UI (MIDI
map editor, calibration view), OTA updates, and logs over Wi-Fi. OTA is
the normal way to update once USB carries MIDI, so it has to work before
C13.

## Without the board

Most behaviour can be built and tested in the `native` env before any
hardware exists: the key engine on recorded or simulated sensor traces,
encoder decoding, MIDI mapping and encoding, the settings model and the
menu state machine, screens rendered to images, LED patterns, and the web
UI against a mock API. Drivers stay thin so this part stays large. A bare
XIAO is enough for C0–C4.

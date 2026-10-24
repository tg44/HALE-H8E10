# HALE H8E10 firmware

Firmware for the XIAO ESP32S3 Plus. The project rules in the root
`CLAUDE.md` apply here too: the owner is learning, explain the why, part
facts come from datasheets, say so when something looks wrong. This file
adds the rules for the firmware and its docs.

## Stack

PlatformIO + pioarduino (pinned release), Arduino framework (D25).
Envs: `native` (unit tests on the computer), `xiao` (USB console),
`xiao-usbmidi` (shipping build). Why and how: `docs/toolchain.md`,
`docs/usb.md`.

- Tests: `pio test -e native`
- Build: `pio run -e xiao`; flash: `pio run -e xiao -t upload`

Drivers are thin (`*_esp.cpp`); behaviour lives in code that also builds
for `native` (`*_native.cpp` for the stand-ins), so it can be tested
without hardware.

## Where things live

```
docs/
  features.md            every feature: one paragraph, status, link
  bringup.md             order of first-power checks; links only
  toolchain.md, usb.md   cross-cutting notes
  features/<feature>/
    README.md            what it does, status, files in this folder
    <part>.md            one per part of the feature (spec + auto tests)
    pages/<page>.md      web UI only, one per page
    tasks.md             the feature's working task list
    checks.md            the feature's manual checks on real hardware
```

Feature folders and their ID prefix:

| Folder | Prefix | Covers |
|---|---|---|
| `keys` | KEY | MCP3208, hall sensors, calibration, velocity, aftertouch, rapid trigger |
| `encoders` | ENC | MCP23017s, Gray-code decode, acceleration, pushes |
| `display` | LCD | NV3007, screens, dimming |
| `leds` | LED | SK6812 chain, status light, brightness cap |
| `midi` | MIDI | output interface, mapping, USB-MIDI, BLE-MIDI |
| `settings` | SET | settings model, NVS, on-device settings mode |
| `web` | WEB | Wi-Fi, auth, OTA, debug over Wi-Fi, web UI pages |
| `system` | SYS | boot, 5 V rails, recovery, reboot modes, logging |

A new feature gets a folder, a prefix (added to this table) and a line in
`features.md`.

## File roles

**`features.md`** is the high-level view: one short paragraph per feature,
its status, a link to its folder. Status is one of: `planned`, `spec`,
`building`, `works native`, `works on XIAO`, `works on board`.

**Feature `README.md`**: what the feature does for the player, the
status (same words), which modules/files implement it, the list of part
files, and open questions that span the whole feature.

**Part files** (`calibration.md`, `ota.md`, `pages/wifi.md`, ...). Split a
feature when a part has its own behaviour and tests; don't split for size
alone. Sections, in this order:

1. **What it does** — a few sentences.
2. **Behaviour** — numbered, testable statements, each with an auto-test
   ID (`KEY-T3`). What should happen, not how the code does it.
3. **Settings** — name, default, range, unit, where it's edited.
4. **Open questions** — anything not decided. Mark them `OPEN:` inline
   too where they block a behaviour.

**`tasks.md`**: checkboxes, grouped under `## Now`, `## Next`,
`## Needs the board`, `## Done`. Move ticked items to Done instead of
deleting them. A task can name the IDs it covers (`KEY-T3, KEY-M2`).

**`checks.md`**: every manual check on real hardware for that feature, in
one table:

```
| ID | Check | How | Expected (source) | Board | Result | Date |
|---|---|---|---|---|---|---|
| LED-M1 | +5V_LED after EN high | multimeter at C… | 5.0 V ± 5 % (D23) | #1 | 4.97 V ✓ | 2026-… |
```

- **Expected** always names its source: a D-entry, a datasheet, a doc. No
  source → write `unverified` and say why.
- **Board** is the v0 board number (#1–#5). A check run on two boards
  gets two rows.
- A failed check stays in the table with ✗ and a note or link to the fix.
  Don't overwrite results; add a row when re-measured.

**`bringup.md`** lists the order in which checks run on a fresh board
(rails before chips, the 5 V switch before the LEDs, ...), as links to
check IDs. The checks themselves live only in the feature's `checks.md`.

## IDs

- `<PREFIX>-T<n>`: automatic test (behaviour in a part file).
- `<PREFIX>-M<n>`: manual check (in `checks.md`).
- Numbers only go up and are never reused. A removed item stays with
  ~~strikethrough~~ and a reason, so old links and commits still make
  sense.
- Unity test functions carry the ID:
  `test_KEY_T3_rapid_trigger_fires_after_distance()`. A behaviour without
  a test says why (`needs hardware → KEY-M4`).

## Task lists

- `docs/plan.md` (track C) holds only milestones, each linking to the
  feature folder(s). Tick a milestone when its tasks are done.
- The detailed, changing list is the feature's `tasks.md`. Don't repeat
  its tasks in `plan.md`, or the other way round.

## Writing rules

- **Don't write ahead.** A new feature folder starts as a stub: headings,
  what's already decided, `OPEN:` questions. Fill a part when work on it
  starts. Inventing numbers (thresholds, timings, curves) to fill a spec
  is worse than leaving them open.
- **Decided means written down somewhere.** A behaviour or default that
  comes from a D-entry, `pinout.md` or `pcb-notes.md` links there. A new
  firmware decision that changes what's planned gets a `D<n>` in
  `docs/decisions.md` (append only).
- **Hardware facts** (pins, rails, chip limits) come from `docs/pinout.md`,
  `docs/pcb-notes.md` and the datasheets in `hardware/libs/datasheets/`,
  not from memory. If a value wasn't looked up, mark it `unverified`.
- **Keep in sync**: when behaviour changes, update the part file, its
  tests, and the status in `README.md` and `features.md` in the same
  change.
- Short and plain, in the style of the root docs. Explain why when it
  isn't obvious; the docs are also how the owner learns the design.

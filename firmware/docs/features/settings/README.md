# Settings

Status: planned. Milestones: C2, C11.

One settings model for the whole firmware, stored in NVS, edited on the
device and on the web page.

## Already decided

- One model; the on-device menu and the web UI edit the same thing
  (firmware/README.md).
- Stored in NVS, saved when leaving settings mode.
- On-device settings mode: long-press ENC1, keys as a d-pad, ENC1 turns
  values ([on-device-menu.md](on-device-menu.md), a proposal).
- Recovery boot (hold ENC1 while plugging in) starts with defaults and
  doesn't touch stored settings until confirmed.

## Parts

- [on-device-menu.md](on-device-menu.md) — the settings mode (proposal)
- `model.md` (when work starts) — what's in the model, defaults, ranges,
  versioning when the model changes between firmware versions
- `storage.md` (when work starts) — NVS layout, save timing, reset to
  defaults

## Open questions

- OPEN: the list of settings (grows from the other features' Settings
  sections).
- OPEN: how stored settings survive a firmware update that changes the
  model.

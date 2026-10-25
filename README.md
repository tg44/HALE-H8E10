# HALE H8E10

**H**all ×**8**, **E**ncoder ×**10**. An open-source USB-MIDI pad controller with hall-effect (analog) keys, ten
push-encoders, a small colour display and per-key RGB, built around an
ESP32-S3 so it can also do BLE-MIDI and a Wi-Fi settings page.

Think "LPD8-sized, with velocity and aftertouch that actually come from the
key, and an Ableton/DJ mode flip for the knobs."

> Inspired by the Akai Professional LPD8 and MPK mini. This project is not
> affiliated with or endorsed by Akai; those names are used only to describe
> the layout it takes after.

## What it is

- 8 hall-effect keys (Gateron KS-20 magnetic switches, DRV5055A3 sensors) with
  per-key velocity, aftertouch and rapid-trigger style actuation
- 10 detented push-encoders in two rows; a row reads `[browse][hi][mid][lo][mix]`
  in "DJ" mode and ten macro knobs in "Ableton" mode
- 2.79" 428×142 bar display (NV3007, SPI) in a strip above the keys
- 18 reverse-mount RGB LEDs (SK6812MINI-EA), one per key and one per encoder; no separate status LEDs (the display and ENC1's LED cover status)
- Seeed XIAO ESP32S3 Plus: class-compliant USB-MIDI, BLE-MIDI, Wi-Fi web UI
- Powered from the XIAO's USB-C; no external supply

## Name

The model code follows the Intech/Akai habit of letters-and-counts: `H8E10` is
8 hall-effect keys and 10 encoders, so a 32-key sibling would be `H16E16` and
a fader version `H8E10F4`. **HALE** is the family name (HALl Encoder; also
"hale" as in healthy and strong). Yes, H8 reads as "hate". We're fine with it (or at least I don't _hate_ it, I think its F8 so we can make fun jokes (or F1?)).

## Status

Nothing is ordered yet. The H8E10 schematic and board are drawn and
routed; the case is modelled alongside. Before ordering it, a mini test
board, H4E2 (4 keys, 2 encoders, the same display), checks the footprints
and the hall-sensor circuit. v0 will be a single hand-soldered board. See [docs/plan.md](docs/plan.md) for the order of work and
[docs/decisions.md](docs/decisions.md) for why things are the way they are.

## AI-assisted, not AI-generated

I'm building this to learn electronics, and I use an AI assistant (Claude)
while doing it — as a tutor and a second pair of eyes, not as the designer.
It explains things, suggests parts and helps keep these docs in order. The
schematic and layout are drawn by me in KiCad, every part choice is checked
against its datasheet, and the reasoning is written down in
[docs/decisions.md](docs/decisions.md) so that it can be checked by someone
who knows better.

That's also an invitation: I'm new to this, so if something here is wrong
or naive, an issue saying so is very welcome.

## Repository layout

```
docs/           design notes, decisions, BOM, assembly notes
hardware/H8E10/ KiCad 10 project (schematic, PCB)
hardware/H4E2/  KiCad 10 project of the mini test board
hardware/libs/  project-local symbols, footprints, 3D models
firmware/       Arduino (PlatformIO) firmware for the XIAO ESP32S3
case/           case and plate models (FluidCAD): lib/, h8e10/, mini/
```

## Docs

- [docs/plan.md](docs/plan.md) — order of work: board, case and firmware
  tracks
- [docs/decisions.md](docs/decisions.md) — architecture decisions and the
  reasoning behind them
- [docs/bom.md](docs/bom.md) — bill of materials with LCSC numbers and sources
- [docs/pinout.md](docs/pinout.md) — MCU pin budget and bus assignments
- [docs/layout-references.md](docs/layout-references.md) — key/knob spacing
  and 3D-print thickness references behind `case/lib/parts.js`
- [docs/pcb-notes.md](docs/pcb-notes.md) — layout and assembly rules
- [display candidates](hardware/libs/datasheets/display/candidates.md) — the 2.79" bar (chosen, D16) vs. the
  1.54" ([display.md](hardware/libs/datasheets/display/1.54/display.md)) and others, mechanical

## License

Hardware: CERN-OHL-P-2.0 ([LICENSE-HARDWARE.md](LICENSE-HARDWARE.md)).
Firmware: MIT ([LICENSE](LICENSE)).

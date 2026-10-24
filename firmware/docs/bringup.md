# Board bring-up

The order in which a fresh v0 board is checked. Links only: each check
lives in its feature's `checks.md`, and that is where results go.

The order follows the power tree: nothing is driven until the rail under
it is confirmed, and each step only needs the ones before it. Stop at the
first ✗; a later check can't be trusted on top of a failed one.

Firmware: the `xiao` env (USB console) with the bring-up commands
([system](features/system/)). Each step is switched on by hand, not all at
boot.

## 0. Before the first plug-in

No power. Multimeter and eyes.

- [SYS-M1](features/system/checks.md) orientation second look: hall
  sensors and LEDs (pcb-notes, "Hand assembly")
- [SYS-M2](features/system/checks.md) no short `+5V`, `+3V3`, `+3V3A`,
  `+5V_AUX`, `+5V_LED` to GND

## 1. Plug in, rails off

- [SYS-M3](features/system/checks.md) `+5V` at the test point
- [SYS-M4](features/system/checks.md) `+3V3` (XIAO 3V3_OUT)
- [SYS-M5](features/system/checks.md) `+5V_AUX` and `+5V_LED` stay off
- [SYS-M6](features/system/checks.md) XIAO shows up as USB-Serial-JTAG,
  console works

## 2. Switched rails

- [SYS-M7](features/system/checks.md) EN_AUX on: `+5V_AUX`, then `+3V3A`
- [SYS-M8](features/system/checks.md) EN_LED on: `+5V_LED`
- [SYS-M9](features/system/checks.md) reset drops both rails
- [SYS-M10](features/system/checks.md) rails switch off cleanly

## 3. LEDs (C5)

After this the status light works, so later failures can blink.

- [LED-M1 … LED-M4](features/leds/checks.md)

## 4. Display (C6)

- [LCD-M1 … LCD-M4](features/display/checks.md)

## 5. Encoders (C7)

- [ENC-M1 … ENC-M5](features/encoders/checks.md)

## 6. Keys (C8)

On the bare board first (switches held in place by hand or in the plate),
then again in the case.

- [KEY-M1 … KEY-M4, KEY-M6](features/keys/checks.md)

## 7. Power budget

Needs LEDs, display and Wi-Fi working.

- [SYS-M11](features/system/checks.md) USB current in the worst case

## 8. In the case

- [KEY-M5](features/keys/checks.md) key swing again, magnet distance now
  set by the bosses (D24)
- [LED-M5](features/leds/checks.md) light visible through windows and
  cutouts
- [WEB-M1](features/web/checks.md) Wi-Fi signal with the antenna in the
  case

## Later

Checks that need finished features rather than a fresh board:
[midi](features/midi/checks.md), [settings](features/settings/checks.md),
[web](features/web/checks.md).

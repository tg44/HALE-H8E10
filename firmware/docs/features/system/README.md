# System

Status: planned. Milestones: C0, C1, C13.

What everything else stands on: pins, boot order, the switched rails,
reboot modes, recovery, logging, bring-up commands.

## Already decided

- **Pin map** as in [pinout.md](../../../../docs/pinout.md); the firmware
  pin table follows it and changes with it (C0).
- **Rails (D23)**: `+5V_AUX` (display, `+3V3A` for sensors and ADC) on
  EN_AUX = GPIO4, `+5V_LED` (LEDs, level shifter) on EN_LED = GPIO42. Both
  off at boot and reset (10 kΩ pull-downs).
  - Switch a rail on, wait ≥ 10 ms, then set up its chips' pins.
  - Before switching off, make those pins inputs. Driving a pin into an
    unpowered chip feeds it through its protection diodes.
- **Reboot modes** ([usb.md](../../usb.md)): to the bootloader; one boot
  without MIDI (unverified until C1).
- **Recovery boot**: hold ENC1 while plugging in → defaults and Wi-Fi AP,
  stored settings untouched until confirmed
  ([settings](../settings/on-device-menu.md)).
- **Logs**: USB console on the `xiao` env. With USB-MIDI on: CDC next to
  MIDI, logs over Wi-Fi, or UART0 TX on GPIO43 (TX-only, D23).

## Parts (files written when work starts)

- `boot.md` — boot order, rail sequencing, what the status light shows
- `reboot-modes.md` — bootloader, without MIDI, recovery
- `logging.md` — log levels, where logs go in each env
- `bringup-commands.md` — console commands: rails on/off, I2C scan, ADC
  dump, LED walk, display test pattern

## Open questions

- OPEN: GPIO43 has no test pad (pcb-notes: no signal test points). A
  UART log after C13 needs a pad or a wire on the XIAO pin. Add the pad
  while the layout is open? (Track A task in plan.md, A9.)
- OPEN: which log path after C13 (see usb.md).

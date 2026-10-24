# Encoders

Status: planned. Milestone: C7.

Ten Bourns PEC11R detented push encoders (D17): ENC1–5 the back row,
ENC6–10 the front row; ENC1 is the settings encoder (pinout.md).

## Already decided

- Inputs: two MCP23017 on I2C (0x20, 0x21) for 28 inputs, ENC1 and ENC6
  pushes straight on the XIAO (GPIO40, GPIO10), because the expanders'
  bit 7 is output-only (D20). Map: pinout.md, Expander map.
- All active low. MCP23017 internal pull-ups (GPPU) on all 28 inputs,
  ESP32 internal pull-ups on the two pushes.
- Interrupts: INTA of both chips wired-OR to INT_EXP (GPIO41). Set
  IOCON.ODR = 1 and MIRROR = 1 on **both** chips before enabling GPINTEN,
  or the two outputs fight (pinout.md).
- An encoder's A and B are on one port, so one read sees both.
- Gray-code state table decode (D6). 24 detents / 24 pulses, one pulse
  per click (D17).
- Acceleration for sweeps, a fine mode for slow trims, push-to-reset as
  the centre detent (D7). Push with rotation lockout (firmware/README.md).

## Parts (files written when work starts)

- `driver.md` — MCP23017 setup, interrupt handling, reading
- `decode.md` — Gray-code table, steps per detent, direction
- `acceleration.md` — acceleration curve, fine mode
- `push.md` — debounce, long-press (settings), rotation lockout

## Open questions

- OPEN: interrupt-driven only, or also a slow poll as a safety net for a
  missed interrupt.
- OPEN: acceleration curve, fine-mode trigger, long-press time (README
  proposes ~0.7 s).

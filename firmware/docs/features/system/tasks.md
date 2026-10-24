# System tasks

## Now

- [ ] C0: pioarduino project, pinned platform, envs `native` / `xiao` /
      `xiao-usbmidi` (toolchain.md)
- [ ] C0: pin table from pinout.md

## Next

- [ ] C1: USB-MIDI spike on a bare XIAO (usb.md): enumerate, test note,
      back to the bootloader
- [ ] C1: test "reboot without MIDI": does the port stay on
      USB-Serial-JTAG without `USB.begin()`; `Serial` vs `HWCDC` for logs
- [ ] rail on/off helpers with the 10 ms and pins-to-input rules
- [ ] bring-up console commands
- [ ] decide the log path after C13

## Needs the board

- [ ] bring-up steps 0–2 (SYS-M1 … SYS-M10)
- [ ] power budget (SYS-M11)
- [ ] C13: switch to `xiao-usbmidi`

## Done

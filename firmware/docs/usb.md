# USB: console first, MIDI last

## The two USB modes of the ESP32-S3

The S3 has one USB port (the XIAO's USB-C) and two USB peripherals that can
drive it:

- **USB-Serial-JTAG**: built into the chip, works without any firmware
  code. Gives a serial console, auto-reset into the bootloader (esptool
  just works) and JTAG debugging. This is what a fresh chip uses.
- **USB-OTG**: driven by TinyUSB in our firmware. Needed for USB-MIDI. Once
  it starts, it takes over the port, and the three things above stop
  working until the next reset.

So TinyUSB costs the convenient console and flashing. That's why it goes
on last.

## Order

1. **C1, early spike on a bare XIAO** (an hour, then put away): build
   `xiao-usbmidi`, see the XIAO show up as a MIDI device on macOS (and
   Windows if at hand), send one note, then get back into the bootloader
   (BOOT button + plug in) and flash the `xiao` env again. This proves the
   riskiest part, the mode switch and recovering from it, before anything
   depends on it.
2. **Everything else on the `xiao` env**: keys, display, encoders, LEDs,
   settings, web server, OTA, BLE-MIDI. MIDI goes to the log or BLE.
3. **Last step**: add the USB-MIDI output and switch to `xiao-usbmidi`.

## MIDI outputs

All MIDI goes through one interface with interchangeable outputs: log,
BLE, USB. The key engine and the mapping only produce messages; they don't
know where they go. Adding USB at the end is then one more output, not a
rewrite. (Same idea as the `_esp` / `_native` split in
[toolchain.md](toolchain.md).)

## Before switching to `xiao-usbmidi`

- **Updates go over OTA.** OTA has to be solid first. Fallback: BOOT + USB
  (the BOOT button is reachable through the tray, firmware/README.md).
- **Logs need another way out**, one of:
  - a CDC serial port next to MIDI on the same USB (composite device);
  - logs over Wi-Fi (telnet / web page);
  - UART0 TX on GPIO43, which is free on the board (D23). It's TX-only,
    and you need to reach the pin with a wire or a test pad.
- **Expected work, about a day**: device name and descriptors, enumeration
  on macOS and Windows, and not blocking or overflowing when the port is
  open but nothing on the computer reads MIDI.

## Menu options for the system page

Both avoid opening the case to flash.

- **Reboot to bootloader**: already planned. Sets the force-download flag
  and restarts into the ROM bootloader on USB-Serial-JTAG, ready for
  esptool.
- **Reboot without MIDI** (one boot only): sets a flag that survives a
  reset (RTC memory or NVS) and restarts. At boot the firmware checks the
  flag, clears it and skips starting TinyUSB, so the port stays on
  USB-Serial-JTAG: console and normal `pio run -t upload` work. The next
  reset is a normal MIDI boot again, so the board can't get stuck in
  that mode.

  Unverified, test it in the C1 spike: that the port really stays on
  USB-Serial-JTAG when the `xiao-usbmidi` build doesn't call
  `USB.begin()`, and whether `Serial` (which means USB CDC in that build)
  needs to be swapped for the `HWCDC` object to get logs.

# Display

Status: planned. Milestone: C6.

The 2.79" 428 × 142 NV3007 bar above the keys (D16).

## Already decided

- Driver: Arduino_GFX `Arduino_NV3007` (D16, D25). Not in TFT_eSPI or
  LovyanGFX. Fallback: the community esp_lcd component.
- SPI B on SPI2's IO-MUX pins: SCK GPIO12, MOSI GPIO11, DC GPIO13, CS
  GPIO2, RST GPIO39 (pinout.md). Write clock up to 80 MHz (datasheet
  allows ≤ 100 MHz).
- Powered from `+5V_AUX` (D23): rail on, wait ≥ 10 ms, then init. LCD_CS
  has no pull-up, so keep the pins inputs while the rail is off.
- Backlight: PWM (LEDC) on GPIO38 through the module's NPN; dim after
  idle, blank after minutes (firmware/README.md).
- The image is rotated 180° from the module drawing (pcb-notes, Display).
- Width per key column ≈ 107 px (D16) for key labels.
- Shows status and connection details once it's up (D22); the settings
  menu draws here.

## Parts (files written when work starts)

- `driver.md` — init, rotation, power cycle with `+5V_AUX`
- `screens.md` — play screen (key labels, encoder values), status, the
  settings menu; screens rendered to images in `native`
- `backlight.md` — PWM, dim and blank timing

## Open questions

- OPEN: how screens are drawn so they also render on the computer (own
  canvas over Arduino_GFX, or Arduino_GFX's canvas class).
- OPEN: dim and blank timings, backlight levels.

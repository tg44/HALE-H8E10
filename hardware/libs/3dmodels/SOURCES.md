# 3D model sources

All files verified to start with `ISO-10303-21` (STEP). Units: mm in all files.
Bounding boxes measured with OpenCascade (exact shape bounds).

| File | Part | Exact? | Source | License |
|---|---|---|---|---|
| `seeed-xiao-esp32s3-plus.step` | Seeed XIAO ESP32S3 Plus | Exact board variant (KiCad assembly export, 34 sub-parts; the origin is unclear: the author exported it from KiCad, probably from Seeed's own Plus PCB). Check the back-side half-pitch pads before relying on it | https://github.com/Lambosaurus/KicadLib/blob/master/Step/assembly/XIAO_ESP32S3_Plus.step (Git LFS) | Repo: MIT. The model may come from Seeed's design files, so Seeed's terms may apply |
| `gateron-ks-20.step` | Gateron KS-20 magnetic switch (Magnetic Jade) | Exact. The internal file name is `KS-20TF10B045NW-Y89 FB3D 20240921.stp`, which looks like a Gateron factory model | https://github.com/Fefe-Nayz/kbhe-monorepo/blob/main/hardware/pcb/75he/Library/3D/75HE/Gateron%20Magnetic%20Jade%20Switch.stp (Git LFS) | No repo license stated. Probably Gateron's own model, redistributed |
| `bourns-pec11r.step` / `.wrl` | Bourns PEC11R-4215F-S0024 (LCSC C143790) | LCSC/EasyEDA model for that LCSC part (name `SW-TH_5P-L12.5-W13.4-P2.50-LS14.5`). It is EasyEDA-drawn, not a Bourns CAD file, so check it against the datasheet | `uvx easyeda2kicad --3d --lcsc_id C143790` (easyeda2kicad v1.0.1) | EasyEDA/LCSC library terms |
| `alps-ec11e-switch-vertical-h20mm.step` | Alps EC11E with switch, vertical, 20 mm shaft | Stand-in. KiCad's footprint `RotaryEncoder_Alps_EC11E-Switch_Vertical_H20mm` names this model, but the official kicad-packages3D has no `Rotary_Encoder.3dshapes`. This file is a third-party model ("Rotary Encoder.step", made in Autodesk in 2019), renamed to the KiCad name | https://github.com/newdigate/teensy-eurorack/blob/master/hardware/boards/3d/RotaryEncoder_Alps_EC11E-Switch_Vertical_H20mm.step | Repo: MIT |
| `display-1.54-st7789.step` | 1.54" 240×240 ST7789 module ("1.54TFT-SPI-ST7789 Ver:1.1") | Drawn in this repo: exported from `case/ref/display-154.part.js` (FluidCAD). Outline from the seller drawing, details from the product photo; male header dimensions typical. Re-export after changing the part file | this repo | this repo |
| `display-2.79-nv3007.step` | 2.79" 428×142 NV3007 bar module (TZT / ShengYang "2.79TFT-SPI", D16) | Drawn in this repo: exported from `case/ref/display-279.part.js` (FluidCAD) with its defaults (header and back-side parts on, keep-out block off). Outline from the seller drawing in `datasheets/display/2.79/`; back-side parts placed from the photos (±1 mm), header dimensions typical. Not checked against a module in hand. Re-export after changing the part file | this repo | this repo |

## Bounding boxes (mm)

- XIAO ESP32S3 Plus: 22.65 x 17.79 x 4.44. X[-8.83,13.81] Y[-0.22,4.22] Z[-15.02,2.77]. **Y is up**, board in the XZ plane; 22.65 includes the USB-C overhang.
- Gateron KS-20: 16.17 x 15.18 x 17.99. X[170.26,186.44] Y[-9.89,5.29] Z[13.28,31.28]. **Far off the origin**: it needs an offset in KiCad/FluidCAD.
- Bourns PEC11R: 13.36 x 14.70 x 25.20. Z[-9.20,16.00], Z up, pins below 0.
- Alps EC11E: 14.80 x 29.70 x 12.00. Y[-3.20,26.50], **Y is the shaft axis**, and the origin is at a corner/pin, not at the shaft.
- Display 1.54": 32.0 x 43.7 x 12.04 with header (z −8.5 … +3.54). Origin at the module PCB centre, z = 0 on the PCB back face, +Z towards the viewer. Without header: z −1.5 … +3.54.
- Display 2.79": 25.9 x 78.0 x 11.92 with header (z −8.5 … +3.42), from the STEP vertices rather than OpenCascade. Same axes as the 1.54": origin at the module PCB centre, z = 0 on the PCB back face, +Z towards the viewer, +Y towards the header edge (portrait; rotate 90° about Z for the landscape bar). Without header: z −2.5 … +3.42 (FPC socket).

# Encoder checks

Run order: [bringup.md](../../bringup.md). Needs SYS-M6 (expanders are on
`+3V3`, always on, D21).

| ID | Check | How | Expected (source) | Board | Result | Date |
|---|---|---|---|---|---|---|
| ENC-M1 | I2C scan | console command | 0x20 and 0x21 answer (pinout.md) | | | |
| ENC-M2 | Rotation, every encoder | turn each one click CW, one CCW, log | ±1 per click, CW positive, right encoder number (D17, pinout.md map) | | | |
| ENC-M3 | Push, every encoder | press each, log | right number, incl. ENC1 (GPIO40) and ENC6 (GPIO10) (D20) | | | |
| ENC-M4 | Interrupt | log INT_EXP edges while turning encoders on each chip | fires for both chips, released after the read (pinout.md) | | | |
| ENC-M5 | Fast spin | spin each fast for 10 full turns and back | net count returns to 0, no missed steps | | | |

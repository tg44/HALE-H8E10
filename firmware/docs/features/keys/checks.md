# Key checks

Run order: [bringup.md](../../bringup.md). Needs SYS-M7.

| ID | Check | How | Expected (source) | Board | Result | Date |
|---|---|---|---|---|---|---|
| KEY-M1 | ADC answers, rest values | raw dump, no keys pressed | every channel near mid-scale, ~2048 (DRV5055 rests at VCC/2, D15) | | | |
| KEY-M2 | Channel map | press keys 1 → 8 one at a time | key n moves the channel in pinout.md (CH4–7 = key8–5) | | | |
| KEY-M3 | Swing per key | slow full press, log rest and bottom-out | clear swing, sign either way (D15); not pinned near 0–250 or 3850–4095 (clipping, D14/D15). Record values | | | |
| KEY-M4 | Noise at rest | 10 s of samples per channel | OPEN: target p-p noise; record it | | | |
| KEY-M5 | Swing in the case | KEY-M3 again with the case screwed together | record; compare with KEY-M3 (bosses set the distance, D24) | | | |
| KEY-M6 | Crosstalk | press each key fully, watch its neighbours | neighbours move much less than the pressed key; record it | | | |

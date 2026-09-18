# South Carolina (not shipped)

South Carolina was removed from the app in September 2026 because its 2022 data
could not be verified against primary sources (see `../../data/VERIFICATION.md`).
Everything needed to bring it back is kept here:

| File | What it was |
| --- | --- |
| `South Carolina.csv` | Source rows, previously `data/South Carolina.csv` |
| `build-south-carolina.mjs` | The parser previously inline in `scripts/build-data.mjs`; its header comment explains re-enabling |
| `cases.mjs` | Table-driven test rows previously in `scripts/cases.mjs` |
| `test.mjs` | Hand-written tests previously in `scripts/test.mjs` |
| `review-notes.json` | Per-county cautions previously in `data/review-notes.json` |

Nothing in this folder is loaded by the app, the build script, or CI.

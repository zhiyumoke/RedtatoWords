# RedtatoWords

**RedtatoWords** is a dedicated candidate‑word harvesting tool for desktop.

> This repository is the **release & distribution channel only**.
> The source code lives in a separate private repository — nothing here is source.

---

## What it does

RedtatoWords helps you collect **candidate words** (long‑tail keyword suggestions)
from a search box, round after round, and turn them into a working keyword set.

- **Candidate list** — collects suggestions through two independent channels and
  merges them, so a single round yields a stable, de‑duplicated list.
- **TAG cloud** — automatically segments every candidate, de‑duplicates the parts
  and ranks them by frequency. Multi‑select several tags to expand the next round.
- **Multi‑round expansion** — each round is recorded on a timeline. Go back to any
  earlier round at any time; nothing is lost.
- **Batch mode** — feed several search terms at once and merge all results into one list.
- **Export** — copy everything, or export to TXT / CSV / Excel / JSON.
- **100% local** — all data stays on your machine. No account, no telemetry, no cloud.

## Download

Grab the latest build from the [**Releases**](../../releases/latest) page.

| Platform | Package |
| --- | --- |
| Windows 10 / 11 (x64) | `redtato-words-<version>-win-x64.exe` (installer) or `.zip` (portable) |
| macOS (Apple Silicon / Intel) | `redtato-words-<version>-mac-universal.dmg` or `.zip` |

### Notes

- The Windows installer is currently **unsigned**, so SmartScreen may show a
  "Windows protected your PC" prompt. Choose **More info → Run anyway**.
- The macOS build is **ad-hoc signed** but not notarised. On first launch,
  right‑click the app and choose **Open**, or allow it under
  *System Settings → Privacy & Security*.
- Updates can be checked from inside the app (*Settings → Check for updates*);
  it also checks quietly on startup and only speaks up when a new version exists.

## License

Released for personal use. No warranty of any kind.

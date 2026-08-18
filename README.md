# Broadcast Clock

Single-page HTML/CSS/JS clock: HH:MM:SS rendered in a monospace font, an
inner ring of 60 dots that fills up second by second and resets at the top
of the minute, and an outer ring of 12 always-on dots marking the hour
positions for orientation. Light/dark theme follows the OS by default.

No build step, no dependencies. Open `index.html` directly in a browser,
or serve it locally:

```bash
python3 -m http.server 8934
```

## Files

- `index.html` — structure (rings, time text), `data-format`/`data-theme`
  attributes on `<html>` for the switches below
- `style.css` — colors, sizing, and the switches. All sizing derives from
  a single `--u` unit (1% of the rendered clock size, set in JS) plus a
  handful of tunable CSS variables (`--dot-size-ring`, `--ring-hours-radius`,
  `--ring-seconds-radius`, `--letter-spacing`, `--font-size`, `--c` for hue)
- `clock.js` — ring generation and the per-second update loop

### Switches (no JS change needed)

- **Time format**: set `data-format="hhmm"` on `<html>` in `index.html` to
  hide seconds (they're still computed in the background, just not shown).
- **Theme**: follows `prefers-color-scheme` by default; set
  `data-theme="light"` or `data-theme="dark"` on `<html>` to force one.

## Embedding elsewhere

`build-embed.sh` bundles the three source files into a single
self-contained `embed.html` (inline CSS/JS, no external requests) meant
for `<iframe srcdoc="...">` embedding in other projects — e.g. as a
feature/easter-egg in `boatcam-dashboard` or `backhaul-antenna-mapper-dev`.

```bash
./build-embed.sh
```

`embed.html` is a generated build artifact and is gitignored — regenerate
it fresh whenever you need a copy to hand off.

## macOS app

`electron/` wraps the same clock in a native window via Electron (a
learning exercise — not code-signed/notarized, unsigned local builds
only). It uses its own copy of `index.html`/`style.css`/`clock.js` under
`electron/web/`; re-copy those three files there after changing the core
clock.

```bash
cd electron
npm install
npm start        # run in dev
npm run dist      # build an unsigned .app/.dmg into electron/dist/
```

# marconiccolini.com

Portfolio of Marco Niccolini, designer and engineer, CEO and founder of Semantics.
Concept: **a console**. A terminal crossed with a handheld, rebuilt for today: flat colour screens,
hairlines, a list with one moving selection, photographs redrawn with ordered dithering.
Complex work, clear systems.

## Stack

- Vite, TypeScript, no UI framework, no animation library: WAAPI, CSS and a canvas.
- Static multi-page output, deployed as Cloudflare Workers static assets (`wrangler.jsonc`).
- Two typefaces, both self-hosted through Fontsource: Pixelify Sans (display, a crisp variable pixel font) and Geist Mono (text).

## Commands

```bash
pnpm dev          # generates the case pages, then starts Vite
pnpm build        # case pages, type check, production build into dist/
pnpm preview      # serves dist/ on the local network, for testing on a phone
pnpm lint
```

## How it works

- The home is one page with six screens (menu, work, semantics, about, contact, settings),
  routed by the URL hash. The screens are plain HTML generated at build time from
  `src/content.ts`, so everything is crawlable before any script runs.
- The case pages are separate static pages, so every case keeps its own URL.
- Photographs are cropped to their box, reduced to luminance and thresholded against an 8x8 Bayer
  matrix on a canvas. The luminance is cached, so switching theme repaints without decoding
  anything again. Each frame is a threshold pass, so the picture is alive: it compiles in dot by dot
  when it appears, and a pool of light follows the pointer (`src/core/dither.ts`). Six themes: Cobalt (default) and Mono are 1-bit, Lime uses three shades, DMG,
  Amber and Phosphor four. A theme declares its palette with `--s0`…`--s3` and `--shades`.
- Keyboard: arrows or `J`/`K` move, `→`/`Enter` opens, `←`/`Esc` goes back, `1`–`9` jump, `T` theme,
  `M` sound. On a case page: `P`/`N` previous and next, `O` toggles the original photograph.
- Preferences (theme, scanlines, sound) live in `localStorage`; sound and scanlines are off by default.

## Where things live

| Path | What |
|---|---|
| `index.html` | The home shell, meta and structured data. Markers are filled by `src/markup.ts` |
| `src/markup.ts` | Build-time markup shared by the home and the case pages |
| `src/home.ts`, `src/case.ts` | Entry points: menu, router and keys; case page behaviour |
| `src/core/` | Shell, themes, dithering, page wipe, typewriter, sound |
| `src/style.css` | Palettes, layout and every component |
| `src/content.ts` | Which projects are shown and their cover |
| `src/data/projects.ts` | Project copy |
| `scripts/build-cases.ts` | Generates `work/<slug>/index.html` (not committed) |
| `public/media/` | Optimised images (AVIF + JPEG, 800 and 1448 wide) |
| `public/_redirects` | 301s from the previous site's `/projects/*` URLs |

## Adding a case

1. Write the project in `src/data/projects.ts`.
2. Add it to `CURATED` in `src/content.ts` with its media name and focal point.
3. Export the cover into `public/media/<name>-800|1448.(avif|jpg)`.
4. Add the URL to `public/sitemap.xml`.

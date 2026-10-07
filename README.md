# marconiccolini.com

Portfolio of Marco Niccolini, designer and engineer, founder of Semantics.
Concept: **Tracciato** — complex work, clear systems. A coiled rope that is pulled straight
and opens into clear parallel lanes.

## Stack

- Vite, TypeScript, no UI framework: every animation runs through GSAP or WebGL.
- Plain WebGL2 for the rope (one program, one draw call, no engine), loaded lazily after first paint.
- GSAP (ScrollTrigger, SplitText) and Lenis, all on one ticker.
- Static multi-page output, deployed as Cloudflare Workers static assets (`wrangler.jsonc`).

## Commands

```bash
pnpm dev          # generates the case pages, then starts Vite
pnpm build        # case pages, type check, production build into dist/
pnpm preview      # serves dist/ on the local network, for testing on a phone
pnpm check:rope   # proves the rope never passes through itself
pnpm lint
```

## Where things live

| Path | What |
|---|---|
| `index.html` | The home page markup, meta and structured data |
| `src/home.ts`, `src/case.ts` | Entry points for the home and the case pages |
| `src/core/` | Shared runtime: scroll, themes, navigation, reveals, page transitions |
| `src/stage/` | The WebGL rope. `rope-path.ts` is the pure geometry, `cable.ts` the shader |
| `src/content.ts` | Which projects are shown, their colours and images |
| `src/data/projects.ts` | Project copy |
| `scripts/build-cases.ts` | Generates `work/<slug>/index.html` (not committed) |
| `public/media/` | Optimised images (AVIF + JPEG, 800 and 1448 wide) |
| `source-media/` | High-resolution originals, not deployed |
| `public/_redirects` | 301s from the previous site's `/projects/*` URLs |

## Adding a case

1. Write the project in `src/data/projects.ts`.
2. Add it to `CURATED` in `src/content.ts` with its colour, ink and media name.
3. Export the cover into `public/media/<name>-800|1448.(avif|jpg)`.
4. Add the URL to `public/sitemap.xml`.

## Easter egg

Press **B** for blueprint mode: the page shows its grid and component names.

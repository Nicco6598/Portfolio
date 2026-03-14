# Developer Portfolio

A personal developer portfolio built with Vite, React, TypeScript, and Tailwind CSS v4.

## Tech Stack

- **Framework:** Vite + React (TypeScript)
- **Styling:** Tailwind CSS v4
- **Animations:** Framer Motion, GSAP
- **3D:** @splinetool/react-spline
- **Routing:** React Router v7 (hash routing)
- **Fonts:** Instrument Serif + DM Mono

## Setup

```bash
cd portfolio
npm install
npm run dev
```

The dev server will start at `http://localhost:5173`

## Build for Production

```bash
npm run build
npm run preview
```

## CUSTOMIZATION

### Personal Information

| File | What to change |
|------|----------------|
| `src/components/Navbar.tsx` | `SITE_NAME` constant (line 6) |
| `src/components/Hero.tsx` | `DEVELOPER_NAME` and `TAGLINE` constants |
| `src/components/Contact.tsx` | `EMAIL`, `GITHUB_URL`, `LINKEDIN_URL` |

### Projects

Edit `src/data/projects.ts` to add your own projects. Each project object follows this interface:

```typescript
interface Project {
  id: string;
  index: string;        // "01", "02" etc.
  name: string;
  tagline: string;
  role: string;
  date: string;
  tags: string[];       // ["iOS", "SwiftUI", "Full-Stack"]
  description: string;
  imageUrl?: string;
  liveUrl?: string;
  githubUrl?: string;
}
```

### 3D Loader Scene

In `src/components/Loader.tsx`, update the `SPLINE_URL` constant:

```typescript
const SPLINE_URL = "https://your-spline-scene-url.splinecode";
```

### Ticker Text

In `src/components/Ticker.tsx`, update the `TICKER_ITEMS` array:

```typescript
const TICKER_ITEMS = [
  "Milan, Italy",
  "Open to work",
  "Your Title",
  // ... more items
];
```

### Colors & Theme

All colors are defined as CSS variables in `src/styles/globals.css`. The theme system supports both light and dark modes:

**Light theme (default):**
- Background: `#F5F5F0`
- Surface: `#EDEDEA`
- Text Primary: `#0A0A0A`
- Accent: `#FF4D00`

**Dark theme:**
- Background: `#0C0C0C`
- Surface: `#161616`
- Text Primary: `#F0EEE8`
- Accent: `#FF4D00`

To change the accent color, update `--color-accent` and `--color-accent-hover` in both `:root` and `[data-theme="dark"]` selectors.

### About Section

Edit text and skills in `src/components/About.tsx`:
- `ABOUT_TEXT` constant
- `SKILLS` array

## Features

- Full-screen 3D loader with GSAP counter animation
- Theme toggle (light/dark)
- Responsive design (mobile + desktop)
- Smooth scroll navigation
- Animated project sheet (bottom sheet)
- Ticker marquee
- Accessible (ARIA labels, keyboard navigation)

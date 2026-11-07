import { read, write } from './store';

/**
 * Screens, each a handful of shades. The colours live in CSS (`--s0` darkest to `--s3` lightest);
 * JS only picks which set is on and reads it back for the dithering. `--shades` says how many of
 * them a photograph may use: two for the cobalt print look, three for the green halftone, four for the rest.
 */
export const THEMES = ['cobalt', 'mono', 'lime', 'dmg', 'amber', 'phosphor'] as const;
export type Theme = (typeof THEMES)[number];

export const THEME_LABEL: Record<Theme, string> = {
  cobalt: 'Cobalt',
  mono: 'Mono',
  lime: 'Lime',
  dmg: 'DMG',
  amber: 'Amber',
  phosphor: 'Phosphor',
};

const THEME_KEY = 'nicco:theme:v2';
const FX_KEY = 'nicco:fx:v2';
const root = document.documentElement;

const isTheme = (value: string | null | undefined): value is Theme => THEMES.includes(value as Theme);

export const currentTheme = (): Theme => {
  const value = root.dataset.theme;
  return isTheme(value) ? value : 'cobalt';
};

export function setTheme(theme: Theme) {
  root.dataset.theme = theme;
  write(THEME_KEY, theme);
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', getComputedStyle(root).getPropertyValue('--bg').trim());
  window.dispatchEvent(new CustomEvent('themechange'));
}

export function cycleTheme(step = 1) {
  const next = (THEMES.indexOf(currentTheme()) + step + THEMES.length) % THEMES.length;
  setTheme(THEMES[next]);
}

const toRgb = (hex: string): [number, number, number] => {
  const clean = hex.trim().replace('#', '');
  const value = parseInt(clean.length === 3 ? [...clean].map((c) => c + c).join('') : clean, 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
};

/** The shades a photograph may use on the current screen, darkest first, as [r, g, b]. */
export function shades(): Array<[number, number, number]> {
  const style = getComputedStyle(root);
  const all = [0, 1, 2, 3].map((i) => toRgb(style.getPropertyValue(`--s${i}`)));
  const count = Number(style.getPropertyValue('--shades')) || 4;
  if (count === 2) return [all[0], all[3]];
  if (count === 3) return [all[0], all[1], all[3]];
  return all;
}

export const scanlinesOn = () => root.dataset.fx === 'on';

export function setScanlines(on: boolean) {
  root.dataset.fx = on ? 'on' : 'off';
  write(FX_KEY, on ? 'on' : 'off');
  window.dispatchEvent(new CustomEvent('fxchange'));
}

/** Restores the saved theme. The inline script in <head> already did, before first paint. */
export function initTheme() {
  const saved = read(THEME_KEY);
  if (isTheme(saved) && root.dataset.theme !== saved) root.dataset.theme = saved;
  root.dataset.fx = read(FX_KEY) === 'on' ? 'on' : 'off';
}

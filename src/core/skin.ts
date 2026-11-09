import { read, write } from './store';
import { setTheme } from './theme';
import type { Theme } from './theme';

/**
 * Skins change the hardware, not the palette: type, corners, frames and how photographs are drawn.
 * They are pure CSS on `html[data-skin]`, so switching costs one attribute and one repaint of what is on screen.
 */
export const SKINS = ['handheld', 'terminal', 'studio'] as const;
export type Skin = (typeof SKINS)[number];

export const SKIN_LABEL: Record<Skin, string> = { handheld: 'Handheld', terminal: 'Terminal', studio: 'Studio' };

/** The screen each skin looks best on; picking a skin sets it, the theme can still be changed after. */
const SKIN_THEME: Record<Skin, Theme> = { handheld: 'cobalt', terminal: 'phosphor', studio: 'mono' };

const SKIN_KEY = 'nicco:skin';
const root = document.documentElement;

const isSkin = (value: string | null | undefined): value is Skin => SKINS.includes(value as Skin);

export const currentSkin = (): Skin => {
  const value = root.dataset.skin;
  return isSkin(value) ? value : 'handheld';
};

export function setSkin(skin: Skin) {
  if (skin === currentSkin()) return;
  root.dataset.skin = skin;
  write(SKIN_KEY, skin);
  window.dispatchEvent(new CustomEvent('skinchange'));
  setTheme(SKIN_THEME[skin]);
}

export function cycleSkin(step = 1) {
  setSkin(SKINS[(SKINS.indexOf(currentSkin()) + step + SKINS.length) % SKINS.length]);
}

/** Restores the saved skin. The inline script in <head> already did, before first paint. */
export function initSkin() {
  const saved = read(SKIN_KEY);
  if (isSkin(saved) && root.dataset.skin !== saved) root.dataset.skin = saved;
  else if (!root.dataset.skin) root.dataset.skin = 'handheld';
}

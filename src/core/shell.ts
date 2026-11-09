import '@fontsource-variable/geist';
import '@fontsource-variable/geist-mono';
import '@fontsource-variable/pixelify-sans';
import './dither';
import { sfx, setSound, soundOn } from './sound';
import { SKINS, SKIN_LABEL, currentSkin, cycleSkin, initSkin, setSkin } from './skin';
import type { Skin } from './skin';
import { THEME_LABEL, THEMES, currentTheme, cycleTheme, initTheme, scanlinesOn, setScanlines, setTheme } from './theme';
import type { Theme } from './theme';
import { setupWipe } from './wipe';

export const isTyping = (target: EventTarget | null) =>
  target instanceof HTMLElement && !!target.closest('input, textarea, select, [contenteditable]');

export const hasModifier = (event: KeyboardEvent) => event.metaKey || event.ctrlKey || event.altKey;

export function toggleTheme() {
  cycleTheme();
  sfx.toggle();
}

export function toggleSkin() {
  cycleSkin();
  sfx.toggle();
}

export function toggleSound() {
  setSound(!soundOn());
}

export function toggleScanlines() {
  setScanlines(!scanlinesOn());
  sfx.toggle();
}

/** What both kinds of page share: the saved theme, the status bar, global keys and the page wipe. */
export function createShell() {
  initSkin();
  initTheme();
  setupWipe();

  const labels = () => {
    const text: Record<string, string> = {
      skin: SKIN_LABEL[currentSkin()],
      theme: THEME_LABEL[currentTheme()],
      sound: soundOn() ? 'On' : 'Off',
      fx: scanlinesOn() ? 'On' : 'Off',
    };
    document.querySelectorAll<HTMLElement>('[data-label]').forEach((el) => {
      el.textContent = text[el.dataset.label!] ?? '';
    });
    document.querySelectorAll<HTMLElement>('[data-theme-set]').forEach((el) => {
      el.setAttribute('aria-pressed', String(el.dataset.themeSet === currentTheme()));
    });
    document.querySelectorAll<HTMLElement>('[data-skin-set]').forEach((el) => {
      el.setAttribute('aria-pressed', String(el.dataset.skinSet === currentSkin()));
    });
    document.querySelector('[data-act="sound"]')?.setAttribute('aria-pressed', String(soundOn()));
  };
  labels();
  for (const type of ['skinchange', 'themechange', 'soundchange', 'fxchange']) window.addEventListener(type, labels);

  // Milan time, to the minute.
  const clocks = document.querySelectorAll<HTMLTimeElement>('[data-clock]');
  if (clocks.length) {
    const format = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Rome', hour: '2-digit', minute: '2-digit' });
    const tick = () => {
      const time = format.format(new Date());
      clocks.forEach((clock) => {
        clock.textContent = time;
      });
    };
    tick();
    setInterval(tick, 15_000);
  }

  document.querySelectorAll('[data-year]').forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });

  document.addEventListener('click', (event) => {
    const target = event.target as Element;
    const act = target.closest<HTMLElement>('[data-act]')?.dataset.act;
    if (act === 'skin') toggleSkin();
    if (act === 'theme') toggleTheme();
    if (act === 'sound') toggleSound();

    const skin = target.closest<HTMLElement>('[data-skin-set]');
    if (skin && SKINS.includes(skin.dataset.skinSet as Skin)) {
      setSkin(skin.dataset.skinSet as Skin);
      sfx.toggle();
    }

    const swatch = target.closest<HTMLElement>('[data-theme-set]');
    if (swatch && THEMES.includes(swatch.dataset.themeSet as Theme)) {
      setTheme(swatch.dataset.themeSet as Theme);
      sfx.toggle();
    }
  });

  window.addEventListener('keydown', (event) => {
    if (hasModifier(event) || isTyping(event.target)) return;
    const key = event.key.toLowerCase();
    if (key === 't') toggleTheme();
    else if (key === 's') toggleSkin();
    else if (key === 'm') toggleSound();
  });
}

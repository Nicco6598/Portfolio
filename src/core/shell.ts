import '@fontsource-variable/geist-mono';
import '@fontsource-variable/bitcount-prop-single/full.css';
import './dither';
import { sfx, setSound, soundOn } from './sound';
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

export function toggleSound() {
  setSound(!soundOn());
}

export function toggleScanlines() {
  setScanlines(!scanlinesOn());
  sfx.toggle();
}

/** What both kinds of page share: the saved theme, the status bar, global keys and the page wipe. */
export function createShell() {
  initTheme();
  setupWipe();

  const labels = () => {
    const text: Record<string, string> = {
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
    document.querySelector('[data-act="sound"]')?.setAttribute('aria-pressed', String(soundOn()));
  };
  labels();
  for (const type of ['themechange', 'soundchange', 'fxchange']) window.addEventListener(type, labels);

  // Milan time, to the minute.
  const clock = document.querySelector<HTMLTimeElement>('[data-clock]');
  if (clock) {
    const format = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Rome', hour: '2-digit', minute: '2-digit' });
    const tick = () => {
      clock.textContent = format.format(new Date());
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
    if (act === 'theme') toggleTheme();
    if (act === 'sound') toggleSound();

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
    else if (key === 'm') toggleSound();
  });
}

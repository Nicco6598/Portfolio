import '@fontsource-variable/host-grotesk';
import '@fontsource-variable/geist-mono';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';
import { setupTransitions } from './transition';
import { setupReveals } from './reveal';
import { setupCursor } from './cursor';
import { setupNav } from './nav';

gsap.registerPlugin(ScrollTrigger, SplitText);

export const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
export const params = new URLSearchParams(location.search);

export interface AppOptions {
  onBlueprint?: (on: boolean) => void;
}

export function createApp({ onBlueprint }: AppOptions = {}) {
  const root = document.documentElement;

  // One clock for everything: Lenis, ScrollTrigger and WebGL all tick on gsap.ticker.
  const lenis = new Lenis({ lerp: 0.12, anchors: true, autoRaf: false });
  // No lenis.on('scroll', ScrollTrigger.update) here: Lenis scrolls the window natively,
  // so ScrollTrigger already updates from the scroll event. Wiring both ran every trigger twice a frame.
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  const nav = setupNav(lenis);

  // Masthead steps aside while reading down, returns the moment you scroll up.
  const masthead = document.querySelector<HTMLElement>('.masthead');
  lenis.on('scroll', ({ scroll, direction }: Lenis) => {
    const away = direction === 1 && scroll > innerHeight * 0.6 && !nav?.isOpen();
    masthead?.classList.toggle('masthead--away', away);
  });

  // Footer: the year, and the time in Milan.
  const clock = document.querySelector<HTMLTimeElement>('[data-clock]');
  if (clock) {
    const milanTime = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Rome', hour: '2-digit', minute: '2-digit' });
    const tick = () => {
      clock.textContent = milanTime.format(new Date());
    };
    tick();
    setInterval(tick, 15_000);
  }

  document.querySelectorAll('[data-year]').forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });

  // Blueprint mode: the site shows how it is built.
  const toggleBlueprint = () => {
    const on = root.classList.toggle('blueprint');
    onBlueprint?.(on);
  };
  window.addEventListener('keydown', (event) => {
    const target = event.target as HTMLElement;
    if (event.key.toLowerCase() !== 'b' || event.metaKey || event.ctrlKey || event.altKey) return;
    if (target.closest('input, textarea, [contenteditable]')) return;
    toggleBlueprint();
  });

  // Buttons roll their label on hover: the text is doubled once here, the motion is CSS.
  document.querySelectorAll<HTMLElement>('.button').forEach((button) => {
    const label = button.textContent?.trim() ?? '';
    button.setAttribute('aria-label', label);
    button.innerHTML = `<span class="button__roll" data-label="${label.replace(/"/g, '&quot;')}" aria-hidden="true">${label}</span>`;
  });

  setupTransitions(lenis);
  setupReveals();
  setupCursor();

  // Layout settles once fonts land; arriving with a hash, jump straight to it.
  void document.fonts.ready.then(() => {
    ScrollTrigger.refresh();
    if (location.hash) lenis.scrollTo(location.hash, { immediate: true, force: true });
  });

  return { lenis };
}

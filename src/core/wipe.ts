import { reducedMotion } from './store';

const KEY = 'nicco:wipe';
const STEP = 28;
const DURATION = 170;

/**
 * Page changes close like a venetian blind, in steps. The bars are in the HTML, so an
 * arriving page can start covered (the inline script in <head> sets `data-wipe`) and open.
 */
export function setupWipe() {
  const root = document.documentElement;
  const bars = [...document.querySelectorAll<HTMLElement>('.wipe i')];
  if (!bars.length) return;

  const open = () =>
    bars.forEach((bar, i) => {
      bar.style.transformOrigin = 'bottom';
      // `both`: while a bar waits for its turn it keeps covering, even once the attribute is gone.
      bar.animate([{ transform: 'scaleY(1)' }, { transform: 'scaleY(0)' }], {
        duration: DURATION,
        delay: i * STEP,
        easing: 'steps(5, end)',
        fill: 'both',
      });
    });

  if (root.hasAttribute('data-wipe')) {
    open();
    // The bars now hold their own final state; the attribute that covered them can go.
    window.setTimeout(() => root.removeAttribute('data-wipe'), 0);
  }

  document.addEventListener('click', (event) => {
    const link = (event.target as Element).closest<HTMLAnchorElement>('a[href]');
    if (!link || event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (link.target === '_blank' || link.hasAttribute('download')) return;

    const url = new URL(link.href);
    if (url.origin !== location.origin || url.pathname === location.pathname) return;
    if (/\.(pdf|jpe?g|png|avif)$/i.test(url.pathname)) return;

    event.preventDefault();
    navigate(link.href);
  });

  // Back from the history cache: the page must not stay covered.
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) bars.forEach((bar) => bar.getAnimations().forEach((animation) => animation.cancel()));
  });
}

/** Closes the blind, then loads `href`. */
export function navigate(href: string) {
  const bars = [...document.querySelectorAll<HTMLElement>('.wipe i')];
  try {
    sessionStorage.setItem(KEY, '1');
  } catch {
    // Without storage the next page simply appears without the opening.
  }

  if (reducedMotion || !bars.length) {
    location.href = href;
    return;
  }

  bars.forEach((bar, i) => {
    bar.style.transformOrigin = 'top';
    const animation = bar.animate([{ transform: 'scaleY(0)' }, { transform: 'scaleY(1)' }], {
      duration: DURATION,
      delay: i * STEP,
      easing: 'steps(5, end)',
      fill: 'forwards',
    });
    if (i === bars.length - 1) animation.finished.then(() => (location.href = href));
  });
}

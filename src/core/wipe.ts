import { reducedMotion } from './store';

const KEY = 'nicco:wipe';
const BARS = 8;
const STEP = 28;
const DURATION = 170;
/** Last bar's delay plus its own run, the moment a wipe is over. */
const TOTAL = (BARS - 1) * STEP + DURATION;

const root = document.documentElement;
let release = 0;

/** The blind is only in the layout while `data-wipe` is set: whatever happens, it cannot stay stuck on screen. */
function clear() {
  window.clearTimeout(release);
  root.removeAttribute('data-wipe');
}

/**
 * Page changes close like a venetian blind, in steps. The bars are in the HTML, so an
 * arriving page can start covered (the inline script in <head> sets `data-wipe`) and open.
 * The motion is CSS (`data-wipe="open|close"`); this only starts it and cleans up after it.
 */
export function setupWipe() {
  if (!document.querySelector('.wipe')) return;

  if (root.hasAttribute('data-wipe')) {
    root.dataset.wipe = 'open';
    release = window.setTimeout(clear, TOTAL + 250);
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

  // Back from the history cache (or a cancelled load): the page must not stay covered.
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) clear();
  });
}

/** Closes the blind, then loads `href`. */
export function navigate(href: string) {
  try {
    sessionStorage.setItem(KEY, '1');
  } catch {
    // Without storage the next page simply appears without the opening.
  }

  if (reducedMotion || !document.querySelector('.wipe')) {
    location.href = href;
    return;
  }

  root.dataset.wipe = 'close';
  window.setTimeout(() => (location.href = href), TOTAL);
  // If the load is cancelled the page comes back instead of staying closed.
  release = window.setTimeout(clear, TOTAL + 4000);
}

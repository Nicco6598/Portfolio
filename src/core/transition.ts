import gsap from 'gsap';
import type Lenis from 'lenis';

const KEY = 'tracciato:curtain';

/**
 * Page transitions between the home and the case studies. Leaving, a curtain in the
 * destination's colour rises over the page; arriving, the inline script in <head> has
 * already put it in place before first paint, and it lifts away.
 */
export function setupTransitions(lenis: Lenis) {
  const root = document.documentElement;
  const curtain = document.querySelector<HTMLElement>('.curtain');
  if (!curtain) return;

  // The stylesheet parks the curtain with translateY(100%) before any script runs;
  // own the whole transform from here on, or GSAP would add yPercent on top of it.
  if (root.hasAttribute('data-curtain')) {
    gsap.set(curtain, { y: 0, yPercent: 0 });
    root.removeAttribute('data-curtain');
    gsap.to(curtain, {
      yPercent: -100,
      duration: 1.1,
      delay: 0.15,
      ease: 'expo.inOut',
      onComplete: () => {
        gsap.set(curtain, { yPercent: 100 });
      },
    });
  } else {
    gsap.set(curtain, { y: 0, yPercent: 100 });
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
    const color = link.dataset.color ?? getComputedStyle(root).getPropertyValue('--bg').trim();
    root.style.setProperty('--curtain', color);
    try {
      sessionStorage.setItem(KEY, color);
    } catch {
      // Without storage the next page simply appears without the lift.
    }

    lenis.stop();
    gsap.fromTo(
      curtain,
      { yPercent: 100 },
      {
        yPercent: 0,
        duration: 0.85,
        ease: 'expo.inOut',
        onComplete: () => {
          location.href = link.href;
        },
      },
    );
  });

  // Coming back through the history cache, the page must not stay covered.
  window.addEventListener('pageshow', (event) => {
    if (!event.persisted) return;
    gsap.set(curtain, { yPercent: 100 });
    lenis.start();
  });
}

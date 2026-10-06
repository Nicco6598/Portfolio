import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import type Lenis from 'lenis';

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Navigation: the active section is marked in the masthead, and on small screens the
 * links move into a full-screen menu. The menu is built from the masthead's own links,
 * so the home and the case pages share one source.
 */
export function setupNav(lenis: Lenis) {
  const masthead = document.querySelector<HTMLElement>('.masthead');
  const nav = masthead?.querySelector<HTMLElement>('nav');
  if (!masthead || !nav) return;

  const links = [...nav.querySelectorAll<HTMLAnchorElement>('a')];

  // Mobile menu ------------------------------------------------------------------
  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'masthead__menu';
  toggle.textContent = 'Menu';
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-controls', 'menu');
  masthead.append(toggle);

  const menu = document.createElement('div');
  menu.className = 'menu';
  menu.id = 'menu';
  menu.hidden = true;
  menu.setAttribute('role', 'dialog');
  menu.setAttribute('aria-modal', 'true');
  menu.setAttribute('aria-label', 'Menu');
  menu.innerHTML = `
    <nav class="menu__links" aria-label="Primary">
      ${links
        .map(
          (link) =>
            `<a href="${link.getAttribute('href')}"${link.getAttribute('aria-current') === 'page' ? ' data-current' : ''}>${link.textContent}</a>`,
        )
        .join('')}
    </nav>
    <div class="menu__foot">
      <a href="mailto:nicco6598@gmail.com">nicco6598@gmail.com</a>
      <span class="mono">Milano</span>
    </div>`;
  document.body.append(menu);

  const menuLinks = [...menu.querySelectorAll<HTMLAnchorElement>('.menu__links a')];
  const splits = menuLinks.map(
    (link) => SplitText.create(link, { type: 'lines', mask: 'lines', linesClass: 'menu__line' }).lines,
  );
  let open = false;

  const setOpen = (next: boolean) => {
    if (open === next) return;
    open = next;
    toggle.setAttribute('aria-expanded', String(next));
    toggle.textContent = next ? 'Close' : 'Menu';
    masthead.classList.toggle('masthead--menu', next);

    if (next) {
      menu.hidden = false;
      lenis.stop();
      gsap.killTweensOf([menu, ...splits.flat()]);
      if (reducedMotion) {
        gsap.set(menu, { clipPath: 'inset(0% 0% 0% 0%)' });
      } else {
        gsap
          .timeline()
          .fromTo(menu, { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.8, ease: 'expo.inOut' })
          .fromTo(splits.flat(), { yPercent: 110 }, { yPercent: 0, duration: 1, stagger: 0.06, ease: 'expo.out' }, 0.35)
          .fromTo('.menu__foot', { opacity: 0 }, { opacity: 1, duration: 0.6 }, 0.6);
      }
      menuLinks[0]?.focus({ preventScroll: true });
    } else {
      lenis.start();
      const finish = () => {
        menu.hidden = true;
      };
      if (reducedMotion) finish();
      else gsap.to(menu, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.6, ease: 'expo.inOut', onComplete: finish });
    }
  };

  toggle.addEventListener('click', () => setOpen(!open));
  // Closing first lets the anchor scroll, or the page transition, run as usual.
  menuLinks.forEach((link) => link.addEventListener('click', () => setOpen(false)));
  window.addEventListener('keydown', (event) => {
    if (!open) return;
    if (event.key === 'Escape') {
      setOpen(false);
      toggle.focus();
    }
    if (event.key === 'Tab') {
      const focusable = [toggle, ...menu.querySelectorAll<HTMLElement>('a')];
      const index = focusable.indexOf(document.activeElement as HTMLElement);
      const nextIndex = (index + (event.shiftKey ? -1 : 1) + focusable.length) % focusable.length;
      event.preventDefault();
      focusable[nextIndex].focus();
    }
  });
  // Rotating to a wide screen with the menu open: just close it.
  matchMedia('(min-width: 641px)').addEventListener('change', (event) => {
    if (event.matches) setOpen(false);
  });

  // Active section -------------------------------------------------------------
  // On the home, whichever section holds the middle of the screen. On a case page
  // the template marks Work as the current page.
  links.forEach((link) => {
    const id = new URL(link.href).hash.slice(1);
    const section = id && link.pathname === location.pathname ? document.getElementById(id) : null;
    if (!section) return;
    ScrollTrigger.create({
      trigger: section,
      start: 'top 50%',
      end: 'bottom 50%',
      onToggle: (self) => {
        if (self.isActive) link.setAttribute('aria-current', 'location');
        else if (link.getAttribute('aria-current') === 'location') link.removeAttribute('aria-current');
        menu.querySelector(`a[href="${link.getAttribute('href')}"]`)?.toggleAttribute('data-current', self.isActive);
      },
    });
  });

  // Contextual ink ---------------------------------------------------------------
  // The masthead reads whatever is under each of its two ends (a photo, a dark card,
  // a colour block) and takes the ink that sits on it, so it stays legible everywhere.
  const SECTION_INK: Record<string, string> = {
    dark: 'var(--paper)',
    paper: 'var(--ballast)',
    semantics: 'var(--semantics-paper)',
    case: 'var(--case-ink)',
  };
  const name = masthead.querySelector<HTMLElement>('.masthead__name');
  const ends = [name, nav, toggle].filter((el): el is HTMLElement => !!el);

  // Geometry is measured once per layout (load, resize, ScrollTrigger refresh), never
  // while scrolling: each scroll frame is plain arithmetic on cached numbers, with no
  // DOM reads that would force style or layout.
  interface Area { top: number; bottom: number; left: number; right: number; ink: string }
  let media: Area[] = [];
  let sections: Area[] = [];
  let probes: { el: HTMLElement; x: number; y: number }[] = [];
  const lastInk = new Map<HTMLElement, string>();

  const area = (el: HTMLElement, ink: string): Area => {
    const rect = el.getBoundingClientRect();
    return { top: rect.top + scrollY, bottom: rect.bottom + scrollY, left: rect.left, right: rect.right, ink };
  };

  const measure = () => {
    media = [...document.querySelectorAll<HTMLElement>('[data-nav-ink]')].map((el) => area(el, el.dataset.navInk!));
    sections = [...document.querySelectorAll<HTMLElement>('[data-section-theme]')].map((el) =>
      area(el, SECTION_INK[el.dataset.sectionTheme!] ?? ''),
    );
    // The masthead is fixed: its ends sit at the same viewport point whatever the scroll.
    const mastheadShift = masthead.getBoundingClientRect().top;
    probes = ends
      .filter((el) => el.getBoundingClientRect().width)
      .map((el) => {
        const rect = el.getBoundingClientRect();
        return { el, x: rect.left + rect.width / 2, y: rect.top - mastheadShift + rect.height / 2 };
      });
  };

  const inkAt = (x: number, y: number) => {
    for (const box of media) if (y >= box.top && y < box.bottom && x >= box.left && x < box.right) return box.ink;
    // Innermost section wins: the last match in document order.
    let ink = '';
    for (const box of sections) if (y >= box.top && y < box.bottom) ink = box.ink;
    return ink;
  };

  const updateInk = (scroll = window.scrollY) => {
    for (const { el, x, y } of probes) {
      const ink = open ? '' : inkAt(x, y + scroll);
      if (lastInk.get(el) === ink) continue;
      lastInk.set(el, ink);
      el.style.color = ink;
    }
  };

  const remeasure = () => {
    measure();
    updateInk();
  };
  lenis.on('scroll', ({ scroll }: Lenis) => updateInk(scroll));
  window.addEventListener('resize', remeasure);
  ScrollTrigger.addEventListener('refresh', remeasure);
  toggle.addEventListener('click', () => requestAnimationFrame(() => updateInk()));
  remeasure();

  return { isOpen: () => open };
}

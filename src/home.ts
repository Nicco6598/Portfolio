import { ditherSlot, preload, scanIn } from './core/dither';
import { createShell, hasModifier, isTyping, toggleScanlines, toggleSound, toggleTheme } from './core/shell';
import { sfx } from './core/sound';
import { reducedMotion } from './core/store';
import { typeInto } from './core/typewriter';

createShell();

const root = document.documentElement;
const viewport = document.querySelector<HTMLElement>('.viewport')!;
const crumb = document.querySelector<HTMLElement>('[data-crumb]')!;
const screens = new Map(
  [...document.querySelectorAll<HTMLElement>('[data-screen]')].map((screen) => [screen.dataset.screen!, screen]),
);

const TITLES: Record<string, string> = {
  root: 'Menu',
  work: 'Work',
  semantics: 'Semantics',
  about: 'About',
  contact: 'Contact',
  settings: 'Settings',
};

const touchLike = () => window.matchMedia('(pointer: coarse), (max-width: 760px)').matches;

let current = 'root';
let depth = 0;
let booting = !root.hasAttribute('data-booted');
const remembered = new Map<string, number>();

const items = (id = current) => [...(screens.get(id)?.querySelectorAll<HTMLElement>('.item') ?? [])];
const activeItem = () => items().find((item) => item.classList.contains('is-active'));

// Previews ---------------------------------------------------------------------

function showPreview(screen: HTMLElement, id: string) {
  screen.querySelectorAll<HTMLElement>('.preview').forEach((preview) => {
    const on = preview.dataset.preview === id;
    preview.hidden = !on;
    if (!on) return;

    preview.querySelectorAll<HTMLElement>('[data-dither]').forEach((slot) => {
      ditherSlot(slot).then(() => scanIn(slot));
    });
    preview.querySelectorAll<HTMLElement>('[data-type]').forEach((line) => {
      line.dataset.full ??= line.textContent ?? '';
      typeInto(line, line.dataset.full);
    });
  });
}

function select(item: HTMLElement | undefined, { focus = true, quiet = false } = {}) {
  if (!item) return;
  const screen = item.closest<HTMLElement>('[data-screen]')!;
  const list = items(screen.dataset.screen);
  if (item.classList.contains('is-active')) return;

  list.forEach((other) => {
    other.classList.remove('is-active');
    other.removeAttribute('aria-current');
  });
  item.classList.add('is-active');
  item.setAttribute('aria-current', 'true');
  remembered.set(screen.dataset.screen!, list.indexOf(item));

  if (focus) {
    item.focus({ preventScroll: true });
    item.scrollIntoView({ block: 'nearest' });
  }
  showPreview(screen, item.dataset.preview ?? '');
  if (!quiet) sfx.move();
}

function move(step: number) {
  const list = items();
  const index = list.findIndex((item) => item.classList.contains('is-active'));
  const next = Math.min(list.length - 1, Math.max(0, index + step));
  if (next !== index) select(list[next]);
}

// Screens ----------------------------------------------------------------------

const idFromHash = () => {
  const id = location.hash.slice(1);
  return screens.has(id) ? id : 'root';
};

/** The portrait sits outside the previews: it is drawn whenever its screen is shown, at the size it has there. */
function drawHero(screen: HTMLElement | undefined) {
  screen?.querySelectorAll<HTMLElement>('.hero [data-dither]').forEach((slot) => {
    ditherSlot(slot).then(() => scanIn(slot));
  });
}

function render() {
  const id = idFromHash();
  if (id === current && !screens.get(id)!.hidden) return;
  current = id;

  screens.forEach((screen, key) => {
    screen.hidden = key !== id;
  });
  drawHero(screens.get(id));
  crumb.textContent = TITLES[id];
  root.dataset.screen = id;

  const list = items();
  list.forEach((item) => item.classList.remove('is-active'));
  select(list[remembered.get(id) ?? 0], { quiet: true });

  if (!reducedMotion) {
    screens.get(id)!.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 150, easing: 'steps(3, end)' });
  }
}

function open(id: string) {
  if (!screens.has(id) || id === current) return;
  depth += 1;
  location.hash = id;
  render();
}

function back() {
  if (current === 'root') return;
  sfx.back();
  if (depth > 0) {
    depth -= 1;
    history.back();
  } else {
    history.replaceState(null, '', location.pathname + location.search);
    render();
  }
}

window.addEventListener('hashchange', render);
window.addEventListener('popstate', render);

// Activating things ------------------------------------------------------------

function toggleSetting(setting: string) {
  if (setting === 'theme') toggleTheme();
  if (setting === 'sound') toggleSound();
  if (setting === 'fx') toggleScanlines();
}

viewport.addEventListener('click', (event) => {
  const item = (event.target as Element).closest<HTMLElement>('.item');
  if (!item) return;

  // On a phone the first tap picks, the second opens.
  if (touchLike() && !item.classList.contains('is-active')) {
    event.preventDefault();
    select(item, { focus: false });
    return;
  }

  select(item);
  if (item.matches('a[href^="#"]')) {
    event.preventDefault();
    sfx.open();
    open((item as HTMLAnchorElement).hash.slice(1));
  } else if (item.dataset.setting) {
    toggleSetting(item.dataset.setting);
  } else if (item.matches('a')) {
    sfx.open();
  }
});

document.addEventListener('click', (event) => {
  const act = (event.target as Element).closest<HTMLElement>('[data-act]')?.dataset.act;
  if (act === 'back') back();
  else if (act === 'move') move(1);
  else if (act === 'open') activeItem()?.click();
});

// Mouse hover picks, like the pointer on a handheld menu.
viewport.addEventListener('pointerover', (event) => {
  if (event.pointerType !== 'mouse') return;
  const item = (event.target as Element).closest<HTMLElement>('.item');
  if (item) select(item);
});

// The wheel steps through the list one row at a time.
let wheelDelta = 0;
let wheelTimer = 0;
viewport.addEventListener(
  'wheel',
  (event) => {
    if (touchLike() || !(event.target as Element).closest('.list, .panel')) return;
    event.preventDefault();
    wheelDelta += event.deltaY;
    window.clearTimeout(wheelTimer);
    wheelTimer = window.setTimeout(() => (wheelDelta = 0), 140);
    if (Math.abs(wheelDelta) >= 48) {
      move(Math.sign(wheelDelta));
      wheelDelta = 0;
    }
  },
  { passive: false },
);

// Swipe right to go back.
let touchStart: [number, number] | null = null;
viewport.addEventListener('touchstart', (event) => {
  touchStart = [event.touches[0].clientX, event.touches[0].clientY];
});
viewport.addEventListener('touchend', (event) => {
  if (!touchStart) return;
  const dx = event.changedTouches[0].clientX - touchStart[0];
  const dy = event.changedTouches[0].clientY - touchStart[1];
  touchStart = null;
  if (dx > 80 && Math.abs(dy) < 40) back();
});

window.addEventListener('keydown', (event) => {
  if (hasModifier(event) || isTyping(event.target)) return;

  if (booting) {
    event.preventDefault();
    finishBoot();
    return;
  }

  const list = items();
  switch (event.key) {
    case 'ArrowDown':
    case 'j':
      move(1);
      break;
    case 'ArrowUp':
    case 'k':
      move(-1);
      break;
    case 'Home':
      select(list[0]);
      break;
    case 'End':
      select(list[list.length - 1]);
      break;
    case 'ArrowRight':
    case 'l': {
      const item = activeItem();
      if (item && 'drill' in item.dataset) item.click();
      break;
    }
    case 'ArrowLeft':
    case 'Escape':
    case 'Backspace':
    case 'h':
      back();
      break;
    default:
      if (/^[1-9]$/.test(event.key) && list[Number(event.key) - 1]) {
        select(list[Number(event.key) - 1]);
        break;
      }
      return;
  }
  event.preventDefault();
});

// Boot -------------------------------------------------------------------------

function finishBoot() {
  if (!booting) return;
  booting = false;
  root.dataset.booted = '';
  try {
    sessionStorage.setItem('nicco:booted', '1');
  } catch {
    // The boot simply plays again next time.
  }
}

if (booting) {
  document.querySelector('.boot')?.addEventListener('animationend', (event) => {
    if ((event as AnimationEvent).animationName === 'boot-out') finishBoot();
  });
  document.querySelector('.boot')?.addEventListener('pointerdown', finishBoot);
}

// Start ------------------------------------------------------------------------

render();
if (!screens.get(current)!.hidden && !activeItem()) select(items()[0], { quiet: true });

// The portrait and everything else that will be previewed, drawn while the machine is idle.
if (current === 'root') drawHero(screens.get('root'));
const idle = window.requestIdleCallback ?? ((callback: () => void) => window.setTimeout(callback, 400));
idle(() => {
  document.querySelectorAll<HTMLElement>('.preview [data-dither]').forEach(preload);
});

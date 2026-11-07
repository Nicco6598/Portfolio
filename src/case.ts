import { ditherSlot, scanIn } from './core/dither';
import { createShell, hasModifier, isTyping } from './core/shell';
import { sfx } from './core/sound';
import { navigate } from './core/wipe';

createShell();

const viewport = document.querySelector<HTMLElement>('.viewport')!;
const plates = [...document.querySelectorAll<HTMLElement>('.shot--plate')];
const label = document.querySelector<HTMLElement>('[data-original-label]');

// Every plate arrives dithered and compiles in when it comes into view; the originals are one key away.
const seen = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (!entry.isIntersecting) continue;
    seen.unobserve(entry.target);
    scanIn(entry.target as HTMLElement);
  }
});

for (const plate of plates) {
  ditherSlot(plate).then(() => {
    plate.dataset.dithered = '';
    if (plate.getBoundingClientRect().top < window.innerHeight) scanIn(plate);
    else seen.observe(plate);
  });
}

// The name fills its line exactly: measured at a known size, then scaled to the width of the masthead.
const title = document.querySelector<HTMLElement>('.masthead__title');
function fitTitle() {
  if (!title) return;
  title.style.fontSize = '100px';
  const range = document.createRange();
  range.selectNodeContents(title);
  const text = range.getBoundingClientRect().width;
  const room = title.clientWidth;
  if (text > 0 && room > 0) title.style.fontSize = `${Math.max(48, Math.min(400, (room / text) * 100 * 0.995))}px`;
}
if (title) {
  fitTitle();
  void document.fonts.ready.then(fitTitle);
  new ResizeObserver(fitTitle).observe(title.parentElement!);
}

function toggleOriginal() {
  if (!plates.length) return;
  const showing = !plates[0].hasAttribute('data-original');
  for (const plate of plates) plate.toggleAttribute('data-original', showing);
  if (label) label.textContent = showing ? 'Dithered' : 'Original';
  sfx.toggle();
}

const go = (selector: string) => {
  const link = document.querySelector<HTMLAnchorElement>(selector);
  if (link) {
    sfx.open();
    navigate(link.href);
  }
};

const back = () => {
  sfx.back();
  navigate('/#work');
};

document.addEventListener('click', (event) => {
  const act = (event.target as Element).closest<HTMLElement>('[data-act]')?.dataset.act;
  if (act === 'back') back();
  else if (act === 'prev') go('[data-prev]');
  else if (act === 'next') go('[data-next]');
  else if (act === 'original') toggleOriginal();
});

window.addEventListener('keydown', (event) => {
  if (hasModifier(event) || isTyping(event.target)) return;
  switch (event.key.toLowerCase()) {
    case 'arrowleft':
    case 'escape':
    case 'backspace':
      back();
      break;
    case 'n':
    case 'arrowright':
      go('[data-next]');
      break;
    case 'p':
      go('[data-prev]');
      break;
    case 'o':
      toggleOriginal();
      break;
    default:
      return;
  }
  event.preventDefault();
});

// So the arrow keys and space scroll the page without a click first.
viewport.focus({ preventScroll: true });

import { reducedMotion } from './store';

const timers = new WeakMap<HTMLElement, number>();

/**
 * Prints `text` one character at a time. A newer call on the same element cancels the older one.
 * The characters still to come are laid out but invisible, so the line keeps its final height from the
 * first frame and nothing around it (the photograph above, for one) moves while it types.
 */
export function typeInto(element: HTMLElement, text: string, speed = 16) {
  window.clearInterval(timers.get(element));
  if (reducedMotion) {
    element.textContent = text;
    return;
  }

  const typed = document.createElement('span');
  const rest = document.createElement('span');
  rest.style.visibility = 'hidden';
  rest.setAttribute('aria-hidden', 'true');
  element.replaceChildren(typed, rest);
  rest.textContent = text;
  element.setAttribute('aria-label', text);

  let shown = 0;
  const timer = window.setInterval(() => {
    shown += 1;
    typed.textContent = text.slice(0, shown);
    rest.textContent = text.slice(shown);
    if (shown >= text.length) {
      window.clearInterval(timer);
      element.textContent = text;
      element.removeAttribute('aria-label');
    }
  }, speed);
  timers.set(element, timer);
}

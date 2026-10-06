import gsap from 'gsap';

const CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const FLAP_INTERVAL = 0.055; // seconds between flips of a still-unsettled character

export interface FlapOptions {
  delay?: number;
  duration?: number;
  stagger?: number;
}

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

const randomChar = () => CHARSET[Math.floor(Math.random() * CHARSET.length)];

/**
 * Solari-style settle: every character flips through the charset and lands on its
 * target one after another. `apply` receives the current characters each tick.
 */
function run(target: string, apply: (chars: string[]) => void, options: FlapOptions = {}) {
  const { delay = 0, duration = 0.7, stagger = 0.035 } = options;
  const chars = [...target];

  if (reducedMotion) {
    apply(chars);
    return Promise.resolve();
  }

  const settleAt = chars.map((_, i) => delay + i * stagger + duration * (0.45 + Math.random() * 0.55));
  const current = chars.map((char) => (char === ' ' ? ' ' : randomChar()));
  const lastFlip = chars.map(() => -1);
  const start = gsap.ticker.time;

  return new Promise<void>((resolve) => {
    const tick = () => {
      const elapsed = gsap.ticker.time - start;
      let settled = 0;

      for (let i = 0; i < chars.length; i++) {
        if (chars[i] === ' ' || elapsed >= settleAt[i]) {
          current[i] = chars[i];
          settled++;
        } else if (elapsed >= delay && elapsed - lastFlip[i] >= FLAP_INTERVAL) {
          current[i] = randomChar();
          lastFlip[i] = elapsed;
        }
      }

      apply(current);

      if (settled === chars.length) {
        gsap.ticker.remove(tick);
        resolve();
      }
    };

    gsap.ticker.add(tick);
  });
}

/** Flaps the text of a single element in place. Best on monospaced text. */
export function flapText(el: HTMLElement, target: string, options?: FlapOptions) {
  return run(target, (chars) => {
    el.textContent = chars.join('');
  }, options);
}

/** Builds one tile per character inside `container` and flaps them. */
export function flapTiles(container: HTMLElement, target: string, options?: FlapOptions) {
  container.replaceChildren(
    ...[...target].map((char) => {
      const tile = document.createElement('span');
      tile.className = char === ' ' ? 'flap-tile flap-tile--space' : 'flap-tile';
      return tile;
    }),
  );
  const tiles = [...container.children] as HTMLElement[];

  return run(target, (chars) => {
    chars.forEach((char, i) => {
      if (tiles[i].textContent !== char) tiles[i].textContent = char;
    });
  }, options);
}

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { flapText } from './flap';

const EASE_RAIL = 'expo.out';
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Declarative reveals. Every one of them animates transforms, opacity or clip-path only,
 * and every one-shot trigger is `once`, so nothing keeps listening after it played.
 */
export function setupReveals() {
  if (reducedMotion) return;

  gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
    gsap.from(el, {
      y: 56,
      opacity: 0,
      duration: 1.3,
      ease: EASE_RAIL,
      // Hand transform back to the stylesheet afterwards, or :hover transforms never apply.
      clearProps: 'transform,opacity',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
    });
  });

  gsap.utils.toArray<HTMLElement>('[data-split-lines]').forEach((el) => {
    const { lines } = SplitText.create(el, { type: 'lines', linesClass: 'line-row', mask: 'lines', autoSplit: true });
    gsap.from(lines, {
      yPercent: 110,
      duration: 1.4,
      stagger: 0.09,
      ease: EASE_RAIL,
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    });
  });

  // Words light up as you read through them.
  gsap.utils.toArray<HTMLElement>('[data-words]').forEach((el) => {
    const { words } = SplitText.create(el, { type: 'words', wordsClass: 'word' });
    gsap.to(words, {
      opacity: 1,
      stagger: 0.1,
      ease: 'none',
      scrollTrigger: { trigger: el, start: 'top 75%', end: 'bottom 45%', scrub: true },
    });
  });

  // Media opens like a window from its centre: a small rounded frame grows to full size
  // while the picture inside settles back from a close crop.
  gsap.utils.toArray<HTMLElement>('[data-clip]').forEach((figure) => {
    const img = figure.querySelector('img');
    const timeline = gsap.timeline({ paused: true });
    timeline.fromTo(
      figure,
      { clipPath: 'inset(16% 12% 16% 12% round 56px)' },
      { clipPath: 'inset(0% 0% 0% 0% round 0px)', duration: 1.7, ease: 'expo.out', clearProps: 'clipPath' },
      0,
    );
    // data-clip-scale: the resting zoom, for detail crops of a larger picture.
    const rest = Number(figure.dataset.clipScale ?? 1);
    if (img) timeline.fromTo(img, { scale: rest * 1.4 }, { scale: rest, duration: 2, ease: 'expo.out' }, 0);

    // Never open a window onto an empty frame: wait for the picture (at most a moment).
    ScrollTrigger.create({
      trigger: figure,
      start: 'top 90%',
      once: true,
      onEnter: () => {
        if (!img || img.complete) {
          timeline.play();
          return;
        }
        img.loading = 'eager';
        const play = () => timeline.play();
        void Promise.race([img.decode().catch(() => undefined), new Promise((resolve) => setTimeout(resolve, 1200))]).then(play);
      },
    });
  });

  // Media drifts inside its frame: transform only, scrubbed to the scroll.
  gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((frame) => {
    const img = frame.querySelector('img');
    if (!img) return;
    gsap.fromTo(
      img,
      { yPercent: -5 },
      {
        yPercent: 5,
        ease: 'none',
        scrollTrigger: { trigger: frame, start: 'top bottom', end: 'bottom top', scrub: true },
      },
    );
  });

  gsap.utils.toArray<HTMLElement>('[data-flap]').forEach((el) => {
    const text = el.dataset.flap ?? el.textContent ?? '';
    el.textContent = ' ';
    ScrollTrigger.create({
      trigger: el,
      start: 'top 92%',
      once: true,
      onEnter: () => void flapText(el, text.toUpperCase(), { delay: 0.2, duration: 0.6, stagger: 0.02 }),
    });
  });

  gsap.utils.toArray<HTMLElement>('[data-count-to]').forEach((el) => {
    const counter = { value: 0 };
    el.textContent = '0';
    gsap.to(counter, {
      value: Number(el.dataset.countTo),
      duration: 1.8,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      onUpdate: () => {
        el.textContent = String(Math.round(counter.value));
      },
    });
  });

}

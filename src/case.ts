import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { createApp, reducedMotion } from './core/app';
import { fitToWidth } from './core/fit';

createApp();

const title = document.querySelector<HTMLElement>('.case-hero__title');
fitToWidth([...document.querySelectorAll<HTMLElement>('.case-hero__title, .next__name')]);

if (!reducedMotion) {
  // Arrival: the title rises letter by letter as the curtain lifts.
  if (title) {
    // Mask per line, not per char: tight tracking makes glyphs overhang their own box.
    const { chars } = SplitText.create(title, { type: 'lines,words,chars', charsClass: 'char', mask: 'lines' });
    gsap.from(chars, { yPercent: 115, duration: 1.4, stagger: 0.03, delay: 0.45, ease: 'expo.out' });
  }
  gsap.from('.case-hero__tagline, .case-meta', {
    y: 40,
    opacity: 0,
    duration: 1.3,
    stagger: 0.1,
    delay: 0.7,
    ease: 'expo.out',
  });

  // The cover opens from an inset frame to full bleed as it comes up.
  const cover = document.querySelector<HTMLElement>('.case-cover');
  if (cover) {
    gsap
      .timeline({ scrollTrigger: { trigger: cover, start: 'top bottom', end: 'top top', scrub: true } })
      .fromTo(
        cover,
        { clipPath: 'inset(9% 7% 9% 7% round 28px)' },
        { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'none' },
        0,
      )
      .fromTo(cover.querySelector('img'), { scale: 1.25 }, { scale: 1, ease: 'none' }, 0);
  }

}

import { useEffect, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { CV_OPTIONS, EMAIL, PERSON_NAME } from '../config/site';
import { MotionIcon } from './MotionIcon';
import { SemanticsLink } from './SemanticsLink';

interface HeroProps {
  isReady: boolean;
}

function getPortraitClip(container: HTMLElement, portrait: HTMLElement) {
  const containerRect = container.getBoundingClientRect();
  const portraitRect = portrait.getBoundingClientRect();
  const clamp = (value: number, maximum: number) => Math.min(Math.max(value, 0), maximum);

  return {
    top: clamp(portraitRect.top - containerRect.top, containerRect.height),
    right: clamp(containerRect.right - portraitRect.right, containerRect.width),
    bottom: clamp(containerRect.bottom - portraitRect.bottom, containerRect.height),
    left: clamp(portraitRect.left - containerRect.left, containerRect.width),
    width: clamp(portraitRect.width, containerRect.width),
  };
}

function formatClipPath(clip: ReturnType<typeof getPortraitClip>, collapsed = false) {
  const right = collapsed ? clip.right + clip.width : clip.right;

  return `inset(${clip.top}px ${right}px ${clip.bottom}px ${clip.left}px)`;
}

export default function Hero({ isReady }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const portraitRef = useRef<HTMLElement>(null);
  const nameStackRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const portrait = portraitRef.current;
    const nameStack = nameStackRef.current;

    if (!portrait || !nameStack) return;

    let isMounted = true;
    const updateClip = () => {
      const clip = getPortraitClip(nameStack, portrait);
      nameStack.style.setProperty('--hero-clip-top', `${clip.top}px`);
      nameStack.style.setProperty('--hero-clip-right', `${clip.right}px`);
      nameStack.style.setProperty('--hero-clip-bottom', `${clip.bottom}px`);
      nameStack.style.setProperty('--hero-clip-left', `${clip.left}px`);
    };

    const resizeObserver = new ResizeObserver(updateClip);
    resizeObserver.observe(nameStack);
    resizeObserver.observe(portrait);
    updateClip();

    void document.fonts.ready.then(() => {
      if (isMounted) updateClip();
    });

    return () => {
      isMounted = false;
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!isReady) return;

    const section = sectionRef.current;
    const portrait = portraitRef.current;
    const nameStack = nameStackRef.current;

    if (!section || !portrait || !nameStack) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const ctx = gsap.context(() => {
      if (reduceMotion.matches) {
        gsap.set('[data-hero-name], [data-hero-copy], [data-hero-portrait], [data-hero-portrait-image], [data-hero-contrast]', { clearProps: 'all' });
        return;
      }

      const portraitClip = getPortraitClip(nameStack, portrait);

      gsap.timeline()
        .fromTo(
          '[data-hero-portrait]',
          { clipPath: 'inset(0 100% 0 0)' },
          { clipPath: 'inset(0 0% 0 0)', duration: 1.05, ease: 'expo.inOut' },
        )
        .fromTo(
          '[data-hero-contrast]',
          { clipPath: formatClipPath(portraitClip, true) },
          {
            clipPath: formatClipPath(portraitClip),
            duration: 1.05,
            ease: 'expo.inOut',
            onComplete: () => gsap.set('[data-hero-contrast]', { clearProps: 'clip-path' }),
          },
          0,
        )
        .fromTo(
          '[data-hero-portrait-image]',
          { scale: 1.06 },
          { scale: 1, duration: 1.35, ease: 'expo.out' },
          0,
        )
        .fromTo(
          '[data-hero-name="first"]',
          { yPercent: 110 },
          { yPercent: 0, duration: 1.05, ease: 'expo.out' },
          0.08,
        )
        .fromTo(
          '[data-hero-name="last"]',
          { yPercent: 110 },
          { yPercent: 0, duration: 1.05, ease: 'expo.out' },
          0.18,
        )
        .fromTo(
          '[data-hero-copy]',
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.65, ease: 'power3.out' },
          0.48,
        );
    }, section);

    return () => ctx.revert();
  }, [isReady]);

  return (
    <section ref={sectionRef} id="works" className="hero-shell" aria-labelledby="hero-name">
      <div className="hero-stage">
        <figure ref={portraitRef} data-hero-portrait className="hero-portrait">
          <img
            data-hero-portrait-image
            src="/assets/hero/marco-portrait-olive-v1.png"
            alt="Marco Niccolini wearing a dark crewneck against an olive studio backdrop"
            width="1122"
            height="1402"
            fetchPriority="high"
            decoding="async"
          />
        </figure>

        <div ref={nameStackRef} className="hero-name-stack">
          <h1 id="hero-name" className="hero-name hero-name--base" aria-label={PERSON_NAME}>
            <span className="hero-name__line hero-name__line--first">
              <span data-hero-name="first">Marco</span>
            </span>
            <span className="hero-name__line hero-name__line--last">
              <span data-hero-name="last">Niccolini</span>
            </span>
          </h1>

          <div data-hero-contrast className="hero-name hero-name--contrast" aria-hidden="true">
            <span className="hero-name__line hero-name__line--first">
              <span data-hero-name="first">Marco</span>
            </span>
            <span className="hero-name__line hero-name__line--last">
              <span data-hero-name="last">Niccolini</span>
            </span>
          </div>
        </div>

        <div data-hero-copy className="hero-footer">
          <p>
            Founder of <SemanticsLink />.<br />
            Designer &amp; engineer.
          </p>

          <div className="hero-actions" aria-label="Primary links">
            <a className="motion-link" href={`mailto:${EMAIL}`}><span>Contact</span><MotionIcon /></a>
            <a className="motion-link" href={CV_OPTIONS[0].href} target="_blank" rel="noopener noreferrer"><span>CV</span><MotionIcon direction="down" /></a>
          </div>
        </div>
      </div>
    </section>
  );
}

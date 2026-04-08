import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { SITE_NAME } from '../config/site';

interface LoaderProps {
  onReveal: () => void;
  onComplete: () => void;
}

const LOADER_TITLE = ['Marco', 'Niccolini'];
const LOADER_STACK = ['React', 'TypeScript', 'Node.js'];

export default function Loader({ onReveal, onComplete }: LoaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const copyRef = useRef<HTMLParagraphElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.classList.add('loader-active');

    const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const prefersReducedMotion = reduceMotionQuery.matches;
    const progressState = { value: 0 };

    let hasRevealed = false;

    const revealSite = () => {
      if (hasRevealed) {
        return;
      }

      hasRevealed = true;
      onReveal();
    };

    const completeLoader = () => {
      document.body.classList.remove('loader-active');
      onComplete();
    };

    const ctx = gsap.context(() => {
      gsap.set(
        [
          headerRef.current,
          titleRef.current,
          copyRef.current,
          progressRef.current,
          footerRef.current,
        ],
        {
          opacity: 0,
          y: 24,
        },
      );

      gsap.set(progressFillRef.current, {
        scaleX: 0,
        transformOrigin: 'left center',
      });

      gsap.set(glowRef.current, {
        scale: 0.82,
        opacity: prefersReducedMotion ? 0.16 : 0.22,
      });

      const tl = gsap.timeline({
        onComplete: () => {
          const outro = gsap.timeline({ onComplete: completeLoader });

          outro
            .call(revealSite)
            .to(
              [headerRef.current, copyRef.current, progressRef.current, footerRef.current],
              {
                opacity: 0,
                y: -18,
                duration: 0.28,
                ease: 'power2.in',
                stagger: 0.04,
              },
            )
            .to(
              titleRef.current,
              {
                opacity: 0,
                y: -28,
                duration: 0.42,
                ease: 'power3.in',
              },
              0.06,
            )
            .to(
              containerRef.current,
              {
                yPercent: -100,
                duration: prefersReducedMotion ? 0.4 : 0.78,
                ease: 'expo.inOut',
              },
              0.1,
            );
        },
      });

      tl.to(
        [headerRef.current, titleRef.current, copyRef.current, progressRef.current, footerRef.current],
        {
          opacity: 1,
          y: 0,
          duration: prefersReducedMotion ? 0.25 : 0.7,
          ease: 'power3.out',
          stagger: prefersReducedMotion ? 0.03 : 0.08,
        },
        0,
      )
        .to(
          glowRef.current,
          {
            scale: 1.16,
            xPercent: 7,
            yPercent: -5,
            duration: prefersReducedMotion ? 0.8 : 1.9,
            ease: 'power1.out',
          },
          0,
        )
        .to(
          gridRef.current,
          {
            xPercent: -3,
            yPercent: -2,
            duration: prefersReducedMotion ? 0.8 : 2.2,
            ease: 'none',
          },
          0,
        )
        .to(
          progressFillRef.current,
          {
            scaleX: 1,
            duration: prefersReducedMotion ? 0.85 : 1.75,
            ease: 'power2.inOut',
          },
          0.24,
        )
        .to(
          progressState,
          {
            value: 100,
            duration: prefersReducedMotion ? 0.85 : 1.75,
            ease: 'power2.inOut',
            onUpdate: () => {
              if (percentRef.current) {
                percentRef.current.textContent = `${Math.round(progressState.value)
                  .toString()
                  .padStart(2, '0')}%`;
              }
            },
          },
          0.24,
        )
        .to(
          {},
          {
            duration: prefersReducedMotion ? 0.12 : 0.26,
          },
        );
    }, containerRef);

    return () => {
      document.body.classList.remove('loader-active');
      ctx.revert();
    };
  }, [onComplete, onReveal]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[120] overflow-hidden"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      <div ref={gridRef} className="loader-grid absolute -inset-[20%]" />
      <div
        ref={glowRef}
        className="pointer-events-none absolute left-1/2 top-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl md:h-[34rem] md:w-[34rem]"
        style={{
          background: 'radial-gradient(circle, rgba(255,77,0,0.22) 0%, rgba(255,77,0,0.1) 28%, transparent 70%)',
        }}
      />

      <div className="relative flex h-full flex-col justify-between px-6 py-6 md:px-10 md:py-8">
        <div
          ref={headerRef}
          className="flex items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.28em] md:text-[11px]"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          <span>{SITE_NAME}</span>
          <span>Loading Portfolio</span>
        </div>

        <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center">
          <h1
            ref={titleRef}
            className="font-serif-display text-[clamp(86px,16vw,250px)] leading-[0.82]"
            style={{ color: 'var(--color-text-primary)' }}
          >
            <span className="block">{LOADER_TITLE[0]}</span>
            <span className="block pl-[0.16em]">{LOADER_TITLE[1]}</span>
          </h1>

          <div className="mt-6 grid gap-8 md:grid-cols-[minmax(0,1fr)_240px] md:items-end">
            <p
              ref={copyRef}
              className="max-w-xl text-sm leading-6 md:text-base md:leading-7"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Designing a sharper first impression, then handing off to the rest of the experience.
            </p>

            <div ref={progressRef} className="w-full max-w-[240px] md:justify-self-end">
              <div
                className="mb-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.24em]"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                <span>Initializing</span>
                <span ref={percentRef}>00%</span>
              </div>

              <div
                className="h-[2px] w-full overflow-hidden rounded-full"
                style={{ backgroundColor: 'var(--color-border)' }}
              >
                <div
                  ref={progressFillRef}
                  className="h-full w-full"
                  style={{ backgroundColor: 'var(--color-accent)' }}
                />
              </div>
            </div>
          </div>
        </div>

        <div
          ref={footerRef}
          className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[10px] uppercase tracking-[0.24em] md:text-[11px]"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          {LOADER_STACK.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

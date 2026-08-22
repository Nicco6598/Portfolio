import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface LoaderProps {
  onReveal: () => void;
  onComplete: () => void;
}

export default function Loader({ onReveal, onComplete }: LoaderProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    document.body.classList.add('loader-active');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const value = { current: 0 };

    const ctx = gsap.context(() => {
      gsap.set(titleRef.current, { yPercent: 110 });
      gsap.set(lineRef.current, { scaleX: 0, transformOrigin: 'left center' });

      gsap.timeline({
        onComplete: () => {
          onReveal();
          gsap.to(rootRef.current, {
            yPercent: -100,
            duration: reduced ? 0.35 : 0.75,
            ease: 'expo.inOut',
            onComplete: () => {
              document.body.classList.remove('loader-active');
              onComplete();
            },
          });
        },
      })
        .to(titleRef.current, { yPercent: 0, duration: reduced ? 0.25 : 0.75, ease: 'power4.out' })
        .to(lineRef.current, { scaleX: 1, duration: reduced ? 0.5 : 1.2, ease: 'power2.inOut' }, 0.15)
        .to(value, {
          current: 100,
          duration: reduced ? 0.5 : 1.2,
          ease: 'power2.inOut',
          onUpdate: () => {
            if (percentRef.current) percentRef.current.textContent = `${Math.round(value.current)}`;
          },
        }, 0.15);
    }, rootRef);

    return () => {
      document.body.classList.remove('loader-active');
      ctx.revert();
    };
  }, [onComplete, onReveal]);

  return (
    <div ref={rootRef} className="loader-screen">
      <div className="loader-screen__title"><h1 ref={titleRef}>Marco Niccolini</h1></div>
      <div className="loader-screen__progress">
        <div><div ref={lineRef} /></div>
        <span ref={percentRef}>0</span>
      </div>
    </div>
  );
}

import { useEffect, useRef, useState, Suspense, lazy } from 'react';
import gsap from 'gsap';

const Spline = lazy(() => import('@splinetool/react-spline'));

const SPLINE_URL = "https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode";

interface LoaderProps {
  onComplete: () => void;
}

export default function Loader({ onComplete }: LoaderProps) {
  const counterRef = useRef<HTMLSpanElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    document.body.classList.add('loader-active');

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(overlayRef.current, {
          clipPath: 'inset(0% 0% 100% 0%)',
          duration: 1,
          ease: 'expo.inOut',
          onComplete: () => {
            document.body.classList.remove('loader-active');
            onComplete();
          }
        });
      }
    });

    tl.to(counterRef.current, {
      innerHTML: 100,
      duration: 2.8,
      ease: 'power2.inOut',
      snap: { innerHTML: 1 },
      onUpdate: function() {
        if (counterRef.current) {
          setCounter(Math.round(parseFloat(counterRef.current.innerHTML)));
        }
      }
    });

    return () => {
      document.body.classList.remove('loader-active');
    };
  }, [onComplete]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-between"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      <div className="flex-1 w-full flex items-center justify-center">
        <Suspense fallback={
          <div className="w-64 h-64 rounded-full animate-pulse" style={{ backgroundColor: 'var(--color-surface)' }} />
        }>
          <Spline scene={SPLINE_URL} />
        </Suspense>
      </div>

      <div className="w-full flex items-end justify-between px-6 pb-6">
        <span
          ref={counterRef}
          className="font-mono text-[13px] uppercase tracking-widest"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          {String(counter).padStart(2, '0')}
        </span>
        <span
          className="font-mono text-[12px] uppercase tracking-widest"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          yourdomain.
        </span>
      </div>
    </div>
  );
}

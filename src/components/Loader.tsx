import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface LoaderProps {
  onComplete: () => void;
}

export default function Loader({ onComplete }: LoaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);
  const finishedRef = useRef(false);

  useEffect(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(containerRef.current, {
          y: '-100%',
          duration: 0.8,
          ease: 'expo.inOut',
          onComplete: onComplete
        });
      }
    });

    tl.to(percentRef.current, {
      innerHTML: 100,
      duration: 2,
      ease: 'power2.inOut',
      snap: { innerHTML: 1 }
    });
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ 
        backgroundColor: 'var(--color-bg)',
        transform: 'translateY(0)'
      }}
    >
      <span
        ref={percentRef}
        className="font-mono text-[14px] tracking-[0.5em]"
        style={{ color: 'var(--color-text-secondary)' }}
      >
        0%
      </span>
    </div>
  );
}

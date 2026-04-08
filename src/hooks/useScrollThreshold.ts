import { useEffect, useRef, useState } from 'react';

export function useScrollThreshold(threshold: number) {
  const [isPastThreshold, setIsPastThreshold] = useState(false);
  const valueRef = useRef(false);

  useEffect(() => {
    let frameId = 0;

    const updateValue = () => {
      frameId = 0;
      const nextValue = window.scrollY > threshold;

      if (valueRef.current === nextValue) {
        return;
      }

      valueRef.current = nextValue;
      setIsPastThreshold(nextValue);
    };

    const handleScroll = () => {
      if (frameId !== 0) {
        return;
      }

      frameId = window.requestAnimationFrame(updateValue);
    };

    updateValue();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      if (frameId !== 0) {
        window.cancelAnimationFrame(frameId);
      }

      window.removeEventListener('scroll', handleScroll);
    };
  }, [threshold]);

  return isPastThreshold;
}

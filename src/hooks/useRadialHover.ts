import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export function useRadialHover<T extends HTMLElement>(enabled = true) {
  const elementRef = useRef<T | null>(null);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const element = elementRef.current;
    const fill = element?.querySelector<HTMLElement>('[data-radial-fill]');

    if (!element || !fill) {
      return;
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (reduceMotion.matches) {
      return;
    }

    const getCircleMetrics = (event: PointerEvent) => {
      const bounds = element.getBoundingClientRect();
      const localX = event.clientX - bounds.left;
      const localY = event.clientY - bounds.top;
      const radius = Math.hypot(
        Math.max(localX, bounds.width - localX),
        Math.max(localY, bounds.height - localY),
      );

      return {
        x: localX,
        y: localY,
        radius,
      };
    };

    const handlePointerEnter = (event: PointerEvent) => {
      if (event.pointerType === 'touch') {
        return;
      }

      gsap.killTweensOf(fill);
      const { x, y, radius } = getCircleMetrics(event);
      gsap.set(fill, {
        opacity: 1,
        clipPath: `circle(0px at ${x}px ${y}px)`,
      });
      gsap.to(fill, {
        clipPath: `circle(${radius}px at ${x}px ${y}px)`,
        duration: 0.68,
        ease: 'power3.out',
      });
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') {
        return;
      }

      const { x, y, radius } = getCircleMetrics(event);
      gsap.to(fill, {
        clipPath: `circle(${radius}px at ${x}px ${y}px)`,
        duration: 0.34,
        ease: 'power3.out',
        overwrite: true,
      });
    };

    const handlePointerLeave = (event: PointerEvent) => {
      if (event.pointerType === 'touch') {
        return;
      }

      gsap.killTweensOf(fill);
      const { x, y } = getCircleMetrics(event);
      gsap.to(fill, {
        clipPath: `circle(0px at ${x}px ${y}px)`,
        opacity: 0,
        duration: 0.42,
        ease: 'power3.out',
      });
    };

    gsap.set(fill, {
      opacity: 0,
      clipPath: 'circle(0px at 50% 50%)',
    });

    element.addEventListener('pointerenter', handlePointerEnter);
    element.addEventListener('pointermove', handlePointerMove);
    element.addEventListener('pointerleave', handlePointerLeave);

    return () => {
      element.removeEventListener('pointerenter', handlePointerEnter);
      element.removeEventListener('pointermove', handlePointerMove);
      element.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, [enabled]);

  return elementRef;
}

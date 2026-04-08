import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';

const DARK_HOVER_TEXT = '#0A0A0A';
const LIGHT_HOVER_TEXT = '#FFFFFF';

function parseRgbColor(colorValue: string) {
  const rgbMatch = colorValue.match(/rgba?\(([^)]+)\)/i);

  if (!rgbMatch) {
    return null;
  }

  const channels = rgbMatch[1]
    .split(',')
    .map((channel) => Number.parseFloat(channel.trim()))
    .slice(0, 3);

  if (channels.length !== 3 || channels.some((channel) => Number.isNaN(channel))) {
    return null;
  }

  return {
    r: channels[0],
    g: channels[1],
    b: channels[2],
  };
}

function toRelativeLuminance(channel: number) {
  const normalizedChannel = channel / 255;

  if (normalizedChannel <= 0.03928) {
    return normalizedChannel / 12.92;
  }

  return ((normalizedChannel + 0.055) / 1.055) ** 2.4;
}

function getContrastRatio(luminanceA: number, luminanceB: number) {
  const lighter = Math.max(luminanceA, luminanceB);
  const darker = Math.min(luminanceA, luminanceB);

  return (lighter + 0.05) / (darker + 0.05);
}

function getAccessibleHoverTextColor(backgroundColor: string) {
  const rgbColor = parseRgbColor(backgroundColor);

  if (!rgbColor) {
    return LIGHT_HOVER_TEXT;
  }

  const backgroundLuminance =
    (0.2126 * toRelativeLuminance(rgbColor.r)) +
    (0.7152 * toRelativeLuminance(rgbColor.g)) +
    (0.0722 * toRelativeLuminance(rgbColor.b));

  const contrastOnDark = getContrastRatio(backgroundLuminance, 0);
  const contrastOnLight = getContrastRatio(backgroundLuminance, 1);

  return contrastOnDark >= contrastOnLight ? DARK_HOVER_TEXT : LIGHT_HOVER_TEXT;
}

export function useRadialHover<T extends HTMLElement>(enabled = true) {
  const elementRef = useRef<T | null>(null);

  useLayoutEffect(() => {
    if (!enabled) {
      return;
    }

    const element = elementRef.current;
    const fill = element?.querySelector<HTMLElement>('[data-radial-fill]');

    if (!element || !fill) {
      return;
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)');

    const updateHoverTextColor = () => {
      const fillBackgroundColor = window.getComputedStyle(fill).backgroundColor;
      const accessibleHoverTextColor = getAccessibleHoverTextColor(fillBackgroundColor);

      element.style.setProperty('--radial-text-hover', accessibleHoverTextColor);
    };

    updateHoverTextColor();

    const observer = new MutationObserver(() => {
      updateHoverTextColor();
    });

    observer.observe(element, {
      attributes: true,
      attributeFilter: ['class', 'style'],
    });

    observer.observe(fill, {
      attributes: true,
      attributeFilter: ['class', 'style'],
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'style', 'data-theme'],
    });

    if (reduceMotion.matches || !canHover.matches) {
      gsap.set(fill, {
        clearProps: 'clipPath,opacity',
      });

      return () => {
        observer.disconnect();
      };
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
      observer.disconnect();
      gsap.killTweensOf(fill);
      element.removeEventListener('pointerenter', handlePointerEnter);
      element.removeEventListener('pointermove', handlePointerMove);
      element.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, [enabled]);

  return elementRef;
}

import { useCallback, useEffect, useRef } from 'react';

const VIEWPORT_PADDING = 16;

export function usePointerPreviewPosition(
  isEnabled: boolean,
  offsetX: number,
  offsetY: number,
) {
  const previewRef = useRef<HTMLDivElement | null>(null);
  const pointerRef = useRef({ x: 0, y: 0 });
  const frameIdRef = useRef<number | null>(null);

  const setPointerPosition = useCallback((x: number, y: number) => {
    pointerRef.current = { x, y };
  }, []);

  useEffect(() => {
    if (!isEnabled) {
      return;
    }

    const updatePreviewPosition = () => {
      frameIdRef.current = null;

      if (!previewRef.current) {
        return;
      }

      const { x, y } = pointerRef.current;
      const previewWidth = previewRef.current.offsetWidth;
      const previewHeight = previewRef.current.offsetHeight;
      const nextX = x + offsetX;
      const nextY = y + offsetY;
      const maxX = window.innerWidth - previewWidth - VIEWPORT_PADDING;
      const maxY = window.innerHeight - previewHeight - VIEWPORT_PADDING;
      const clampedX = Math.min(Math.max(VIEWPORT_PADDING, nextX), Math.max(VIEWPORT_PADDING, maxX));
      const clampedY = Math.min(Math.max(VIEWPORT_PADDING, nextY), Math.max(VIEWPORT_PADDING, maxY));

      previewRef.current.style.transform = `translate3d(${clampedX}px, ${clampedY}px, 0)`;
    };

    const handlePointerMove = (event: MouseEvent) => {
      setPointerPosition(event.clientX, event.clientY);

      if (frameIdRef.current !== null) {
        return;
      }

      frameIdRef.current = window.requestAnimationFrame(updatePreviewPosition);
    };

    updatePreviewPosition();
    window.addEventListener('mousemove', handlePointerMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);

      if (frameIdRef.current !== null) {
        window.cancelAnimationFrame(frameIdRef.current);
        frameIdRef.current = null;
      }
    };
  }, [isEnabled, offsetX, offsetY, setPointerPosition]);

  return {
    previewRef,
    setPointerPosition,
  };
}

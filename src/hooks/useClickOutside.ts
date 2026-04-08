import { useEffect, useRef } from 'react';

export function useClickOutside<T extends HTMLElement>(
  isEnabled: boolean,
  onOutsideClick: () => void,
) {
  const targetRef = useRef<T | null>(null);

  useEffect(() => {
    if (!isEnabled) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (targetRef.current && !targetRef.current.contains(event.target as Node)) {
        onOutsideClick();
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [isEnabled, onOutsideClick]);

  return targetRef;
}

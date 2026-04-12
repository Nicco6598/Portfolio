import { type RefObject, useEffect } from 'react';

interface UseDialogFocusOptions {
  containerRef: RefObject<HTMLElement | null>;
  isOpen: boolean;
  initialFocusRef?: RefObject<HTMLElement | null>;
  returnFocusRef?: RefObject<HTMLElement | null>;
}

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

function getFocusableElements(container: HTMLElement) {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (element) => !element.hasAttribute('disabled') && element.getAttribute('aria-hidden') !== 'true',
  );
}

export function useDialogFocus({
  containerRef,
  isOpen,
  initialFocusRef,
  returnFocusRef,
}: UseDialogFocusOptions) {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const container = containerRef.current;

    if (!container) {
      return;
    }

    const explicitReturnTarget = returnFocusRef?.current ?? null;
    const fallbackReturnTarget =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const focusInitialElement = () => {
      const focusTarget =
        initialFocusRef?.current ??
        container;

      focusTarget.focus({ preventScroll: true });
    };

    const frameId = window.requestAnimationFrame(focusInitialElement);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') {
        return;
      }

      const focusableElements = getFocusableElements(container);

      if (focusableElements.length === 0) {
        event.preventDefault();
        container.focus({ preventScroll: true });
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement =
        document.activeElement instanceof HTMLElement ? document.activeElement : null;

      if (event.shiftKey) {
        if (!activeElement || activeElement === firstElement || !container.contains(activeElement)) {
          event.preventDefault();
          lastElement.focus({ preventScroll: true });
        }

        return;
      }

      if (!activeElement || activeElement === lastElement || !container.contains(activeElement)) {
        event.preventDefault();
        firstElement.focus({ preventScroll: true });
      }
    };

    container.addEventListener('keydown', handleKeyDown);

    return () => {
      window.cancelAnimationFrame(frameId);
      container.removeEventListener('keydown', handleKeyDown);

      const returnTarget = explicitReturnTarget ?? fallbackReturnTarget;

      if (!returnTarget || !returnTarget.isConnected) {
        return;
      }

      window.requestAnimationFrame(() => {
        returnTarget.focus({ preventScroll: true });
      });
    };
  }, [containerRef, initialFocusRef, isOpen, returnFocusRef]);
}

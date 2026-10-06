import gsap from 'gsap';

/** A label that follows the pointer over anything with `data-cursor`. Fine pointers only. */
export function setupCursor() {
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  const cursor = document.createElement('div');
  cursor.className = 'cursor';
  cursor.setAttribute('aria-hidden', 'true');
  document.body.append(cursor);
  gsap.set(cursor, { xPercent: -50, yPercent: -50, scale: 0.4 });

  const moveX = gsap.quickTo(cursor, 'x', { duration: 0.55, ease: 'power3.out' });
  const moveY = gsap.quickTo(cursor, 'y', { duration: 0.55, ease: 'power3.out' });
  window.addEventListener('pointermove', (event) => {
    moveX(event.clientX);
    moveY(event.clientY);
  });

  document.querySelectorAll<HTMLElement>('[data-cursor]').forEach((target) => {
    target.addEventListener('pointerenter', () => {
      cursor.textContent = target.dataset.cursor ?? '';
      cursor.style.setProperty('--cursor-bg', target.dataset.color ?? '');
      cursor.style.setProperty('--cursor-fg', target.dataset.ink ?? '');
      gsap.to(cursor, { opacity: 1, scale: 1, duration: 0.6, ease: 'expo.out', overwrite: 'auto' });
    });
    target.addEventListener('pointerleave', () => {
      gsap.to(cursor, { opacity: 0, scale: 0.4, duration: 0.35, ease: 'power2.in', overwrite: 'auto' });
    });
  });
}

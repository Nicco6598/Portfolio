/** Shared by the runtime and the case-study generator: no imports, plain strings. */

export const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (char) => `&#${char.charCodeAt(0)};`);

export interface PictureOptions {
  media: string;
  alt: string;
  sizes: string;
  focus?: string;
  eager?: boolean;
}

/** AVIF first, JPEG fallback, two widths each. */
export function picture({ media, alt, sizes, focus, eager }: PictureOptions) {
  // Served from public/media as-is: the markup is built in JS, where Vite cannot rewrite paths.
  const set = (ext: string) => `/media/${media}-800.${ext} 800w, /media/${media}-1448.${ext} 1448w`;
  return `<picture>
    <source type="image/avif" srcset="${set('avif')}" sizes="${sizes}" />
    <img src="/media/${media}-1448.jpg" srcset="${set('jpg')}" sizes="${sizes}" alt="${escapeHtml(alt)}"
      width="1448" height="1086" decoding="async" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'}
      ${focus ? `style="object-position:${focus}"` : ''} />
  </picture>`;
}

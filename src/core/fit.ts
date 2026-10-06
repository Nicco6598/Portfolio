/**
 * Sizes single-line display type to fill its column exactly, measured on the rendered
 * glyphs (a Range over the text), so it holds for any name, font or tracking.
 */
function textWidth(el: HTMLElement, range: Range) {
  // Once SplitText has run, lines are full-width blocks: measure the glyph spans instead.
  const chars = el.querySelectorAll<HTMLElement>('.char');
  if (chars.length) {
    let left = Infinity;
    let right = -Infinity;
    chars.forEach((char) => {
      const rect = char.getBoundingClientRect();
      left = Math.min(left, rect.left);
      right = Math.max(right, rect.right);
    });
    return right - left;
  }
  range.selectNodeContents(el);
  return range.getBoundingClientRect().width;
}

export function fitToWidth(elements: HTMLElement[]) {
  const range = document.createRange();

  const fit = () => {
    for (const el of elements) {
      const style = getComputedStyle(el);
      const available = el.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
      const used = textWidth(el, range);
      if (!used || !available) continue;
      el.style.fontSize = `${(parseFloat(style.fontSize) * available) / used}px`;
    }
  };

  fit();
  void document.fonts.ready.then(fit);

  let frame = 0;
  window.addEventListener('resize', () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(fit);
  });
}

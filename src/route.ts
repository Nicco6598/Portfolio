import { ScrollTrigger } from 'gsap/ScrollTrigger';

/** Where the train rides on screen: it holds this height while the line runs under it. */
const READING_LINE = '62%';

/**
 * The career line. A train runs down from the first station to the terminus with the scroll,
 * held at a fixed reading height; every station and stop lights up as the train passes it.
 *
 * Built for the scroll path: the rail is measured once per layout, and each scroll update
 * writes two transforms (compositor only) plus a class only when a stop actually changes
 * state. No layout reads in the loop.
 */
export function setupRoute(route: HTMLElement, reducedMotion: boolean) {
  const track = route.querySelector<HTMLElement>('.route__track')!;
  const drawn = route.querySelector<HTMLElement>('.route__drawn')!;
  const live = route.querySelector<HTMLElement>('.route__live')!;
  const train = route.querySelector<HTMLElement>('.route__train')!;
  const next = route.querySelector<HTMLElement>('.route__next')!;
  const items = [...route.querySelectorAll<HTMLElement>('.route__station, .route__stop')];
  const terminus = items.indexOf(route.querySelector<HTMLElement>('.route__station--terminus')!);

  let top = 0;
  let length = 1;
  let positions: number[] = [];
  const passed = items.map(() => false);
  let arrived = false;

  // The rail runs from the first dot's centre to the terminus; the dashes carry on to the next departure.
  const measure = () => {
    const box = route.getBoundingClientRect();
    const centre = (el: Element) => {
      const rect = el.getBoundingClientRect();
      return rect.top + rect.height / 2 - box.top;
    };
    const centres = items.map((item) => centre(item.querySelector('.route__dot')!));
    top = centres[0];
    length = Math.max(centres[terminus] - top, 1);
    positions = centres.map((c) => (c - top) / length);

    track.style.top = `${top}px`;
    track.style.height = `${length}px`;
    train.style.top = `${top}px`;
    live.style.top = `${top + length}px`;
    live.style.height = `${Math.max(centre(next) - top - length, 0)}px`;
  };

  const setProgress = (progress: number) => {
    drawn.style.transform = `scaleY(${progress.toFixed(4)})`;
    train.style.transform = `translate3d(0, ${(progress * length).toFixed(1)}px, 0)`;
    items.forEach((item, i) => {
      const now = progress >= positions[i] - 0.004;
      if (now === passed[i]) return;
      passed[i] = now;
      item.classList.toggle('is-passed', now);
    });
    const nowArrived = progress >= 0.999;
    if (nowArrived !== arrived) {
      arrived = nowArrived;
      route.classList.toggle('is-arrived', nowArrived);
    }
  };

  // Layout can move under the rail (fonts, resize): measure before every refresh.
  ScrollTrigger.addEventListener('refreshInit', measure);
  measure();

  if (reducedMotion) {
    setProgress(1);
    ScrollTrigger.addEventListener('refresh', () => setProgress(1));
    return;
  }

  // The rail's length is the scroll distance, so the train holds still on screen.
  const trigger = ScrollTrigger.create({
    trigger: route,
    start: () => `top+=${top} ${READING_LINE}`,
    end: () => `top+=${top + length} ${READING_LINE}`,
    onRefresh: (self) => setProgress(self.progress),
    onUpdate: (self) => setProgress(self.progress),
  });

  // The endless dashes past the terminus only run while the line is on screen.
  ScrollTrigger.create({
    trigger: route,
    start: 'top bottom',
    end: 'bottom top',
    onToggle: (self) => route.classList.toggle('is-visible', self.isActive),
  });
  setProgress(trigger.progress);
}

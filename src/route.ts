import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * The career line. A train runs from the first station to the terminus with the scroll;
 * every station and stop lights up as the train passes it.
 *
 * Built for the scroll path: positions are measured once per layout, and each scroll
 * update writes two transforms (compositor only) plus a class only when a station
 * actually changes state. No layout reads, no inherited custom properties.
 */
export function setupRoute(route: HTMLElement, reducedMotion: boolean) {
  const track = route.querySelector<HTMLElement>('.route__track')!;
  const drawn = route.querySelector<HTMLElement>('.route__drawn')!;
  const train = route.querySelector<HTMLElement>('.route__train')!;
  const items = [...route.querySelectorAll<HTMLElement>('.route__station, .route__stop')];
  const terminus = route.querySelector<HTMLElement>('.route__station--terminus')!;
  const vertical = matchMedia('(max-width: 760px)');

  let positions: number[] = [];
  let length = 0;
  let end = 1;
  const passed = items.map(() => false);
  let arrived = false;

  const measure = () => {
    const box = track.getBoundingClientRect();
    length = vertical.matches ? box.height : box.width;
    positions = items.map((item) => {
      const dot = item.querySelector('.route__dot')!.getBoundingClientRect();
      return vertical.matches
        ? (dot.top + dot.height / 2 - box.top) / box.height
        : (dot.left + dot.width / 2 - box.left) / box.width;
    });
    end = positions[items.indexOf(terminus)];
  };

  const setProgress = (progress: number) => {
    const p = progress * end;
    const distance = (p * length).toFixed(1);
    if (vertical.matches) {
      drawn.style.transform = `scaleY(${p.toFixed(4)})`;
      train.style.transform = `translate3d(-50%, ${distance}px, 0)`;
    } else {
      drawn.style.transform = `scaleX(${p.toFixed(4)})`;
      train.style.transform = `translate3d(${distance}px, -50%, 0)`;
    }
    items.forEach((item, i) => {
      const now = p >= positions[i] - 0.004;
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

  if (reducedMotion) {
    measure();
    setProgress(1);
    return;
  }

  const trigger = ScrollTrigger.create({
    trigger: route,
    // The train leaves as the line enters and reaches the terminus around the middle of the screen.
    start: 'top 80%',
    end: () => (vertical.matches ? 'bottom 70%' : 'bottom 45%'),
    onRefresh: (self) => {
      measure();
      setProgress(self.progress);
    },
    onUpdate: (self) => setProgress(self.progress),
    // The endless dashes past the terminus only run while the line is on screen.
    onToggle: (self) => route.classList.toggle('is-visible', self.isActive),
  });
  route.classList.toggle('is-visible', trigger.isActive);
}

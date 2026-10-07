import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { createApp, params, reducedMotion } from './core/app';
import { flapTiles } from './core/flap';
import { escapeHtml, picture } from './core/media';
import { caseHref, cases } from './content';
import { setupRoute } from './route';
import type { StageState } from './stage/stage';

const debug = params.has('debug');

// Work covers come from the curated content, so the home and the cases never disagree.
document.querySelector('[data-covers]')!.innerHTML = cases
  .map(({ slug, project, status, color, ink, media, focus }, i) => {
    const wide = i % 4 === 0 || i % 4 === 3;
    return `
      <a class="cover" href="${caseHref(slug)}" data-color="${color}" data-ink="${ink}" data-cursor="View case" data-name="Cover">
        <figure class="cover__media" data-clip data-parallax data-nav-ink="var(--paper)">
          <div class="cover__zoom">
            ${picture({
              media,
              alt: project.imageAlt ?? '',
              focus,
              sizes: wide ? '(max-width: 760px) 100vw, 96vw' : '(max-width: 760px) 100vw, 48vw',
            })}
          </div>
        </figure>
        <div class="cover__info">
          <h3 class="cover__name">${escapeHtml(project.name)}</h3>
          <p class="cover__meta mono"><span data-flap="${project.date} — ${status}">${project.date} — ${status}</span></p>
          <p class="cover__tagline">${escapeHtml(project.tagline)}</p>
        </div>
      </a>`;
  })
  .join('');
document.querySelector('[data-cover-count]')!.textContent = String(cases.length).padStart(2, '0');

const route = document.querySelector<HTMLElement>('[data-route]');
if (route) setupRoute(route, reducedMotion);

// Stage ------------------------------------------------------------------------

let setBlueprint: ((on: boolean) => void) | undefined;
const { lenis } = createApp({
  onBlueprint: (on) => {
    stage.blueprint = on;
    setBlueprint?.(on);
  },
});

// Hero -------------------------------------------------------------------------

const splitChars = (selector: string) =>
  // Mask per line, not per char: tight tracking makes glyphs overhang their own box.
  SplitText.create(selector, { type: 'lines,words,chars', charsClass: 'char', mask: 'lines' }).chars;
const stage: StageState = {
  progress: 0,
  target: 0,
  intro: 0,
  fade: 1,
  fadeTarget: 1,
  offsetTarget: 0,
  active: true,
  blueprint: false,
};

// The masks freeze where the lines break, so split on the display face, not its fallback.
// Hidden until then, so the raw headline never shows; a slow font only waits a moment.
const headlines = gsap.utils.toArray<HTMLElement>('.headline');
gsap.set(headlines, { autoAlpha: 0 });
const fontsLoaded = Promise.race([document.fonts.ready, new Promise((resolve) => setTimeout(resolve, 1500))]);

let workChars: Element[] = [];
const heroReady = fontsLoaded.then(() => {
  workChars = splitChars('.headline--work');
  const systemsChars = splitChars('.headline--systems');
  gsap.set([...workChars, ...systemsChars], { yPercent: 115 });
  gsap.set(headlines, { autoAlpha: 1 });

  gsap
    .timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        onUpdate: (self) => {
          stage.target = gsap.utils.clamp(0, 1, (self.progress - 0.06) / 0.78);
        },
      },
    })
    // Positions are fractions of the hero's scroll. The first line leaves while the coil is pulled
    // open, the second arrives as the strands fall into lanes: the frame is never without words.
    .to({}, { duration: 1 }, 0)
    .to(workChars, { y: (_, el: HTMLElement) => -el.offsetHeight * 1.6, stagger: 0.012, duration: 0.25 }, 0.18)
    .to(systemsChars, { yPercent: 0, stagger: 0.012, duration: 0.25, ease: 'power2.out' }, 0.36);
});

// Each dark section sets how present the cable is, and where it rests.
const CABLE_SCENES: Record<string, { fade: number; offsetY: number }> = {
  hero: { fade: 1, offsetY: 0 },
  // Reading: the lanes rise ahead of the paragraph and dim, so the words never cross them.
  manifesto: { fade: 0.22, offsetY: 1.25 },
  // The page ends clean: the cable has done its work by the time you reach the address.
  contact: { fade: 0, offsetY: -1.3 },
};
document.querySelectorAll<HTMLElement>('[data-cable]').forEach((section) => {
  ScrollTrigger.create({
    trigger: section,
    start: 'top 50%',
    end: 'bottom 50%',
    onToggle: (self) => {
      if (!self.isActive) return;
      const scene = CABLE_SCENES[section.dataset.cable!];
      stage.fadeTarget = scene.fade;
      stage.offsetTarget = scene.offsetY;
    },
  });
});

// Draw only while a block that shows the rope is on screen; the light blocks are opaque
// and cover the canvas, so behind them the stage simply stops.
const onScreen = new Set<Element>();
const track = (section: Element, visible: boolean) => {
  if (visible) onScreen.add(section);
  else onScreen.delete(section);
  stage.active = onScreen.size > 0;
};
document.querySelectorAll<HTMLElement>('[data-cable]').forEach((section) => {
  if (CABLE_SCENES[section.dataset.cable!].fade === 0) return;
  ScrollTrigger.create({
    trigger: section,
    start: 'top bottom',
    end: 'bottom top',
    onToggle: (self) => track(section, self.isActive),
    // Arriving mid-page (a link to #about), the starting state counts too.
    onRefresh: (self) => track(section, self.isActive),
  });
});

// Loader and intro ---------------------------------------------------------------

// The text never waits for WebGL; the rope is laid down as soon as both are ready.
let introStarted = false;
let stageReady = false;
const layRope = () => {
  if (!introStarted || !stageReady) return;
  // Easing lives in the stage (it shapes drop, tilt and fade differently); this is just time.
  gsap.to(stage, { intro: 1, duration: reducedMotion ? 0 : 2.2, ease: 'none' });
};

function intro() {
  introStarted = true;
  layRope();
  void heroReady.then(() => gsap.to(workChars, { yPercent: 0, duration: 1.1, stagger: 0.02, ease: 'expo.out', delay: 0.05 }));
}

void import('./stage/stage')
  .then(({ mountStage }) => {
    const mounted = mountStage(document.querySelector<HTMLCanvasElement>('.stage')!, stage, { debug, reducedMotion });
    setBlueprint = mounted.setBlueprint;
    if (stage.blueprint) mounted.setBlueprint(true);
    stageReady = true;
    layRope();
  })
  .catch(() => {
    // No WebGL: the page stands on its type alone.
    document.querySelector('.stage')?.remove();
  });

async function boot() {
  const loader = document.querySelector<HTMLElement>('.loader')!;
  let seen = false;
  try {
    seen = sessionStorage.getItem('tracciato:boarded') === '1';
    sessionStorage.setItem('tracciato:boarded', '1');
  } catch {
    // Storage can be unavailable; the loader simply plays.
  }

  const arrivingFromCase = getComputedStyle(loader).display === 'none';
  if (seen || arrivingFromCase || reducedMotion || location.hash) {
    loader.remove();
    intro();
    return;
  }

  lenis.stop();
  let skipped = false;
  const skip = () => {
    skipped = true;
  };
  window.addEventListener('keydown', skip, { once: true });
  loader.addEventListener('click', skip, { once: true });

  await Promise.race([
    flapTiles(loader.querySelector('[data-loader-board]')!, 'MARCO NICCOLINI', { duration: 0.7, stagger: 0.03 }),
    new Promise<void>((resolve) => {
      const wait = () => (skipped ? resolve() : requestAnimationFrame(wait));
      wait();
    }),
  ]);

  gsap.to(loader, {
    yPercent: -100,
    duration: skipped ? 0.6 : 0.9,
    delay: skipped ? 0 : 0.1,
    ease: 'expo.inOut',
    onStart: () => {
      lenis.start();
      gsap.delayedCall(0.15, intro);
    },
    onComplete: () => loader.remove(),
  });
}
void boot();

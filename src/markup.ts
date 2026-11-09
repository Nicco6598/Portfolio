import { cases, caseHref, type Case } from './content.ts';
import { escapeHtml as esc } from './core/media.ts';

/**
 * Build-time markup, shared by Vite (the home screens) and scripts/build-cases.ts (the case
 * pages). Plain strings, no DOM: the pages are complete HTML before any script runs.
 */

/** Runs in <head>, before first paint: saved theme, wipe arriving, boot sequence on the first visit. */
export const HEAD_SCRIPT = `<script>
      try {
        var r = document.documentElement;
        r.dataset.js = '';
        var theme = localStorage.getItem('nicco:theme:v2');
        if (theme) r.dataset.theme = theme;
        r.dataset.skin = localStorage.getItem('nicco:skin') || 'handheld';
        r.dataset.fx = localStorage.getItem('nicco:fx:v2') === 'on' ? 'on' : 'off';
        if (sessionStorage.getItem('nicco:wipe')) {
          sessionStorage.removeItem('nicco:wipe');
          r.dataset.wipe = '';
          r.dataset.booted = '';
        }
        if (sessionStorage.getItem('nicco:booted') || window.matchMedia('(prefers-reduced-motion: reduce)').matches) r.dataset.booted = '';
      } catch (e) {}
    </script>`;

export const WIPE = `<div class="wipe" aria-hidden="true">${Array.from({ length: 8 }, (_, i) => `<i style="--i:${i}"></i>`).join('')}</div>`;

export const FX = '<div class="fx" aria-hidden="true"></div>';

interface StatusbarOptions {
  crumb: string;
  back?: { href: string; label: string };
  /** The home console: a back button that appears away from the menu. */
  console?: boolean;
}

export const statusbar = ({ crumb, back, console: inApp }: StatusbarOptions) => `
      <header class="statusbar">
        <div class="statusbar__left">
          ${back ? `<a class="statusbar__back" href="${back.href}" aria-label="Back to ${esc(back.label)}">◀ <span>${esc(back.label)}</span></a>` : ''}
          ${inApp ? '<button class="statusbar__back statusbar__back--act" type="button" data-act="back" aria-label="Back to the menu">◀ <span>Back</span></button>' : ''}
          <a class="statusbar__brand" href="/">Marco Niccolini</a>
          <span class="statusbar__crumb" data-crumb>${esc(crumb)}</span>
        </div>
        <div class="statusbar__right">
          <span class="statusbar__time">Milano <time data-clock></time></span>
          <button class="chip" type="button" data-act="theme" aria-label="Change theme"><kbd>T</kbd> <span data-label="theme"></span></button>
          <button class="chip" type="button" data-act="sound" aria-label="Sound"><kbd>M</kbd> Sound <span data-label="sound"></span></button>
        </div>
      </header>`;

export const hints = (items: string, className = '') => `
      <footer class="hints${className ? ` ${className}` : ''}">
        <ul>${items}</ul>
      </footer>`;

/** A footer hint that is also a button: the keys on a keyboard, the tap targets on a phone. */
export const key = (act: string, keys: string, label: string) =>
  `<li><button class="key" type="button" data-act="${act}"><kbd>${keys}</kbd> ${label}</button></li>`;

export const HOME_HINTS = hints(
  [key('back', '←', 'Back'), key('move', '↑↓', 'Move'), key('open', '⏎', 'Open'), key('skin', 'S', 'Skin'), key('theme', 'T', 'Theme')].join(''),
  'hints--home',
);

/** Fills the markers in index.html. */
export function fillHome(html: string) {
  return html
    .replace('<!--@head-->', HEAD_SCRIPT)
    .replace('<!--@wipe-->', WIPE)
    .replace('<!--@fx-->', FX)
    .replace('<!--@statusbar-->', statusbar({ crumb: 'Menu', console: true }))
    .replace('<!--@screens-->', homeScreens())
    .replace('<!--@hints-->', HOME_HINTS);
}

// Home -------------------------------------------------------------------------

const pad = (n: number) => String(n + 1).padStart(2, '0');

interface ItemOptions {
  num: string;
  label: string;
  meta?: string;
  preview: string;
  href?: string;
  external?: boolean;
  /** Opens something inside the site: the right arrow works on it. */
  drill?: boolean;
  attrs?: string;
  /** A Semantics block: it wears the company's red. */
  brand?: boolean;
}

function item({ num, label, meta = '', preview, href, external, drill, attrs = '', brand }: ItemOptions) {
  const inner = `<span class="item__cursor" aria-hidden="true"></span><span class="item__num">${num}</span><span class="item__label">${esc(label)}</span><span class="item__meta">${meta}</span>`;
  const common = `class="item" data-preview="${preview}"${drill ? ' data-drill' : ''}${brand ? ' data-brand' : ''} ${attrs}`;
  const element = href
    ? `<a ${common} href="${href}"${external ? ' target="_blank" rel="noreferrer"' : ''}>${inner}</a>`
    : `<button ${common} type="button">${inner}</button>`;
  return `<li>${element}</li>`;
}

interface Media {
  /** File name in /media, without the extension. */
  name: string;
  focus?: string;
}

/** A photograph on the screen. It is drawn by JS at the size of its box; the canvas size is only a fallback. */
const slot = ({ name, focus }: Media, className = '') =>
  `<figure class="shot${className ? ` ${className}` : ''}" data-dither="/media/${name}.jpg" data-w="240" data-h="160"${focus ? ` data-focus="${focus}"` : ''}><canvas width="240" height="160" aria-hidden="true"></canvas></figure>`;

const kv = (rows: Array<[string, string]>) =>
  `<dl class="kv">${rows.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>`;

function casePreview(entry: Case, id: string, extra = '') {
  const { project } = entry;
  return `
          <article class="preview preview--media" data-preview="${id}"${project.tags.includes('Semantics') ? ' data-brand' : ''} hidden>
            ${slot({ name: `${entry.media}-800`, focus: entry.focus })}
            <div class="preview__body">
              <div class="preview__main">
                <h2 class="preview__title">${esc(project.name)}</h2>
                <p class="preview__tagline" data-type>${esc(project.tagline)}</p>
                ${extra}
                <p class="preview__impact">${esc(project.impact)}</p>
              </div>
              <div class="preview__side">
                ${kv([
                  ['Year', project.date],
                  ['Role', project.role],
                  ['Status', entry.status],
                  ['Stack', project.tags.filter((tag) => tag !== 'Semantics').join(' · ')],
                ])}
                <p class="preview__hint"><kbd>⏎</kbd> Open file</p>
              </div>
            </div>
          </article>`;
}

/** A preview with words. With `media` it also gets a photograph, the way most screens do. */
const note = (id: string, title: string, body: string, extra = '', media?: Media, brand = false) => `
          <article class="preview ${media ? 'preview--media' : 'preview--note'}" data-preview="${id}"${brand ? ' data-brand' : ''} hidden>
            ${media ? slot(media) : ''}
            <div class="preview__body">
              <div class="preview__main">
                <h2 class="preview__title">${esc(title)}</h2>
                <p class="preview__tagline" data-type>${esc(body)}</p>
              </div>
              ${extra ? `<div class="preview__side">${extra}</div>` : ''}
            </div>
          </article>`;

function screen(id: string, title: string, inner: string) {
  return `
        <section class="screen" data-screen="${id}" aria-label="${esc(title)}"${id === 'root' ? '' : ' hidden'}>${inner}
        </section>`;
}

export function homeScreens() {
  const quantara = cases.find((entry) => entry.slug === 'quantara')!;
  const bySlug = (slug: string) => cases.find((entry) => entry.slug === slug)!;

  const root = screen(
    'root',
    'Menu',
    `
          <nav class="list" aria-label="Menu">
            <ul class="menu">
              ${item({ num: '01', label: 'Work', meta: `${cases.length} cases`, preview: 'root:work', href: '#work', drill: true })}
              ${item({ num: '02', label: 'Semantics', preview: 'root:semantics', href: '#semantics', drill: true, brand: true })}
              ${item({ num: '03', label: 'About', preview: 'root:about', href: '#about', drill: true })}
              ${item({ num: '04', label: 'Contact', preview: 'root:contact', href: '#contact', drill: true })}
              ${item({ num: '05', label: 'Settings', preview: 'root:settings', href: '#settings', drill: true })}
            </ul>
          </nav>
          <div class="panel">
            <div class="hero">
              ${slot({ name: 'portrait-1024', focus: '50% 28%' }, 'shot--portrait')}
              <div class="hero__text">
                <p class="eyebrow">Designer &amp; engineer · Milano</p>
                <div class="hero__lead">
                  <h1 class="hero__name">Marco<br />Niccolini</h1>
                  <p class="hero__tagline">Complex work. Clear systems.</p>
                  <p class="hero__bio">I take messy, critical work and turn it into software people can rely on. Product, interface and code, as one continuous line.</p>
                </div>
              </div>
            </div>
            <div class="previews previews--caption">
              ${note('root:work', 'Work', `${cases.length} cases. Messy, critical operations turned into software people rely on.`)}
              ${note('root:semantics', 'Semantics', 'The company I founded to build software for work that cannot stop.', '', undefined, true)}
              ${note('root:about', 'About', 'Capgemini, two years on my own, then Semantics.')}
              ${note('root:contact', 'Contact', 'Got a messy, critical problem? Say hello.')}
              ${note('root:settings', 'Settings', 'Skin, theme, sound, scanlines. S, T and M work from anywhere.')}
            </div>
          </div>`,
  );

  const work = screen(
    'work',
    'Work',
    `
          <nav class="list" aria-label="Work">
            <ul class="menu">
              ${cases.map((entry, i) => item({ num: pad(i), label: entry.project.name, meta: entry.project.date, preview: `work:${entry.slug}`, href: caseHref(entry.slug), drill: true, brand: entry.project.tags.includes('Semantics') })).join('\n              ')}
            </ul>
          </nav>
          <div class="panel">
            <div class="previews">${cases.map((entry) => casePreview(entry, `work:${entry.slug}`)).join('')}
            </div>
          </div>`,
  );

  const semantics = screen(
    'semantics',
    'Semantics',
    `
          <nav class="list" aria-label="Semantics">
            <p class="intro">The company I founded to build software for work that cannot stop. Complex work, clear systems.</p>
            <ul class="menu">
              ${item({ num: '01', label: 'Quantara', meta: 'In production', preview: 'semantics:quantara', href: caseHref('quantara'), drill: true, brand: true })}
              ${item({ num: '02', label: 'Kora', meta: 'Exploring', preview: 'semantics:kora', brand: true })}
              ${item({ num: '03', label: 'Visit Semantics', meta: '↗', preview: 'semantics:site', href: 'https://semantics-nu.vercel.app/', external: true, brand: true })}
            </ul>
          </nav>
          <div class="panel">
            <div class="previews">${casePreview(quantara, 'semantics:quantara', '<p class="figure"><b>4</b> railway sites run on it today.</p>')}
              ${note('semantics:kora', 'Kora', 'A field app for crews who work where the signal doesn’t.', '<p class="status">In exploration</p>', { name: 'quantara-1448', focus: '50% 60%' }, true)}
              ${note('semantics:site', 'semantics-nu.vercel.app', 'Complex work, clear systems. The company site opens in a new tab.', '', { name: 'quantara-1448', focus: '50% 40%' }, true)}
            </div>
          </div>`,
  );

  const link = (slug: string, year: string) =>
    `<li><span class="mono">${year}</span><a href="${caseHref(slug)}">${esc(bySlug(slug).project.name)}</a></li>`;

  const about = screen(
    'about',
    'About',
    `
          <nav class="list" aria-label="Career">
            <p class="intro">I started as a software engineer at Capgemini, then spent two years building products on my own. A railway contractor’s website taught me the field. Semantics is where all of it meets.</p>
            <ul class="menu">
              ${item({ num: '01', label: 'Capgemini', meta: 'Until 2024', preview: 'about:capgemini' })}
              ${item({ num: '02', label: 'Independent', meta: '2024 — 2026', preview: 'about:independent' })}
              ${item({ num: '03', label: 'Semantics', meta: '2026 —', preview: 'about:semantics', brand: true })}
            </ul>
          </nav>
          <div class="panel">
            <div class="previews">
              ${note('about:capgemini', 'Capgemini Engineering', 'Software engineer on Web3 products and high-performance web apps. I built the web app and the backend, and made all of it fast.', kv([['Role', 'Software engineer'], ['Until', '2024'], ['Work', 'Web3 products, web apps'], ['Focus', 'Performance, web app + backend']]))}
              ${note('about:independent', 'Independent', 'Products, end to end. A railway contractor’s website is where I learned the field.', `${kv([['Role', 'Independent engineer'], ['Period', '2024 — 2026'], ['Work', 'Three client products']])}<ul class="stops">${link('bombyx', '’24')}${link('scandellari', '’25')}${link('halion', '’26')}</ul>`)}
              ${note('about:semantics', 'Semantics', 'CEO and founder. Software for niche, extremely complex work that stayed in the dark until now. Quantara is in service.', `${kv([['Role', 'CEO and founder'], ['Since', '2026'], ['Focus', 'Niche, highly complex work'], ['Aim', 'Standards where there are none']])}<ul class="stops">${link('quantara', '’26')}</ul>`, undefined, true)}
            </div>
          </div>`,
  );

  // The address is not in the page: it is rebuilt in the browser, when someone asks for it.
  const mail = btoa([...'nicco6598@gmail.com'].reverse().join(''));

  const contact = screen(
    'contact',
    'Contact',
    `
          <nav class="list" aria-label="Contact">
            <p class="intro">Got a messy, critical problem? Write me. I answer from Milan.</p>
            <ul class="menu">
              ${item({ num: '01', label: 'Email', meta: '↗', preview: 'contact:email', attrs: 'data-mail' })}
              ${item({ num: '02', label: 'GitHub', meta: '↗', preview: 'contact:github', href: 'https://github.com/Nicco6598', external: true })}
              ${item({ num: '03', label: 'LinkedIn', meta: '↗', preview: 'contact:linkedin', href: 'https://www.linkedin.com/in/marconiccolini-/', external: true })}
              ${item({ num: '04', label: 'Semantics', meta: '↗', preview: 'contact:semantics', href: 'https://semantics-nu.vercel.app/', external: true, brand: true })}
            </ul>
          </nav>
          <div class="panel">
            <div class="previews">
              ${note('contact:email', 'Email', 'The fastest way. Tell me what is hard about your work.', `<button class="chip chip--mail" type="button" data-mail-show data-m="${mail}">Show address</button>`)}
              ${note('contact:github', 'github.com/Nicco6598', 'The code, in the open where it can be.')}
              ${note('contact:linkedin', 'in/marconiccolini-', 'Where the career line is written down.')}
              ${note('contact:semantics', 'Semantics', 'The company. Software for work that cannot stop.', '', undefined, true)}
            </div>
            <dl class="avail">
              <div><dt>Replies</dt><dd>Within 72 hours</dd></div>
              <div><dt>Looking for</dt><dd>Niche, extremely complex work that has stayed in the dark until now: no standards, a lot of time wasted, the problem never solved. The kind of work Semantics exists for.</dd></div>
              <div><dt>Based in</dt><dd>Milano · <time data-clock></time></dd></div>
            </dl>
            <p class="ledger">© <span data-year></span> Marco Niccolini · Milano</p>
          </div>`,
  );

  const swatches = `<div class="swatches">${(['cobalt', 'mono', 'lime', 'dmg', 'amber', 'phosphor'] as const)
    .map(
      (theme) =>
        `<button class="swatch" type="button" data-theme="${theme}" data-theme-set="${theme}" aria-pressed="false"><span><i></i><i></i><i></i><i></i></span>${theme}</button>`,
    )
    .join('')}</div>`;

  const skins = `<div class="swatches swatches--skins">${(
    [
      ['handheld', 'Chunky, pixel type, hard frames.'],
      ['terminal', 'Phosphor, mono type, no chrome.'],
      ['studio', 'Clean sans, soft corners, full colour photos.'],
    ] as const
  )
    .map(
      ([skin, text]) =>
        `<button class="swatch swatch--skin" type="button" data-skin-set="${skin}" aria-pressed="false"><b>${skin}</b><small>${text}</small></button>`,
    )
    .join('')}</div>`;

  const settings = screen(
    'settings',
    'Settings',
    `
          <nav class="list" aria-label="Settings">
            <ul class="menu">
              ${item({ num: '01', label: 'Skin', meta: '<span data-label="skin"></span>', preview: 'settings:skin', drill: true, attrs: 'data-setting="skin"' })}
              ${item({ num: '02', label: 'Theme', meta: '<span data-label="theme"></span>', preview: 'settings:theme', drill: true, attrs: 'data-setting="theme"' })}
              ${item({ num: '03', label: 'Sound', meta: '<span data-label="sound"></span>', preview: 'settings:sound', drill: true, attrs: 'data-setting="sound"' })}
              ${item({ num: '04', label: 'Scanlines', meta: '<span data-label="fx"></span>', preview: 'settings:fx', drill: true, attrs: 'data-setting="fx"' })}
            </ul>
          </nav>
          <div class="panel">
            <div class="previews">
              ${note('settings:skin', 'Skin', 'Same content, three interfaces: a handheld, a terminal, a studio. Picking one also sets its screen.', skins, { name: 'portrait-1024', focus: '50% 25%' })}
              ${note('settings:theme', 'Theme', 'Six screens. Every photograph is redrawn in whichever one you pick.', swatches, { name: 'portrait-1024', focus: '50% 25%' })}
              ${note('settings:sound', 'Sound', 'Small square-wave blips when you move and open things. Off by default.', `<button class="chip chip--mail" type="button" data-sfx="move">Move</button><button class="chip chip--mail" type="button" data-sfx="open">Open</button><button class="chip chip--mail" type="button" data-sfx="back">Back</button>`)}
              ${note('settings:fx', 'Scanlines', 'A faint line pattern over the screen, for the CRT mood. Off by default.', `<div class="fxdemo"><div><b>Off</b><span>Clean screen. Text and photographs as they are.</span></div><div class="fxdemo__on"><b>On</b><span>A faint line pattern over everything.</span></div></div>`)}
            </div>
          </div>`,
  );

  return [root, work, semantics, about, contact, settings].join('\n');
}

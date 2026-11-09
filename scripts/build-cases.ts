/**
 * Writes one static page per case into work/<slug>/index.html (generated, not committed).
 * Runs before dev and build: npm run cases. Node strips the types, no build step needed.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SITE_URL, cases, type Case } from '../src/content.ts';
import { escapeHtml, picture } from '../src/core/media.ts';
import { FX, HEAD_SCRIPT, WIPE, hints, key, statusbar } from '../src/markup.ts';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

function seo(entry: Case) {
  const { project } = entry;
  const url = `${SITE_URL}/work/${entry.slug}/`;
  const title = `${project.name} — Marco Niccolini`;
  const description = `${project.name}: ${project.tagline}. ${project.impact}`;
  const image = `${SITE_URL}/media/${entry.media}-1448.jpg`;
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CreativeWork',
        '@id': `${url}#work`,
        url,
        name: project.name,
        headline: project.tagline,
        description: project.description,
        image,
        dateCreated: project.date,
        keywords: project.tags.join(', '),
        creator: { '@id': `${SITE_URL}/#person` },
        ...(project.liveUrl ? { sameAs: project.liveUrl } : {}),
      },
      { '@type': 'Person', '@id': `${SITE_URL}/#person`, name: 'Marco Niccolini', url: `${SITE_URL}/` },
    ],
  };
  const meta = (attribute: string, key: string, value: string) =>
    `<meta ${attribute}="${key}" content="${escapeHtml(value)}" />`;
  return `<title>${escapeHtml(title)}</title>
    ${meta('name', 'description', description)}
    <link rel="canonical" href="${url}" />
    ${meta('property', 'og:type', 'article')}
    ${meta('property', 'og:site_name', 'Marco Niccolini')}
    ${meta('property', 'og:url', url)}
    ${meta('property', 'og:title', title)}
    ${meta('property', 'og:description', description)}
    ${meta('property', 'og:image', image)}
    ${meta('property', 'og:image:width', '1448')}
    ${meta('property', 'og:image:height', '1086')}
    ${meta('property', 'og:image:alt', project.imageAlt ?? project.name)}
    ${meta('name', 'twitter:card', 'summary_large_image')}
    ${meta('name', 'twitter:title', title)}
    ${meta('name', 'twitter:description', description)}
    ${meta('name', 'twitter:image', image)}
    <script type="application/ld+json">${JSON.stringify(schema).replaceAll('<', '\\u003c')}</script>`;
}

function page(entry: Case, previous: Case, next: Case) {
  const { project } = entry;
  const position = `${String(cases.indexOf(entry) + 1).padStart(2, '0')}/${String(cases.length).padStart(2, '0')}`;
  const links = [
    project.liveUrl && `<a class="button" href="${project.liveUrl}" target="_blank" rel="noreferrer">Visit ${escapeHtml(project.name)} ↗</a>`,
    project.githubUrl && `<a class="button" href="${project.githubUrl}" target="_blank" rel="noreferrer">Source ↗</a>`,
  ].filter(Boolean);
  const stack = project.tags.filter((tag) => tag !== 'Semantics').join(' · ');
  // The details are the same photograph closed in on two other points: the cover's focus, mirrored.
  const [fx, fy] = entry.focus.split(' ').map((part) => parseFloat(part));
  const clamp = (value: number) => Math.round(Math.max(10, Math.min(90, value)));
  const details = [`${clamp(100 - fx)}% ${clamp(fy)}%`, `${clamp(fx)}% ${clamp(100 - fy)}%`];
  const plate = (o: { zoom: number; focus: string; sizes: string; alt: string; eager?: boolean }) => {
    const [px, py] = o.focus.split(' ');
    return `<div class="shot shot--plate" data-dither="/media/${entry.media}-1448.jpg" data-w="480" data-h="240" data-focus="${o.focus}" data-zoom="${o.zoom}" style="--zoom:${o.zoom};--fx:${px};--fy:${py}">
              <canvas width="480" height="240" aria-hidden="true"></canvas>
              ${picture({ media: entry.media, alt: o.alt, sizes: o.sizes, focus: o.focus, eager: o.eager })}
            </div>`;
  };
  const row = (label: string, value: string) => `<div><dt>${label}</dt><dd>${escapeHtml(value)}</dd></div>`;

  const ceo = project.tags.includes('Semantics')
    ? `<aside class="ceo" aria-label="Marco Niccolini, CEO of Semantics">
            <span class="ceo__badge" aria-hidden="true">CEO</span>
            <div class="ceo__text">
              <p class="eyebrow">Chief Executive · Semantics</p>
              <p class="ceo__title">I run the company that built this.</p>
              <p class="ceo__body">I founded Semantics and lead it as CEO. ${escapeHtml(project.name)} is its first product, shaped with the people on site and built by me end to end.</p>
            </div>
            <a class="ceo__link" href="https://semantics-nu.vercel.app/" target="_blank" rel="noreferrer">Visit Semantics ↗</a>
          </aside>`
    : '';

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    ${seo(entry)}
    <meta name="theme-color" content="#d3d6ec" />
    ${HEAD_SCRIPT}
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <link rel="stylesheet" href="/src/style.css" />
  </head>
  <body>
    ${WIPE}
    <div class="device">${statusbar({ crumb: `Work / ${project.name}`, back: { href: '/#work', label: 'Work' } })}
      <main class="viewport viewport--case" id="top" tabindex="-1">
        <article class="case">
          <header class="masthead">
            <p class="masthead__file eyebrow"><span>File ${position}</span><span>${entry.status}</span></p>
            <h1 class="masthead__title" style="--n:${project.name.length}">${escapeHtml(project.name)}</h1>
          </header>
          <dl class="specs">${row('Year', project.date)}${row('Role', project.role)}${row('Stack', stack)}${row('Status', entry.status)}</dl>

          ${ceo}

          <figure class="plate plate--cover">
            ${plate({ zoom: 1, focus: entry.focus, sizes: '100vw', alt: project.imageAlt ?? '', eager: true })}
            <figcaption class="plate__caption">
              <span class="plate__fig">Fig. 01</span>
              <span class="plate__text">${escapeHtml(project.tagline)}</span>
              <button class="toggle" type="button" data-act="original"><kbd>O</kbd> <span data-original-label>Original</span></button>
            </figcaption>
          </figure>

          <section class="brief">
            <p class="eyebrow">Brief</p>
            <p class="brief__lead">${escapeHtml(project.impact)}</p>
          </section>

          <section class="chapter">
            <div class="chapter__head"><span class="chapter__no" aria-hidden="true">01</span><h2>Context</h2></div>
            <div class="chapter__body"><p class="prose">${escapeHtml(project.description)}</p></div>
          </section>

          <div class="details">
            <figure class="plate plate--a">
              ${plate({ zoom: 1.7, focus: details[0], sizes: '60vw', alt: '' })}
              <figcaption class="plate__caption"><span class="plate__fig">Fig. 02</span><span class="plate__text">Detail · x1.7</span></figcaption>
            </figure>
            <figure class="plate plate--b">
              ${plate({ zoom: 2.3, focus: details[1], sizes: '40vw', alt: '' })}
              <figcaption class="plate__caption"><span class="plate__fig">Fig. 03</span><span class="plate__text">Detail · x2.3</span></figcaption>
            </figure>
          </div>

          <section class="chapter">
            <div class="chapter__head"><span class="chapter__no" aria-hidden="true">02</span><h2>What it does</h2></div>
            <div class="chapter__body"><ol class="features">
              ${(project.features ?? []).map((feature) => `<li>${escapeHtml(feature)}</li>`).join('')}
            </ol></div>
          </section>

          <section class="chapter">
            <div class="chapter__head"><span class="chapter__no" aria-hidden="true">03</span><h2>Outcome</h2></div>
            <div class="chapter__body">
              <ul class="outcomes">${(project.outcomes ?? [project.impact]).map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
              ${links.length ? `<div class="actions">${links.join('')}</div>` : ''}
            </div>
          </section>

          <nav class="pager" aria-label="Cases">
            <a href="/work/${previous.slug}/" data-prev><span class="eyebrow">◀ Previous</span><span class="pager__name" style="--n:${previous.project.name.length}">${escapeHtml(previous.project.name)}</span></a>
            <a href="/work/${next.slug}/" data-next><span class="eyebrow">Next ▶</span><span class="pager__name" style="--n:${next.project.name.length}">${escapeHtml(next.project.name)}</span></a>
          </nav>
          <p class="ledger">© <span data-year></span> Marco Niccolini · Milano</p>
        </article>
      </main>${hints(
        [key('back', '←', 'Back'), key('prev', 'P', 'Prev'), key('next', 'N', 'Next'), key('original', 'O', 'Original'), key('skin', 'S', 'Skin'), key('theme', 'T', 'Theme')].join(''),
      )}
    </div>
    ${FX}
    <script type="module" src="/src/case.ts"></script>
  </body>
</html>
`;
}

cases.forEach((entry, i) => {
  const next = cases[(i + 1) % cases.length];
  const previous = cases[(i - 1 + cases.length) % cases.length];
  const dir = join(root, 'work', entry.slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), page(entry, previous, next));
  console.log(`work/${entry.slug}/index.html`);
});

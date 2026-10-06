/**
 * Writes one static page per case into work/<slug>/index.html (generated, not committed).
 * Runs before dev and build: npm run cases. Node strips the types, no build step needed.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SITE_URL, cases, type Case } from '../src/content.ts';
import { escapeHtml, picture } from '../src/core/media.ts';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const BASE = '/';

const CURTAIN_SCRIPT = `<script>
      try {
        const curtain = sessionStorage.getItem('tracciato:curtain');
        if (curtain) {
          sessionStorage.removeItem('tracciato:curtain');
          document.documentElement.dataset.curtain = '';
          document.documentElement.style.setProperty('--curtain', curtain);
        }
      } catch {}
    </script>`;

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

function page(entry: Case, next: Case) {
  const { project } = entry;
  const outcomes = project.outcomes ?? [project.impact];
  const [lead, ...rest] = outcomes;
  const links = [
    project.liveUrl && `<a class="button" href="${project.liveUrl}" target="_blank" rel="noreferrer">Visit ${escapeHtml(project.name)}</a>`,
    project.githubUrl && `<a class="button button--ghost" href="${project.githubUrl}" target="_blank" rel="noreferrer">Source</a>`,
  ].filter(Boolean);

  return `<!doctype html>
<html lang="en" style="--case-bg: ${entry.color}; --case-ink: ${entry.ink}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    ${seo(entry)}
    <meta name="theme-color" content="${entry.color}" />
    ${CURTAIN_SCRIPT}
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <link rel="stylesheet" href="/src/style.css" />
  </head>
  <body>
    <div class="curtain" aria-hidden="true"></div>

    <header class="masthead" data-name="Masthead">
      <a class="masthead__name" href="${BASE}">Marco Niccolini</a>
      <nav aria-label="Primary">
        <a href="${BASE}#work" aria-current="page">Work</a>
        <a href="${BASE}#semantics">Semantics</a>
        <a href="${BASE}#about">About</a>
        <a href="${BASE}#contact">Contact</a>
      </nav>
    </header>

    <main>
      <section class="case-hero" data-section-theme="case" data-name="Case hero">
        <h1 class="display case-hero__title" style="--chars: ${project.name.length}">${escapeHtml(project.name)}</h1>
        <p class="case-hero__tagline">${escapeHtml(project.tagline)}</p>
        <dl class="case-meta">
          <div><dt class="mono">Year</dt><dd>${escapeHtml(project.date)}</dd></div>
          <div><dt class="mono">Role</dt><dd>${escapeHtml(project.role)}</dd></div>
          <div><dt class="mono">Built with</dt><dd>${project.tags.filter((tag) => tag !== 'Semantics').map(escapeHtml).join(', ')}</dd></div>
          <div><dt class="mono">Status</dt><dd>${entry.status}</dd></div>
        </dl>
      </section>

      <figure class="case-cover" data-section-theme="dark" data-name="Cover" data-nav-ink="var(--paper)">
        ${picture({ media: entry.media, alt: project.imageAlt ?? '', sizes: '100vw', focus: entry.focus, eager: true })}
      </figure>

      <section class="case-statement" data-section-theme="dark" data-name="Statement">
        <p data-words>${escapeHtml(project.impact)}</p>
      </section>

      <section class="case-block case-block--first" data-section-theme="paper" data-name="Context">
        <h2 data-reveal>Context</h2>
        <div class="case-block__body">
          <p data-reveal>${escapeHtml(project.description)}</p>
        </div>
      </section>

      <section class="case-block" data-section-theme="paper" data-name="Features">
        <h2 data-reveal>What it does</h2>
        <div class="case-block__body">
          <ol class="features" data-reveal>
            ${(project.features ?? []).map((feature) => `<li>${escapeHtml(feature)}</li>`).join('\n            ')}
          </ol>
        </div>
      </section>

      <section class="case-duo" data-section-theme="paper" data-name="Detail">
        <div class="case-duo__note" data-reveal data-nav-ink="var(--case-ink)">
          <span class="mono">${escapeHtml(project.name)}</span>
          <p>${escapeHtml(lead)}</p>
        </div>
        <figure data-clip data-clip-scale="1.5" data-nav-ink="var(--paper)">
          ${picture({ media: entry.media, alt: '', sizes: '(max-width: 760px) 100vw, 50vw', focus: entry.focus })}
        </figure>
      </section>

      <section class="case-block case-block--first" data-section-theme="case" data-name="Outcome">
        <h2 data-reveal>Outcome</h2>
        <div class="case-block__body">
          ${rest.length ? `<ul class="outcomes">${rest.map((item) => `<li data-reveal>${escapeHtml(item)}</li>`).join('')}</ul>` : ''}
          ${links.length ? `<div class="case-actions" data-reveal>${links.join('')}</div>` : ''}
        </div>
      </section>

      <a class="next" href="${BASE}work/${next.slug}/" data-color="${next.color}" data-ink="${next.ink}"
        data-cursor="Next case" data-section-theme="dark" data-name="Next" data-nav-ink="${next.ink}"
        style="--next-bg: ${next.color}; --next-ink: ${next.ink}">
        <span class="next__label mono">Next departure</span>
        <div>
          <p class="next__name" style="--chars: ${next.project.name.length}">${escapeHtml(next.project.name)}</p>
          <footer class="ledger mono">
            <span>© <span data-year></span> Marco Niccolini</span>
            <span>Milano <time data-clock></time></span>
          </footer>
        </div>
      </a>
    </main>

    <div class="blueprint-grid" aria-hidden="true"></div>
    <script type="module" src="/src/case.ts"></script>
  </body>
</html>
`;
}

cases.forEach((entry, i) => {
  const next = cases[(i + 1) % cases.length];
  const dir = join(root, 'work', entry.slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), page(entry, next));
  console.log(`work/${entry.slug}/index.html`);
});

import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  FOUNDER_LABEL,
  PERSON_NAME,
  ROLE_LABEL,
  SEMANTICS_URL,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TITLE,
  SITE_URL,
  SOCIAL_LINKS,
} from '../src/config/site.ts';
import { projects } from '../src/data/projects.ts';
import { getProjectSlug } from '../src/utils/project-display.ts';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectDirectory = path.resolve(scriptDirectory, '..');
const outputDirectory = path.join(projectDirectory, 'dist');
const indexPath = path.join(outputDirectory, 'index.html');
const PERSON_ID = `${SITE_URL}/#person`;
const WEBSITE_ID = `${SITE_URL}/#website`;
const DEFAULT_IMAGE = `${SITE_URL}/og-cover.png`;

function projectPath(project) {
  return `/projects/${getProjectSlug(project.name)}/`;
}

function absoluteUrl(value) {
  return new URL(value, `${SITE_URL}/`).href;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function trimDescription(value, limit = 158) {
  if (value.length <= limit) return value;
  const clipped = value.slice(0, limit + 1);
  const lastSpace = clipped.lastIndexOf(' ');
  return `${clipped.slice(0, lastSpace > 110 ? lastSpace : limit).replace(/[.,;:]$/, '')}…`;
}

function personSchema() {
  return {
    '@type': 'Person',
    '@id': PERSON_ID,
    name: PERSON_NAME,
    url: `${SITE_URL}/`,
    jobTitle: [ROLE_LABEL, FOUNDER_LABEL],
    description: SITE_DESCRIPTION,
    worksFor: { '@type': 'Organization', name: 'Semantics', url: SEMANTICS_URL },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Milano',
      addressRegion: 'Lombardia',
      addressCountry: 'IT',
    },
    sameAs: SOCIAL_LINKS.map((link) => link.href),
    knowsAbout: ['React', 'TypeScript', 'Next.js', 'Node.js', 'PostgreSQL', 'Solidity', 'Product Engineering'],
  };
}

function homeSchema() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfilePage',
        '@id': `${SITE_URL}/#profile`,
        url: `${SITE_URL}/`,
        name: SITE_TITLE,
        description: SITE_DESCRIPTION,
        mainEntity: { '@id': PERSON_ID },
        isPartOf: { '@id': WEBSITE_ID },
      },
      personSchema(),
      {
        '@type': 'WebSite',
        '@id': WEBSITE_ID,
        url: `${SITE_URL}/`,
        name: PERSON_NAME,
        alternateName: SITE_NAME,
        inLanguage: 'en',
        publisher: { '@id': PERSON_ID },
      },
      {
        '@type': 'ItemList',
        '@id': `${SITE_URL}/#selected-work`,
        name: `Selected work by ${PERSON_NAME}`,
        numberOfItems: projects.length,
        itemListElement: projects.map((project, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: project.name,
          url: absoluteUrl(projectPath(project)),
        })),
      },
    ],
  };
}

function projectSeo(project) {
  const url = absoluteUrl(projectPath(project));
  const image = project.imageUrl ? absoluteUrl(project.imageUrl) : DEFAULT_IMAGE;
  return {
    title: `${project.name} — ${project.tagline} | ${PERSON_NAME}`,
    description: trimDescription(`${project.name} case study by ${PERSON_NAME} — ${project.tagline}. ${project.impact}`),
    url,
    image,
    imageType: project.imageUrl?.endsWith('.jpg') ? 'image/jpeg' : 'image/png',
    imageWidth: project.imageUrl ? '1448' : '1200',
    imageHeight: project.imageUrl ? '1086' : '630',
  };
}

function projectSchema(project) {
  const seo = projectSeo(project);
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CreativeWork',
        '@id': `${seo.url}#project`,
        url: seo.url,
        name: project.name,
        headline: project.tagline,
        description: project.description,
        image: seo.image,
        dateCreated: project.date,
        creator: { '@id': PERSON_ID },
        keywords: project.tags.join(', '),
        mainEntityOfPage: seo.url,
        isPartOf: { '@id': WEBSITE_ID },
        ...(project.liveUrl ? { sameAs: project.liveUrl } : {}),
      },
      personSchema(),
      {
        '@type': 'WebSite',
        '@id': WEBSITE_ID,
        url: `${SITE_URL}/`,
        name: PERSON_NAME,
        inLanguage: 'en',
      },
    ],
  };
}

function replaceTitle(html, title) {
  return html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(title)}</title>`);
}

function replaceMeta(html, attribute, key, content) {
  const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`<meta\\b(?=[^>]*\\b${attribute}=["']${escapedKey}["'])[^>]*>`, 'i');
  const tag = `<meta ${attribute}="${escapeHtml(key)}" content="${escapeHtml(content)}" />`;
  return pattern.test(html) ? html.replace(pattern, tag) : html.replace('</head>', `    ${tag}\n  </head>`);
}

function replaceCanonical(html, url) {
  const tag = `<link rel="canonical" href="${escapeHtml(url)}" />`;
  return html.replace(/<link\b(?=[^>]*\brel=["']canonical["'])[^>]*>/i, tag);
}

function replacePreload(html, image) {
  const tag = `<link rel="preload" as="image" href="${escapeHtml(image)}" fetchpriority="high" />`;
  return html.replace(/<link\b(?=[^>]*\brel=["']preload["'])(?=[^>]*\bas=["']image["'])[^>]*>/i, tag);
}

function replaceSchema(html, schema) {
  const json = JSON.stringify(schema).replaceAll('<', '\\u003c');
  return html.replace(
    /<script\b[^>]*id=["']structured-data["'][^>]*>[\s\S]*?<\/script>/i,
    `<script id="structured-data" type="application/ld+json">${json}</script>`,
  );
}

function fallbackStyles() {
  return `<style data-seo-fallback>
    .seo-fallback{box-sizing:border-box;min-height:100vh;padding:clamp(2rem,6vw,6rem);background:#131515;color:#fffafb;font:400 1rem/1.65 Arial,sans-serif}
    .seo-fallback *{box-sizing:border-box}.seo-fallback h1,.seo-fallback h2{max-width:18ch;margin:0;font-family:Georgia,serif;font-weight:400;line-height:.98}
    .seo-fallback h1{font-size:clamp(3.5rem,10vw,9rem)}.seo-fallback h2{margin-top:5rem;font-size:clamp(2rem,5vw,4rem)}
    .seo-fallback p,.seo-fallback ul{max-width:70ch}.seo-fallback a{color:#7de2d1}.seo-fallback ul{padding-left:1.2rem}
    .seo-fallback__meta{font:400 .75rem/1.5 monospace;letter-spacing:.08em;text-transform:uppercase;color:#7de2d1}
  </style>`;
}

function homeFallback() {
  const projectLinks = projects
    .map((project) => `<li><a href="${escapeHtml(projectPath(project))}">${escapeHtml(project.name)}</a> — ${escapeHtml(project.tagline)}</li>`)
    .join('');
  return `<main class="seo-fallback">
    <p class="seo-fallback__meta">Full-Stack Developer · Milano, Italy</p>
    <h1>${escapeHtml(PERSON_NAME)}</h1>
    <p>${escapeHtml(SITE_DESCRIPTION)}</p>
    <section aria-labelledby="seo-selected-work"><h2 id="seo-selected-work">Selected work</h2><ul>${projectLinks}</ul></section>
    <p><a href="${escapeHtml(SEMANTICS_URL)}">Semantics</a> · <a href="${escapeHtml(SOCIAL_LINKS[0].href)}">GitHub</a> · <a href="${escapeHtml(SOCIAL_LINKS[1].href)}">LinkedIn</a></p>
  </main>`;
}

function projectFallback(project) {
  const outcomes = (project.outcomes?.length ? project.outcomes : [project.impact])
    .map((outcome) => `<li>${escapeHtml(outcome)}</li>`)
    .join('');
  const features = (project.features ?? []).map((feature) => `<li>${escapeHtml(feature)}</li>`).join('');
  const externalLinks = [
    project.liveUrl ? `<a href="${escapeHtml(project.liveUrl)}">Live site</a>` : '',
    project.githubUrl ? `<a href="${escapeHtml(project.githubUrl)}">Source code</a>` : '',
  ].filter(Boolean).join(' · ');
  return `<main class="seo-fallback">
    <p class="seo-fallback__meta">${escapeHtml(project.role)} · ${escapeHtml(project.date)} · ${escapeHtml(project.tags.join(' · '))}</p>
    <h1>${escapeHtml(project.name)}</h1>
    <p>${escapeHtml(project.tagline)}</p>
    <p>${escapeHtml(project.description)}</p>
    <section><h2>What changed</h2><ul>${outcomes}</ul></section>
    <section><h2>The build</h2><ul>${features}</ul></section>
    <p>${externalLinks}</p>
    <p><a href="/">Back to ${escapeHtml(PERSON_NAME)}'s portfolio</a></p>
  </main>`;
}

function replaceFallback(html, fallback) {
  const withStyles = html.replace('</head>', `    ${fallbackStyles()}\n  </head>`);
  return withStyles.replace('<div id="root"></div>', `<div id="root">${fallback}</div>`);
}

function renderPage(template, project = null) {
  const seo = project
    ? projectSeo(project)
    : {
        title: SITE_TITLE,
        description: SITE_DESCRIPTION,
        url: `${SITE_URL}/`,
        image: DEFAULT_IMAGE,
        imageType: 'image/png',
        imageWidth: '1200',
        imageHeight: '630',
      };

  let html = replaceTitle(template, seo.title);
  html = replaceCanonical(html, seo.url);
  html = replacePreload(html, project?.imageUrl ?? '/assets/projects/quantara.jpg');
  html = replaceMeta(html, 'name', 'description', seo.description);
  html = replaceMeta(html, 'name', 'robots', 'index, follow, max-image-preview:large');
  html = replaceMeta(html, 'property', 'og:type', project ? 'article' : 'profile');
  html = replaceMeta(html, 'property', 'og:site_name', PERSON_NAME);
  html = replaceMeta(html, 'property', 'og:url', seo.url);
  html = replaceMeta(html, 'property', 'og:title', seo.title);
  html = replaceMeta(html, 'property', 'og:description', seo.description);
  html = replaceMeta(html, 'property', 'og:image', seo.image);
  html = replaceMeta(html, 'property', 'og:image:secure_url', seo.image);
  html = replaceMeta(html, 'property', 'og:image:type', seo.imageType);
  html = replaceMeta(html, 'property', 'og:image:width', seo.imageWidth);
  html = replaceMeta(html, 'property', 'og:image:height', seo.imageHeight);
  html = replaceMeta(html, 'property', 'og:image:alt', project?.imageAlt ?? `Portfolio of ${PERSON_NAME}`);
  html = replaceMeta(html, 'name', 'twitter:title', seo.title);
  html = replaceMeta(html, 'name', 'twitter:description', seo.description);
  html = replaceMeta(html, 'name', 'twitter:image', seo.image);
  html = replaceMeta(html, 'name', 'twitter:image:alt', project?.imageAlt ?? `Portfolio of ${PERSON_NAME}`);
  html = replaceSchema(html, project ? projectSchema(project) : homeSchema());
  return replaceFallback(html, project ? projectFallback(project) : homeFallback());
}

async function contentDate() {
  const files = [
    path.join(projectDirectory, 'index.html'),
    path.join(projectDirectory, 'src', 'config', 'site.ts'),
    path.join(projectDirectory, 'src', 'data', 'projects.ts'),
  ];
  const stats = await Promise.all(files.map((file) => stat(file)));
  return new Date(Math.max(...stats.map((entry) => entry.mtimeMs))).toISOString().slice(0, 10);
}

async function writeSitemap(lastModified) {
  const urls = [`${SITE_URL}/`, ...projects.map((project) => absoluteUrl(projectPath(project)))];
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url><loc>${escapeHtml(url)}</loc><lastmod>${lastModified}</lastmod></url>`).join('\n')}
</urlset>
`;
  await writeFile(path.join(outputDirectory, 'sitemap.xml'), sitemap, 'utf8');
}

const template = await readFile(indexPath, 'utf8');
await writeFile(indexPath, renderPage(template), 'utf8');

for (const project of projects) {
  const projectOutput = path.join(outputDirectory, 'projects', getProjectSlug(project.name));
  await mkdir(projectOutput, { recursive: true });
  await writeFile(path.join(projectOutput, 'index.html'), renderPage(template, project), 'utf8');
}

await writeSitemap(await contentDate());
console.log(`Generated ${projects.length + 1} indexable pages and sitemap.xml`);

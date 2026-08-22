import { useEffect } from 'react';
import {
  FOUNDER_LABEL,
  LOCATION_LABEL,
  PERSON_NAME,
  ROLE_LABEL,
  SEMANTICS_URL,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TITLE,
  SITE_URL,
  SOCIAL_LINKS,
} from '../config/site';
import { projects, type Project } from '../data/projects';
import { getProjectPath } from '../utils/project-display';

const DEFAULT_SOCIAL_IMAGE = `${SITE_URL}/og-cover.png`;
const PERSON_ID = `${SITE_URL}/#person`;
const WEBSITE_ID = `${SITE_URL}/#website`;

function absoluteUrl(path: string) {
  return new URL(path, `${SITE_URL}/`).href;
}

function trimDescription(value: string, limit = 158) {
  if (value.length <= limit) return value;

  const clipped = value.slice(0, limit + 1);
  const lastSpace = clipped.lastIndexOf(' ');
  return `${clipped.slice(0, lastSpace > 110 ? lastSpace : limit).replace(/[.,;:]$/, '')}…`;
}

export function getProjectSeo(project: Project) {
  const url = absoluteUrl(getProjectPath(project.name));
  const image = project.imageUrl ? absoluteUrl(project.imageUrl) : DEFAULT_SOCIAL_IMAGE;
  const title = `${project.name} — ${project.tagline} | ${PERSON_NAME}`;
  const description = trimDescription(
    `${project.name} case study by ${PERSON_NAME} — ${project.tagline}. ${project.impact}`,
  );

  return { title, description, url, image };
}

function personSchema() {
  return {
    '@type': 'Person',
    '@id': PERSON_ID,
    name: PERSON_NAME,
    url: `${SITE_URL}/`,
    jobTitle: [ROLE_LABEL, FOUNDER_LABEL],
    description: SITE_DESCRIPTION,
    worksFor: {
      '@type': 'Organization',
      name: 'Semantics',
      url: SEMANTICS_URL,
    },
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
          url: absoluteUrl(getProjectPath(project.name)),
        })),
      },
    ],
  };
}

function projectSchema(project: Project) {
  const seo = getProjectSeo(project);

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

function setMeta(attribute: 'name' | 'property', key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);

  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }

  element.content = content;
}

function setCanonical(url: string) {
  let element = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');

  if (!element) {
    element = document.createElement('link');
    element.rel = 'canonical';
    document.head.appendChild(element);
  }

  element.href = url;
}

export function usePageSeo(project: Project | null) {
  useEffect(() => {
    const seo = project
      ? getProjectSeo(project)
      : {
          title: SITE_TITLE,
          description: SITE_DESCRIPTION,
          url: `${SITE_URL}/`,
          image: DEFAULT_SOCIAL_IMAGE,
        };

    document.title = seo.title;
    document.documentElement.lang = 'en';
    setCanonical(seo.url);
    setMeta('name', 'description', seo.description);
    setMeta('name', 'author', PERSON_NAME);
    setMeta('name', 'robots', 'index, follow, max-image-preview:large');
    setMeta('property', 'og:type', project ? 'article' : 'profile');
    setMeta('property', 'og:site_name', PERSON_NAME);
    setMeta('property', 'og:locale', 'en_US');
    setMeta('property', 'og:title', seo.title);
    setMeta('property', 'og:description', seo.description);
    setMeta('property', 'og:url', seo.url);
    setMeta('property', 'og:image', seo.image);
    setMeta('property', 'og:image:alt', project?.imageAlt ?? `Portfolio of ${PERSON_NAME}, ${LOCATION_LABEL}`);
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', seo.title);
    setMeta('name', 'twitter:description', seo.description);
    setMeta('name', 'twitter:image', seo.image);
    setMeta('name', 'twitter:image:alt', project?.imageAlt ?? `Portfolio of ${PERSON_NAME}`);

    let schema = document.head.querySelector<HTMLScriptElement>('#structured-data');
    if (!schema) {
      schema = document.createElement('script');
      schema.id = 'structured-data';
      schema.type = 'application/ld+json';
      document.head.appendChild(schema);
    }
    schema.textContent = JSON.stringify(project ? projectSchema(project) : homeSchema());
  }, [project]);
}

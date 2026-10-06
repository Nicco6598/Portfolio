import { projects, type Project } from './data/projects.ts';

/**
 * The curated set: only work that fits the manifesto — messy, critical operations
 * turned into software people rely on. The rest of the archive is left out on purpose.
 */
export interface Case {
  slug: string;
  project: Project;
  status: 'In service' | 'Live' | 'Private';
  /** Case colour block; the page transition uses the same colour. */
  color: string;
  ink: string;
  media: string;
  /** Focal point for crops of the single cover image. */
  focus: string;
}

const CURATED: Array<Omit<Case, 'project'> & { id: string }> = [
  // Quantara is a Semantics product: it wears the company's red.
  { id: '01', slug: 'quantara', status: 'In service', color: '#b52e27', ink: '#f4f1eb', media: 'quantara', focus: '62% 70%' },
  { id: '02', slug: 'halion', status: 'Private', color: '#1c2a33', ink: '#edebe6', media: 'halion', focus: '50% 45%' },
  { id: '04', slug: 'scandellari', status: 'Live', color: '#c9c4b8', ink: '#0b0b0a', media: 'scandellari', focus: '48% 60%' },
  { id: '10', slug: 'bombyx', status: 'Live', color: '#8fd3c8', ink: '#0b0b0a', media: 'bombyx', focus: '50% 55%' },
];

export const cases: Case[] = CURATED.map(({ id, ...rest }) => {
  const project = projects.find((candidate) => candidate.id === id);
  if (!project) throw new Error(`Unknown project ${id}`);
  return { ...rest, project };
});

export const SITE_URL = 'https://www.marconiccolini.com';

export const caseHref = (slug: string) => `/work/${slug}/`;

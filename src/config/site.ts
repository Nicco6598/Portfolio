export interface NavItem {
  label: string;
  href: `#${string}`;
  sectionId: string;
}

export interface CvOption {
  label: string;
  shortLabel: string;
  href: string;
  tone: 'accent' | 'muted';
}

export interface SocialLink {
  label: string;
  href: string;
}

export const PERSON_NAME = 'Marco Niccolini';
export const SITE_NAME = 'MN.';
export const SITE_TITLE = `${PERSON_NAME} | Full-Stack Software Developer`;
export const SITE_DESCRIPTION = 'Full-stack software developer building fast, polished web experiences with React, Next.js, Node.js, and TypeScript.';
export const LOCATION_LABEL = 'Pioltello (MI), Italy';
export const AVAILABILITY_LABEL = 'Open to freelance projects and opportunities';
export const CORE_FOCUS_LABEL = 'React, Next.js, Node.js, TypeScript';

export const NAV_ITEMS: NavItem[] = [
  { label: 'Works', href: '#works', sectionId: 'works' },
  { label: 'About', href: '#about', sectionId: 'about' },
  { label: 'Contact', href: '#contact', sectionId: 'contact' },
];

export const SECTION_IDS = NAV_ITEMS.map((item) => item.sectionId);

export const CV_OPTIONS: CvOption[] = [
  {
    label: 'English',
    shortLabel: 'CV (EN)',
    href: '/assets/Marco_Niccolini_CV_2026(EN).pdf',
    tone: 'accent',
  },
  {
    label: 'Italiano',
    shortLabel: 'CV (IT)',
    href: '/assets/Marco_Niccolini_CV_2026(IT).pdf',
    tone: 'muted',
  },
];

export const EMAIL = 'nicco6598@gmail.com';

export const SOCIAL_LINKS: SocialLink[] = [
  { label: 'GitHub', href: 'https://github.com/Nicco6598' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/marconiccolini-/' },
];

export const CURRENT_YEAR = new Date().getFullYear();

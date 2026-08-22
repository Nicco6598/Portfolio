const BRAND_ACCENT = '#ED4642';

const NON_ALPHANUMERIC_PATTERN = /[^A-Za-z0-9\s]/g;
const MULTISPACE_PATTERN = /\s+/g;

export function getProjectAccent(projectId: string) {
  void projectId;
  return BRAND_ACCENT;
}

export function getProjectInitials(name: string) {
  const normalizedName = name.replace(NON_ALPHANUMERIC_PATTERN, ' ').trim();
  const words = normalizedName.split(/\s+/).filter(Boolean);

  if (words.length === 0) {
    return name.slice(0, 2).toUpperCase();
  }

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return `${words[0][0]}${words[1][0]}`.toUpperCase();
}

export function getProjectSlug(name: string) {
  const normalizedName = name
    .replace(NON_ALPHANUMERIC_PATTERN, ' ')
    .trim()
    .replace(MULTISPACE_PATTERN, '-')
    .toLowerCase();

  return normalizedName || 'project';
}

export function getProjectPath(name: string) {
  return `/projects/${getProjectSlug(name)}/`;
}

const PROJECT_ACCENTS = [
  '#FF4D00',
  '#E76F51',
  '#2A9D8F',
  '#3A86FF',
  '#8B5CF6',
  '#F4A261',
  '#06B6D4',
  '#EF476F',
] as const;

const NON_ALPHANUMERIC_PATTERN = /[^A-Za-z0-9\s]/g;

export function getProjectAccent(projectId: string) {
  const numericId = Number.parseInt(projectId, 10);

  if (!Number.isNaN(numericId)) {
    return PROJECT_ACCENTS[(numericId - 1) % PROJECT_ACCENTS.length];
  }

  return PROJECT_ACCENTS[0];
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

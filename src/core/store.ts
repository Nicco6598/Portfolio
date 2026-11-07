/** localStorage that never throws: private windows and blocked storage just forget. */
export const read = (key: string) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

export const write = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Nothing to do: the setting lasts for this page only.
  }
};

export const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

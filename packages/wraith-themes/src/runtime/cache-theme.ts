import type { WraithTheme }
  from '../types/theme';

import { STORAGE_KEYS }
  from '../constants/storage';

export function cacheTheme(
  theme: WraithTheme,
  url: string
) {
  localStorage.setItem(
    STORAGE_KEYS.theme,
    JSON.stringify(theme)
  );

  localStorage.setItem(
    STORAGE_KEYS.themeUrl,
    url
  );
}

export function getCachedTheme() {
  const cached =
    localStorage.getItem(
      STORAGE_KEYS.theme
    );

  if (!cached) {
    return null;
  }

  try {
    return JSON.parse(
      cached
    ) as WraithTheme;
  } catch {
    return null;
  }
}

export function getCachedThemeUrl() {
  return localStorage.getItem(
    STORAGE_KEYS.themeUrl
  );
}
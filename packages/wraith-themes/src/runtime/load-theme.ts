import defaultTheme
  from '../themes/default.json';

import { applyTheme }
  from './apply-theme';

import {
  getCachedTheme,
  getCachedThemeUrl,
  cacheTheme,
} from './cache-theme';

import { fetchTheme }
  from './fetch-theme';

const DEFAULT_THEME_URL =
  'https://tweakcn.com/r/themes/amber-minimal.json';

export async function loadTheme() {
  const cachedTheme =
    getCachedTheme();

  if (cachedTheme) {
    applyTheme(cachedTheme);

    const cachedUrl =
      getCachedThemeUrl();

    if (!cachedUrl) {
      return;
    }

    try {
      const freshTheme =
        await fetchTheme(
          cachedUrl
        );

      cacheTheme(
        freshTheme,
        cachedUrl
      );

      applyTheme(freshTheme);
    } catch {
      console.error(
        'Theme refresh failed'
      );
    }

    return;
  }

  try {
    const remoteTheme =
      await fetchTheme(
        DEFAULT_THEME_URL
      );

    cacheTheme(
      remoteTheme,
      DEFAULT_THEME_URL
    );

    applyTheme(remoteTheme);

    return;
  } catch {
    console.error(
      'Remote theme failed'
    );
  }

  applyTheme(defaultTheme);
}
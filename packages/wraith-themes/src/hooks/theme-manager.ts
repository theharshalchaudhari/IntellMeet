import { THEMES } from '../registry/theme-urls';

import { applyTheme } from '../runtime/apply-theme';
import { cacheTheme } from '../runtime/cache-theme';
import { fetchTheme } from '../runtime/fetch-theme';

async function setTheme(
  themeName: keyof typeof THEMES
) {
  try {
    const url = THEMES[themeName];

    const theme = await fetchTheme(url);

    cacheTheme(theme, url);

    applyTheme(theme);
  } catch (error) {
    console.error(
      'theme-manager.ts: Failed to apply theme',
      error
    );
  }
}

export const themeManager = {
  setTheme,
  themes: THEMES,
};
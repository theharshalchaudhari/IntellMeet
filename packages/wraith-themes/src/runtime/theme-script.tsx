import { STORAGE_KEYS }
  from '../constants/storage';

export const THEME_SCRIPT = `
try {
  const cachedTheme =
    localStorage.getItem(
      '${STORAGE_KEYS.theme}'
    );

  if (cachedTheme) {
    const theme =
      JSON.parse(cachedTheme);

    const isDark =
      window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches;

    const mode =
      isDark ? 'dark' : 'light';

    const vars = {
      ...theme.cssVars.theme,
      ...theme.cssVars[mode],
    };

    for (const [key, value]
      of Object.entries(vars)
    ) {
      document.documentElement.style.setProperty(
        '--' + key,
        value
      );
    }
  }
} catch {}
`;
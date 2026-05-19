import { THEMES }
  from '../registry/theme-urls';

import { cacheTheme }
  from '../runtime/cache-theme';

import { convertThemeToCss }
  from '../runtime/convert-theme';

let activeRequestId = 0;

async function fetchTheme(
  url: string
) {
  const response =
    await fetch(url);

  if (!response.ok) {
    throw new Error(
      'Theme fetch failed'
    );
  }

  return response.json();
}

function injectTheme(
  css: string
) {
  const existing =
    document.getElementById(
      'wraith-theme'
    );

  if (existing) {
    existing.remove();
  }

  const style =
    document.createElement('style');

  style.id = 'wraith-theme';

  style.textContent = css;

  document.head.appendChild(
    style
  );
}

export const themeManager = {
  async setTheme(
    themeName: keyof typeof THEMES
  ) {
    const requestId =
      ++activeRequestId;

    const url =
      THEMES[themeName];

    try {
      const theme =
        await fetchTheme(url);

      if (
        requestId !==
        activeRequestId
      ) {
        return;
      }

      const css =
        convertThemeToCss(
          theme
        );

      injectTheme(css);

      cacheTheme(css, url);
    } catch (error) {
      console.error(error);
    }
  },

  themes: THEMES,
};
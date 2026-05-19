import { THEMES }
  from '../registry/theme-urls';

import {
  cacheTheme,
  getCachedThemeCss,
  getCachedThemeUrl,
} from './cache-theme';

import { convertThemeToCss }
  from './convert-theme';

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

export async function loadTheme() {
  const cachedCss =
    getCachedThemeCss();

  const cachedUrl =
    getCachedThemeUrl();

  if (cachedCss) {
    injectTheme(cachedCss);
  }

  if (cachedUrl) {
    try {
      const theme =
        await fetchTheme(
          cachedUrl
        );

      const css =
        convertThemeToCss(
          theme
        );

      injectTheme(css);

      cacheTheme(
        css,
        cachedUrl
      );

      return;
    } catch (error) {
      console.error(error);
    }
  }

  try {
    const defaultThemeUrl =
      THEMES.default;

    const theme =
      await fetchTheme(
        defaultThemeUrl
      );

    const css =
      convertThemeToCss(
        theme
      );

    injectTheme(css);

    cacheTheme(
      css,
      defaultThemeUrl
    );
  } catch (error) {
    console.error(error);
  }
}
import { STORAGE_KEYS }
  from '../constants/storage';

export function cacheTheme(
  css: string,
  url: string
) {
  localStorage.setItem(
    STORAGE_KEYS.themeCss,
    css
  );

  localStorage.setItem(
    STORAGE_KEYS.themeUrl,
    url
  );
}

export function getCachedThemeCss() {
  return localStorage.getItem(
    STORAGE_KEYS.themeCss
  );
}

export function getCachedThemeUrl() {
  return localStorage.getItem(
    STORAGE_KEYS.themeUrl
  );
}
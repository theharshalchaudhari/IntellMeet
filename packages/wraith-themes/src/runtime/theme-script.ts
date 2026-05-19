import { STORAGE_KEYS }
  from '../constants/storage';

export const THEME_SCRIPT = `
try {
  const cachedCss =
    localStorage.getItem(
      '${STORAGE_KEYS.themeCss}'
    );

  if (cachedCss) {
    const style =
      document.createElement('style');

    style.id = 'wraith-theme';

    style.textContent = cachedCss;

    document.head.appendChild(style);
  }
} catch {}
`;
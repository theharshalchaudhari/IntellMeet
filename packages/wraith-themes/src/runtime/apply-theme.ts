import type { WraithTheme } from '../types/theme';

import { injectThemeVars } from './inject-theme';
import { resolveThemeMode } from './resolve-theme-mode';
import { enableThemeTransition } from './transition-theme';

export function applyTheme(theme: WraithTheme) {
  enableThemeTransition();

  const mode = resolveThemeMode();

  const vars = {
    ...theme.cssVars.theme,
    ...theme.cssVars[mode],
  };

  injectThemeVars(vars);
}
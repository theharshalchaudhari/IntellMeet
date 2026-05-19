export type ThemeMode = 'light' | 'dark';

export type ThemeCssVars = {
  light?: Record<string, string>;
  dark?: Record<string, string>;
  theme?: Record<string, string>;
};

export type WraithTheme = {
  name?: string;
  cssVars: ThemeCssVars;
};

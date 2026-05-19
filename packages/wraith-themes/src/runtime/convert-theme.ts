type ThemeJson = {
  cssVars?: {
    light?: Record<string, string>;

    dark?: Record<string, string>;

    theme?: Record<string, string>;
  };
};

export function convertThemeToCss(
  theme: ThemeJson
) {
  const themeVars =
    theme.cssVars?.theme ?? {};

  const lightVars =
    theme.cssVars?.light ?? {};

  const darkVars =
    theme.cssVars?.dark ?? {};

  const rootCss =
    Object.entries({
      ...themeVars,
      ...lightVars,
    })
      .map(
        ([key, value]) =>
          `--${key}: ${value};`
      )
      .join('\n');

  const darkCss =
    Object.entries({
      ...themeVars,
      ...darkVars,
    })
      .map(
        ([key, value]) =>
          `--${key}: ${value};`
      )
      .join('\n');

  return `
:root {
${rootCss}
}

.dark {
${darkCss}
}
`;
}
export function injectThemeVars(
  vars: Record<string, string>
) {
  for (const [key, value] of Object.entries(vars)) {
    document.documentElement.style.setProperty(
      `--${key}`,
      value
    );
  }
}
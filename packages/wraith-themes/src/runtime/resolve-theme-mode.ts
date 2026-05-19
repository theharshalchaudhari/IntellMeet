export function resolveThemeMode() {
  return document.documentElement.classList.contains(
    'dark'
  )
    ? 'dark'
    : 'light';
}
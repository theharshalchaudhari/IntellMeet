let transitionTimeout: number | null = null;

export function enableThemeTransition() {
  document.documentElement.classList.add(
    'theme-transition'
  );

  if (transitionTimeout) {
    window.clearTimeout(transitionTimeout);
  }

  transitionTimeout = window.setTimeout(() => {
    document.documentElement.classList.remove(
      'theme-transition'
    );
  }, 200);
}
'use client';

import { useEffect } from 'react';

import { loadTheme } from '@wraith/themes';

export function ThemeLoader() {
  useEffect(() => {
    loadTheme();
  }, []);

  return null;
}
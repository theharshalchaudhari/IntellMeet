'use client';

import { useEffect }
  from 'react';

import { loadTheme }
  from './load-theme';

export function Theme() {
  useEffect(() => {
    loadTheme();
  }, []);

  return null;
}
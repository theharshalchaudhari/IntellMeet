'use client';

import { useEffect }
  from 'react';

import { loadTheme }
  from './load-theme';

export function Theme() {
  useEffect(() => {
    // Initial load
    loadTheme();

    // BFCache restore
    const handlePageShow = () => {
      loadTheme();
    };

    window.addEventListener(
      'pageshow',
      handlePageShow
    );

    return () => {
      window.removeEventListener(
        'pageshow',
        handlePageShow
      );
    };
  }, []);

  return null;
}
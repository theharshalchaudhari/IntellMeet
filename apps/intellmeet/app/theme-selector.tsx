'use client';

import { useEffect, useState }
  from 'react';

import {
  themeManager,
} from '@wraith/themes';

const THEME_STORAGE_KEY =
  'wraith-theme-url';

export function ThemeSelector() {
  const [selectedTheme, setSelectedTheme] =
    useState('');

  useEffect(() => {
    const cachedTheme =
      localStorage.getItem(
        THEME_STORAGE_KEY
      );

    if (!cachedTheme) {
      return;
    }

    const matchedTheme =
      Object.entries(
        themeManager.themes
      ).find(
        ([, url]) =>
          url === cachedTheme
      );

    if (!matchedTheme) {
      return;
    }

    setSelectedTheme(
      matchedTheme[0]
    );
  }, []);

  return (
    <div className="fixed top-4 right-4 z-50">
      <select
        className="bg-card text-card-foreground border-border rounded-md border px-3 py-2"
        value={selectedTheme}
        onChange={async (e) => {
          const theme =
            e.target.value as Parameters<
              typeof themeManager.setTheme
            >[0];

          setSelectedTheme(theme);

          await themeManager.setTheme(
            theme
          );
        }}
      >
        {Object.keys(
          themeManager.themes
        ).map((theme) => (
          <option
            key={theme}
            value={theme}
          >
            {theme}
          </option>
        ))}
      </select>
    </div>
  );
}
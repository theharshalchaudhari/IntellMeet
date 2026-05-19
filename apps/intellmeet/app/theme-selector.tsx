'use client';

import { themeManager } from '@wraith/themes';

export function ThemeSelector() {
  return (
    <select
      className="border-border bg-background text-foreground rounded-md border px-3 py-2"
      defaultValue=""
      onChange={(e) =>
        themeManager.setTheme(
          e.target.value as Parameters<typeof themeManager.setTheme>[0]
        )
      }
    >
      <option value="" disabled>
        Select Theme
      </option>

      {Object.keys(themeManager.themes).map(
        (theme) => (
          <option
            key={theme}
            value={theme}
          >
            {theme}
          </option>
        )
      )}
    </select>
  );
}
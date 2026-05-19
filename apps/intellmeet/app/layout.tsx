import './globals.css';

import type { Metadata }
  from 'next';

import { themeFonts }
  from '@/lib/fonts';

import {
  Theme,
  THEME_SCRIPT,
} from '@wraith/themes';

import { ThemeSelector }
  from './theme-selector';

export const metadata: Metadata = {
  title: 'Intellmeet',
  description: 'Intellmeet',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: THEME_SCRIPT,
          }}
        />
      </head>

      <body className={themeFonts}>
        <Theme />

        <ThemeSelector />

        {children}
      </body>
    </html>
  );
}
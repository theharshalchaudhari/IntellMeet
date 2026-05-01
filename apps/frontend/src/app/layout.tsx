import { Geist_Mono, Poppins } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "@/providers/ThemeProvider";
import { cn } from "@/lib/utils";

import { Header } from "@/components/common/Header";
import { InteractiveGrid } from "@/components/InteractiveGrid";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        poppins.variable,
        fontMono.variable
      )}
    >
      <body className="bg-background text-foreground">

        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {/* Background Layer
          <div className="fixed inset-0 -z-10">
            <InteractiveGrid />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(76,29,149,0.1),transparent_70%)]" />
          </div> */}

          {/* Header */}
          <Header />

          {/* Main Content */}
          <main className="relative z-10 pt-24">
            {children}
          </main>

        </ThemeProvider>
      </body>
    </html>
  );
}

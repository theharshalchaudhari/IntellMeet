import { Geist_Mono, Poppins } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "@/providers/ThemeProvider";
import { cn } from "@/lib/utils";
import { Header } from "@/components/common/Header";
import { RocketPreloader } from "@/components/landing/Preloader";
import Checks from "@/components/Checks";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "900"],
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
      className={cn("antialiased", poppins.variable, fontMono.variable)}
    >
      <body className="bg-background text-foreground font-sans">
        <RocketPreloader />

        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
            <Checks interactive showMask/>


          <Header />
          <main className="relative z-10 pt-24">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
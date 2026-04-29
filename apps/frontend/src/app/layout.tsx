import { Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { InteractiveGrid } from "@/components/InteractiveGrid"; // Ensure path is correct

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased font-sans", fontMono.variable, inter.variable)}
    >
      <body className="bg-black">
        <ThemeProvider>
          {/* The background lives here, behind everything */}
          <InteractiveGrid />
          
          {/* Optional: Subtle purple glow to match the video exactly */}
          <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_50%_50%,rgba(76,29,149,0.1),transparent_75%)]" />
          
          <div className="relative z-10">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
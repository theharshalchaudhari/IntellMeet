
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";

import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";

import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuContent,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Pricing", href: "#pricing" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <nav className="fixed top-4 left-1/2 px-1 -translate-x-1/2 z-50 w-full flex justify-center">

        <div
          className={`
            transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
            w-full
            ${scrolled ? "max-w-5xl px-6" : "max-w-[95%] px-10"}
            py-3 rounded-full
            bg-background/50 backdrop-blur-3xl
            border border-border/30
            shadow-[0_8px_30px_rgba(0,0,0,0.12)]
          `}
        >
          <div className="flex items-center justify-between">

            {/* LOGO */}
            <Logo
              src="/Logo.svg"
              alt="IntellMeet"
              size={60}
              className="scale-210 ml-7"
            />

            {/* NAVIGATION MENU */}
            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList className="gap-2">

                {/* Home */}
                <NavigationMenuItem>
                  <NavigationMenuLink
                    asChild
                    className={navigationMenuTriggerStyle()}
                  >
                    <Link href="/">Home</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                {/* Demo DROPDOWN */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Demo</NavigationMenuTrigger>

                  <NavigationMenuContent>
                    <div className="grid w-[400px] grid-cols-2 gap-3 p-4">

                      <Link href="/demo/live" className="block p-3 rounded-md hover:bg-muted">
                        <p className="text-sm font-medium">Live Demo</p>
                        <p className="text-xs text-muted-foreground">
                          Join a real meeting experience
                        </p>
                      </Link>

                      <Link href="/demo/ai" className="block p-3 rounded-md hover:bg-muted">
                        <p className="text-sm font-medium">AI Assistant</p>
                        <p className="text-xs text-muted-foreground">
                          See real-time transcription
                        </p>
                      </Link>

                      <Link href="/demo/recording" className="block p-3 rounded-md hover:bg-muted">
                        <p className="text-sm font-medium">Recording</p>
                        <p className="text-xs text-muted-foreground">
                          Chunk-based recording system
                        </p>
                      </Link>

                      <Link href="/demo/analytics" className="block p-3 rounded-md hover:bg-muted">
                        <p className="text-sm font-medium">Analytics</p>
                        <p className="text-xs text-muted-foreground">
                          Meeting insights dashboard
                        </p>
                      </Link>

                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Pricing */}
                <NavigationMenuItem>
                  <NavigationMenuLink
                    asChild
                    className={navigationMenuTriggerStyle()}
                  >
                    <Link href="#pricing">Pricing</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

              </NavigationMenuList>
            </NavigationMenu>

            {/* RIGHT */}
            <div className="flex items-center gap-2">

              <Link
                href="/signup"
                className="hidden md:block bg-primary text-primary-foreground px-5 py-2 rounded-md text-sm font-semibold hover:opacity-90 transition"
              >
                Get Started
              </Link>

              <ThemeToggle />

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 rounded-full hover:bg-muted"
              >
                <Menu className="h-5 w-5" />
              </button>

            </div>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 w-[92%] max-w-sm bg-popover text-popover-foreground rounded-2xl border border-border shadow-lg z-40 md:hidden">
          <div className="flex flex-col divide-y">
            <Link href="/" className="px-6 py-4">Home</Link>
            <Link href="/demo" className="px-6 py-4">Demo</Link>
            <Link href="#pricing" className="px-6 py-4">Pricing</Link>
          </div>
        </div>
      )}
    </>
  );
}


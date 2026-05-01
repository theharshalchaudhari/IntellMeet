"use client";

import { useEffect, useRef, useState } from "react";
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

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function Header() {
  const navRef = useRef<HTMLDivElement>(null);

  const [show, setShow] = useState(true);
  const lastScroll = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const current = window.scrollY;
      if (current <= 0) setShow(true);
      else if (current > lastScroll.current) setShow(false);
      else setShow(true);
      lastScroll.current = current;
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const el = navRef.current;
    const ctx = gsap.context(() => {
      gsap.timeline({
        scrollTrigger: {
          trigger: document.body,
          start: "top top",
          end: "200 top",
          scrub: true,
        },
      })
        .to(el, { width: "1024px", paddingLeft: "1.5rem", paddingRight: "1.5rem", ease: "none" }, 0)
        .to(el, { scale: 0.95, ease: "none" }, 0);
    });
    return () => ctx.revert();
  }, []);

  return (
    <nav
      className={`
        fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full flex justify-center
        transition-transform duration-300 ease-out
        ${show ? "translate-y-0" : "-translate-y-32"}
      `}
    >
      <div ref={navRef} className="glass w-[95vw] px-10 py-3 rounded-full flex items-center justify-between will-change-[width,transform]">

        <div className="relative ml-16">

          <div 
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 rounded-full scale-100 blur-[20px] opacity-70"
            >
            <Logo src="/Logo.svg" alt="IntellMeet" size={60} className="scale-250" />
          </div>
          <Logo src="/Logo.svg" alt="IntellMeet" size={60} className="scale-250" />
        </div>

        {/* NAV */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList className="gap-2">

            <NavigationMenuItem>
              <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                <Link href="/">Home</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger>Demo</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid w-[400px] grid-cols-2 gap-3 p-4">
                  <Link href="/demo/live">Live Demo</Link>
                  <Link href="/demo/ai">AI Assistant</Link>
                  <Link href="/demo/recording">Recording</Link>
                  <Link href="/demo/analytics">Analytics</Link>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                <Link href="#pricing">Pricing</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

          </NavigationMenuList>
        </NavigationMenu>

        {/* RIGHT */}
        <div className="flex items-center gap-2">

          {/* Get Started with tight amber glow */}
          <div className="relative hidden md:block">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-primary -z-10 rounded-md blur-[18px] opacity-70"
              
            />
            <Link
              href="/signup"
              className="relative block bg-primary text-primary-foreground px-5 py-2 rounded-md text-sm font-semibold"
            >
              Get Started
            </Link>
          </div>

          <ThemeToggle />

          <button className="md:hidden p-2 rounded-full">
            <Menu className="h-5 w-5" />
          </button>

        </div>
      </div>
    </nav>
  );
}
"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { useEffect, useCallback, useRef } from "react";

export default function Lenis({ children }: { children: React.ReactNode }) {
  const lenis = useLenis();
  const tickerCallbackRef = useRef<((time: number) => void) | null>(null);
  const gsapLoadedRef = useRef(false);

  useEffect(() => {
    if (!lenis || gsapLoadedRef.current) return;

    const loadGsap = async () => {
      try {
        const gsap = await import("gsap");
        const { ScrollTrigger } = await import("gsap/ScrollTrigger");

        if (typeof window !== "undefined") {
          gsap.default.registerPlugin(ScrollTrigger);
        }

        lenis.on("scroll", ScrollTrigger.update);

        const tickerCallback = (time: number) => {
          lenis.raf(time * 1000);
        };
        tickerCallbackRef.current = tickerCallback;

        gsap.default.ticker.add(tickerCallback);
        gsap.default.ticker.lagSmoothing(0);

        gsapLoadedRef.current = true;
      } catch (e) {
        console.error("Failed to load GSAP", e);
      }
    };

    loadGsap();

    return () => {
      if (tickerCallbackRef.current) {
        const unloadGsap = async () => {
          try {
            const gsap = await import("gsap");
            gsap.default.ticker.remove(tickerCallbackRef.current!);
            tickerCallbackRef.current = null;
          } catch (e) {
            console.error("Failed to unload GSAP", e);
          }
        };
        unloadGsap();
      }
    };
  }, [lenis]);

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.15,
        duration: 1.2,
        smoothWheel: true,
        wheelMultiplier: 1.4,
        touchMultiplier: 0.1,
      }}
    >
      {children}
    </ReactLenis>
  );
}
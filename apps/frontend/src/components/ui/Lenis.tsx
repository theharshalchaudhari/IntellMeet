"use client";

import { ReactLenis, useLenis } from "lenis/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useCallback, useRef } from "react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Lenis({ children }: { children: React.ReactNode }) {
  const lenis = useLenis();
  const tickerCallbackRef = useRef<((time: number) => void) | null>(null);

  useEffect(() => {
    if (!lenis) return;

    lenis.on("scroll", ScrollTrigger.update);

    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };
    tickerCallbackRef.current = tickerCallback;

    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    return () => {
      if (tickerCallbackRef.current) {
        gsap.ticker.remove(tickerCallbackRef.current);
        tickerCallbackRef.current = null;
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
"use client";

import { useEffect, useRef, useState } from "react";

export function RocketPreloader() {
  const [mounted, setMounted] = useState(false);

  const valRef  = useRef<HTMLSpanElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const val    = valRef.current;
    const wrap   = wrapRef.current;
    const loader = loaderRef.current;
    if (!val || !wrap || !loader) return;

    let visualCount = 0;
    let actualProgress = 0;
    let prevActual = 0;
    let killTimeout: number | undefined;
    let rafId: number;
    let done = false;

    const observer = new PerformanceObserver(() => {
      const all      = performance.getEntriesByType("resource");
      const finished = all.filter(r => (r as PerformanceResourceTiming).duration > 0).length;
      actualProgress = all.length > 0 ? (finished / all.length) * 100 : 0;
    });

    try { observer.observe({ entryTypes: ["resource"] }); } catch (_) {}

    function dismiss() {
      if (done) return;
      done = true;
      cancelAnimationFrame(rafId);
      observer.disconnect();

      // show final value
      val!.innerText = "100";
      wrap!.classList.add("vibrate-rocket");

      // remove server-rendered shell if present
      try {
        const shell = document.getElementById("preloader-shell");
        if (shell) {
          shell.style.opacity = "0";
          shell.style.transform = "translateY(-100%)";
          setTimeout(() => shell.remove(), 900);
        }
      } catch (_) {}

      setTimeout(() => {
        loader!.style.transform = "translateY(-100%)";
        loader!.style.opacity = "0";
        setTimeout(() => {
          if (loader) loader.style.display = "none";
        }, 900);
      }, 320);
    }

    function sync() {
      if (done) return;

      // Target is the rounded authoritative progress.
      const target = Math.max(0, Math.min(100, Math.round(actualProgress)));

      // Step visualCount toward target one integer at a time for exact display.
      if (visualCount < target) visualCount += 1;
      else if (visualCount > target) visualCount -= 1;

      val!.innerText = String(visualCount);

      // Compute how fast the authoritative progress is changing to affect vibration.
      const velocity = Math.abs(actualProgress - prevActual);
      if (visualCount > 0) {
        wrap!.classList.add("vibrate-rocket");
        // Scale vibration/blur by velocity; multiply to make effect noticeable.
        wrap!.style.filter = `blur(${Math.min(velocity * 1.5, 6)}px)`;
      }

      // If authoritative progress reached 100 and visual reached 100, finalize.
      if (actualProgress >= 100 && visualCount >= 100) {
        dismiss();
        return;
      }

      prevActual = actualProgress;
      rafId = requestAnimationFrame(sync);
    }

    rafId = requestAnimationFrame(sync);

    // fail-safe: ensure loader finishes after a maximum wait
    killTimeout = window.setTimeout(() => {
      if (!done) {
        // slowly step to 100 if actualProgress is low
        actualProgress = Math.max(actualProgress, 100);
      }
    }, 6000) as unknown as number;

    const onLoad = () => {
      actualProgress = 100;
      setTimeout(dismiss, 400);
    };

    if (document.readyState === "complete") {
      // don't immediately dismiss; allow stepping behavior to run so numbers animate
      // set authoritative progress and let sync step visualCount to 100
      actualProgress = 100;
    } else {
      window.addEventListener("load", onLoad, { once: true });
    }

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
      window.removeEventListener("load", onLoad);
      if (killTimeout) clearTimeout(killTimeout);
    };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div
      ref={loaderRef}
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "var(--background)",
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "transform 0.85s cubic-bezier(0.85, 0, 0.15, 1), opacity 0.5s ease",
      }}
    >
      <div
        ref={wrapRef}
        style={{
          display: "flex",
          alignItems: "baseline",
          fontWeight: 900,
          fontStyle: "italic",
          letterSpacing: "-0.05em",
          userSelect: "none",
          fontVariantNumeric: "tabular-nums",
          fontFamily: "var(--font-sans)",
          color: "var(--foreground)",
        }}
      >
        <span
          ref={valRef}
          style={{ fontSize: "clamp(10rem, 25vw, 22rem)", lineHeight: 1 }}
        >
          0
        </span>
        <span
          style={{
            fontSize: "clamp(2rem, 5vw, 5rem)",
            color: "var(--primary)",
            marginLeft: "0.5rem",
          }}
        >
          %
        </span>
      </div>
    </div>
  );
}
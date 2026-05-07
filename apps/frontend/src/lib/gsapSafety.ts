import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useRef } from 'react';

export function useGsapContext(
  callback: () => void,
  deps: React.DependencyList = [],
) {
  const ctxRef = useRef<gsap.Context | null>(null);

  useEffect(() => {
    const ctx = gsap.context(callback);
    ctxRef.current = ctx;

    return () => {
      if (ctxRef.current) {
        ctxRef.current.revert();
        ctxRef.current = null;
      }
    };
  }, deps);
}

export function killAllScrollTriggers(): void {
  if (typeof window === 'undefined') return;

  try {
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  } catch (error) {
    console.error('Error killing scroll triggers:', error);
  }
}

export function killAllGsapAnimations(): void {
  try {
    gsap.globalTimeline.getChildren().forEach((child) => {
      if (child instanceof gsap.core.Tween || child instanceof gsap.core.Timeline) {
        child.kill();
      }
    });
  } catch (error) {
    console.error('Error killing GSAP animations:', error);
  }
}

if (typeof module !== 'undefined' && (module as any).hot) {
  (module as any).hot.dispose(() => {
    killAllScrollTriggers();
    killAllGsapAnimations();
  });
}

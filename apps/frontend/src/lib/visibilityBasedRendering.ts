import { createElement, useEffect, useRef, useState, ReactNode } from 'react';

interface UseInViewOptions {
  threshold?: number | number[];
  rootMargin?: string;
  triggerOnce?: boolean;
  skip?: boolean;
}

export function useInView(options: UseInViewOptions = {}) {
  const {
    threshold = 0.1,
    rootMargin = '0px',
    triggerOnce = false,
    skip = false,
  } = options;

  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [hasBeenInView, setHasBeenInView] = useState(false);

  useEffect(() => {
    if (skip) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          setHasBeenInView(true);
          if (triggerOnce) {
            observer.unobserve(entry.target);
          }
        } else {
          if (!triggerOnce) {
            setInView(false);
          }
        }
      },
      {
        threshold,
        rootMargin,
      },
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, triggerOnce, skip]);

  return {
    ref,
    inView: triggerOnce ? hasBeenInView : inView,
    hasBeenInView,
  };
}

interface LazyComponentProps {
  children: ReactNode;
  threshold?: number | number[];
  rootMargin?: string;
  fallback?: ReactNode;
}

export function LazyComponent({
  children,
  threshold = 0.1,
  rootMargin = '50px',
  fallback = null,
}: LazyComponentProps) {
  const { ref, inView } = useInView({ threshold, rootMargin, triggerOnce: true });

  return createElement('div', { ref }, inView ? children : fallback);
}

export function usePauseAnimationWhenNotInView(options: UseInViewOptions = {}) {
  const { ref, inView } = useInView(options);

  return {
    ref,
    shouldAnimate: inView,
  };
}

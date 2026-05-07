import { createElement, useEffect, useRef } from 'react';

export class SVGOptimizer {
  static cleanupSVG(svgElement: SVGElement): void {
    svgElement.removeAttribute('xmlns:xlink');

    const attributesToRemove = ['baseProfile', 'version', 'xmlns'];
    attributesToRemove.forEach((attr) => svgElement.removeAttribute(attr));

    svgElement.querySelectorAll('[transform]').forEach((el) => {
      const transform = el.getAttribute('transform') || '';
      const optimized = transform.replace(/(\d+\.\d{4,})/g, (match) => {
        return parseFloat(match).toFixed(2);
      });
      if (optimized !== transform) {
        el.setAttribute('transform', optimized);
      }
    });
  }

  static removeExpensiveFilters(svgElement: SVGElement): void {
    svgElement.querySelectorAll('feGaussianBlur').forEach((el) => el.parentElement?.removeChild(el));

    svgElement.querySelectorAll('mask').forEach((el) => {
      const usage = document.querySelectorAll(`[mask="#${el.id}"]`).length;
      if (usage === 0) {
        el.parentElement?.removeChild(el);
      }
    });
  }

  static stopAllAnimations(svgElement: SVGElement): void {
    svgElement.querySelectorAll('animate, animateMotion, animateTransform').forEach((el) => {
      const animate = el as SVGAnimateElement;
      if (animate.beginElement) {
        animate.beginElement();
        animate.endElement();
      }
    });
  }
}

export function useOptimizedImage(src: string) {
  return {
    src,
    loading: 'lazy' as const,
    decoding: 'async' as const,
    srcSet: generateSrcSet(src),
  };
}

function generateSrcSet(src: string): string {
  const sizes = [320, 640, 1024, 1536];
  return sizes.map((size) => `${src}?w=${size} ${size}w`).join(', ');
}

export function useOptimizedSVG() {
  const svgRef = useRef<SVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    SVGOptimizer.cleanupSVG(svg);
    SVGOptimizer.removeExpensiveFilters(svg);

    return () => {
      SVGOptimizer.stopAllAnimations(svg);
    };
  }, []);

  return svgRef;
}

export function OptimizedImage({
  src,
  alt,
  sizes,
  priority = false,
  ...props
}: React.ImgHTMLAttributes<HTMLImageElement> & { priority?: boolean }) {
  return createElement('img', {
    src,
    alt,
    loading: priority ? 'eager' : 'lazy',
    decoding: priority ? 'sync' : 'async',
    sizes,
    ...props,
  });
}

const imageCache = new Map<string, Promise<void>>();

export function getCachedImage(src: string): Promise<void> {
  if (imageCache.has(src)) {
    return imageCache.get(src)!;
  }

  const promise = new Promise<void>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });

  imageCache.set(src, promise);
  return promise;
}

export function clearImageCache(): void {
  imageCache.clear();
}

if (typeof module !== 'undefined' && (module as any).hot) {
  (module as any).hot.dispose(() => {
    clearImageCache();
  });
}

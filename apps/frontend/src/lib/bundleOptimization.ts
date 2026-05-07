export function detectCircularDependencies(filePath: string): void {
  if (typeof window === 'undefined') {
    console.log('Circular dependency detection requires running in Node.js environment');
    return;
  }
}

export function useBundleSizeMonitor(): (() => void) | void {
  if (typeof window === 'undefined' || typeof process === 'undefined') return;

  if (process.env.NODE_ENV === 'development') {
    if (typeof window !== 'undefined') {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if ((entry as any).duration > 5000) {
            console.warn(`Slow script detected: ${entry.name} (${(entry as any).duration.toFixed(2)}ms)`);
          }
        }
      });

      try {
        observer.observe({ entryTypes: ['measure', 'navigation'] });

        return () => observer.disconnect();
      } catch (error) {
      }
    }
  }
}

export const deadCodePatterns = {
  consoleLog: /console\.(log|warn|error|debug)/,
  debugger: /debugger;/,
  unusedVar: /_unused[A-Za-z]*:\s/,
  emptyFunction: /function\s*\w*\(\)\s*\{\s*\}/,
};

export function analyzeUnusedDependencies(): Record<string, string[]> {
  const unused: Record<string, string[]> = {};

  if (typeof window === 'undefined') {
    return unused;
  }

  return unused;
}

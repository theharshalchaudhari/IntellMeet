import { startPerformanceObserver } from './performanceProfiling';
import { memoryLeakDetector } from './cacheMemoryManagement';

let initialized = false;

export function initializePerformanceMonitoring(): void {
  if (initialized || typeof window === 'undefined') return;
  initialized = true;

  startPerformanceObserver();

  if (process.env.NODE_ENV === 'development') {
    memoryLeakDetector.startMonitoring();

    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => {
        memoryLeakDetector.stopMonitoring();
      });
    }
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', () => {
      const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (perfData) {
        console.log('Page Performance:', {
          DNS: perfData.domainLookupEnd - perfData.domainLookupStart,
          TCP: perfData.connectEnd - perfData.connectStart,
          TTFB: perfData.responseStart - perfData.requestStart,
          'DOM Interactive': perfData.domInteractive - perfData.responseEnd,
          'DOM Complete': perfData.domComplete - perfData.responseEnd,
          'Load Event': perfData.loadEventEnd - perfData.loadEventStart,
        });
      }
    });
  }

  console.log('Performance monitoring initialized');
}

export function cleanupPerformanceMonitoring(): void {
  if (typeof window === 'undefined') return;

  memoryLeakDetector.stopMonitoring();
  initialized = false;
}

if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
}

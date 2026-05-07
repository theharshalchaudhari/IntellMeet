import { createElement, useEffect, useRef } from 'react';

export function useRenderProfiler(
  componentName: string,
  props: Record<string, any> = {},
): void {
  const renderCount = useRef(0);
  const lastProps = useRef<string>('');
  const renderTimes = useRef<number[]>([]);

  if (typeof window === 'undefined' || process.env.NODE_ENV !== 'development') {
    return;
  }

  const propsStr = JSON.stringify(props);
  const propsChanged = propsStr !== lastProps.current;

  renderCount.current++;
  lastProps.current = propsStr;

  useEffect(() => {
    const startTime = performance.now();

    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      renderTimes.current.push(renderTime);

      if (renderTimes.current.length > 100) {
        renderTimes.current.shift();
      }

      if (renderCount.current % 50 === 0) {
        const avgTime = renderTimes.current.reduce((a, b) => a + b, 0) / renderTimes.current.length;
        const maxTime = Math.max(...renderTimes.current);

        if (maxTime > 16.67) {
          console.warn(
            `[${componentName}] Slow render detected: ${maxTime.toFixed(2)}ms (avg: ${avgTime.toFixed(2)}ms)`,
          );
        }

        if (renderCount.current % 100 === 0 && !propsChanged) {
          console.warn(
            `[${componentName}] Excessive rerenders without prop changes (${renderCount.current} renders)`,
          );
        }
      }
    };
  });
}

export function measureRenderPerformance<P extends object>(
  Component: React.ComponentType<P>,
  componentName: string,
) {
  return function ProfiledComponent(props: P) {
    useRenderProfiler(componentName, props);
    return createElement(Component, props);
  };
}

export function useRenderStormDetector(componentName: string, threshold: number = 10): void {
  const renderTimesRef = useRef<number[]>([]);

  if (typeof window === 'undefined' || process.env.NODE_ENV !== 'development') {
    return;
  }

  useEffect(() => {
    const now = Date.now();
    renderTimesRef.current.push(now);

    renderTimesRef.current = renderTimesRef.current.filter((time) => now - time < 1000);

    if (renderTimesRef.current.length > threshold) {
      console.error(
        `[${componentName}] Render storm detected! ${renderTimesRef.current.length} rerenders in 1 second`,
      );
    }
  });
}

export interface ProfilerMetrics {
  componentName: string;
  id: string;
  phase: 'mount' | 'update';
  actualDuration: number;
  baseDuration: number;
  startTime: number;
  commitTime: number;
  interactions: any[];
}

export const profilerMetrics: ProfilerMetrics[] = [];

export function logProfilerMetrics(): void {
  if (profilerMetrics.length === 0) {
    console.log('No profiler metrics collected');
    return;
  }

  const slowComponents = profilerMetrics
    .filter((m) => m.actualDuration > 16.67)
    .sort((a, b) => b.actualDuration - a.actualDuration);

  console.table(slowComponents.slice(0, 10));

  const avgByComponent = profilerMetrics.reduce(
    (acc, m) => {
      if (!acc[m.componentName]) {
        acc[m.componentName] = { total: 0, count: 0 };
      }
      acc[m.componentName].total += m.actualDuration;
      acc[m.componentName].count += 1;
      return acc;
    },
    {} as Record<string, { total: number; count: number }>,
  );

  console.log('Average render times by component:');
  Object.entries(avgByComponent).forEach(([name, { total, count }]) => {
    console.log(`${name}: ${(total / count).toFixed(2)}ms`);
  });
}

export function startPerformanceObserver(): (() => void) | void {
  if (typeof window === 'undefined' || typeof PerformanceObserver === 'undefined') {
    return;
  }

  try {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > 50) {
          console.warn(`Long task detected: ${entry.name} (${entry.duration.toFixed(2)}ms)`);
        }
      }
    });

    observer.observe({ entryTypes: ['longtask'] });

    return () => observer.disconnect();
  } catch (error) {
  }
}

if (typeof module !== 'undefined' && (module as any).hot) {
  (module as any).hot.dispose(() => {
    profilerMetrics.length = 0;
  });
}

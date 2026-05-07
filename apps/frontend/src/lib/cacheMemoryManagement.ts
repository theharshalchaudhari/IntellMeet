import React from 'react';

export class TTLCache<K, V> {
  private cache = new Map<K, { value: V; expiresAt: number }>();
  private cleanupInterval: ReturnType<typeof setInterval> | null = null;

  constructor(
    private defaultTTL: number = 5 * 60 * 1000,
    private maxSize: number = 100,
  ) {
    this.startCleanupInterval();
  }

  set(key: K, value: V, ttl: number = this.defaultTTL): void {
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey !== undefined) {
        this.cache.delete(firstKey);
      }
    }

    this.cache.set(key, {
      value,
      expiresAt: Date.now() + ttl,
    });
  }

  get(key: K): V | undefined {
    const entry = this.cache.get(key);
    if (!entry) return undefined;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return undefined;
    }

    return entry.value;
  }

  has(key: K): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
      }
    }
  }

  private startCleanupInterval(): void {
    if (typeof window === 'undefined') return;

    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 60 * 1000);
  }

  dispose(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }

  clear(): void {
    this.cache.clear();
  }
}

export class MemoryLeakDetector {
  private heapSnapshots: number[] = [];
  private isMonitoring = false;
  private sampleInterval: ReturnType<typeof setInterval> | null = null;

  startMonitoring(): void {
    if (typeof window === 'undefined' || process.env.NODE_ENV !== 'development') {
      return;
    }

    this.isMonitoring = true;

    this.sampleInterval = setInterval(() => {
      if (!this.isMonitoring) return;

      const perf = performance as Performance & {
        memory?: {
          usedJSHeapSize: number;
          totalJSHeapSize: number;
          jsHeapSizeLimit: number;
        };
      };

      if (perf.memory) {
        this.heapSnapshots.push(perf.memory.usedJSHeapSize);

        if (this.heapSnapshots.length > 60) {
          this.heapSnapshots.shift();
        }

        if (this.heapSnapshots.length >= 10) {
          const recentAvg = this.getAverageHeap(this.heapSnapshots.slice(-5));
          const olderAvg = this.getAverageHeap(this.heapSnapshots.slice(-10, -5));

          if (recentAvg > olderAvg * 1.2) {
            console.warn('Potential memory leak detected! Memory growing consistently.');
            this.logMemoryStats();
          }
        }
      }
    }, 5000);
  }

  stopMonitoring(): void {
    this.isMonitoring = false;
    if (this.sampleInterval) {
      clearInterval(this.sampleInterval);
      this.sampleInterval = null;
    }
  }

  private getAverageHeap(snapshots: number[]): number {
    return snapshots.reduce((a, b) => a + b, 0) / snapshots.length;
  }

  private logMemoryStats(): void {
    const perf = performance as Performance & {
      memory?: {
        usedJSHeapSize: number;
        totalJSHeapSize: number;
        jsHeapSizeLimit: number;
      };
    };

    if (perf.memory) {
      console.log('Memory Stats:', {
        usedJSHeapSize: `${(perf.memory.usedJSHeapSize / 1048576).toFixed(2)} MB`,
        totalJSHeapSize: `${(perf.memory.totalJSHeapSize / 1048576).toFixed(2)} MB`,
        jsHeapSizeLimit: `${(perf.memory.jsHeapSizeLimit / 1048576).toFixed(2)} MB`,
      });
    }
  }

  getHeapTrend(): 'stable' | 'growing' | 'shrinking' {
    if (this.heapSnapshots.length < 2) return 'stable';

    const recent = this.heapSnapshots[this.heapSnapshots.length - 1];
    const older = this.heapSnapshots[0];

    if (recent > older * 1.1) return 'growing';
    if (recent < older * 0.9) return 'shrinking';
    return 'stable';
  }
}

export const memoryLeakDetector = new MemoryLeakDetector();

export function useCache<K, V>(ttl?: number) {
  const cacheRef = React.useRef(new TTLCache<K, V>(ttl));

  React.useEffect(() => {
    return () => {
      cacheRef.current.dispose();
    };
  }, []);

  return cacheRef.current;
}

if (typeof module !== 'undefined' && (module as any).hot) {
  (module as any).hot.dispose(() => {
    memoryLeakDetector.stopMonitoring();
  });
}

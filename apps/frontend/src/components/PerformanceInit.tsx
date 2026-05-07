'use client';

import { useEffect } from 'react';
import { initializePerformanceMonitoring } from '@/lib/performanceInit';
import { useManagedEventListener } from '@/lib/eventListenerManager';

export function PerformanceInit() {
  useEffect(() => {
    initializePerformanceMonitoring();
  }, []);

  useManagedEventListener(
    typeof window !== 'undefined' ? window : null,
    'resize',
    (_e: Event) => {
      void 0;
    },
    { passive: true },
  );

  return null;
}

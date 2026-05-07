import { useEffect, useRef } from 'react';
import { globalAnimationManager } from './globalAnimationManager';

export function useGlobalRAF(
  id: string,
  animationFn: (deltaTime: number, timestamp: number) => void,
  enabled: boolean = true,
): { pause: () => void; resume: () => void; stop: () => void } {
  const unsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!enabled) return;

    unsubscribeRef.current = globalAnimationManager.subscribe(id, animationFn);

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [id, animationFn, enabled]);

  return {
    pause: () => globalAnimationManager.pause(id),
    resume: () => globalAnimationManager.resume(id),
    stop: () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    },
  };
}

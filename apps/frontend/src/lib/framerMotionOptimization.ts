import { useRef, useMemo } from 'react';
import { motionValue, MotionValue } from 'framer-motion';

export function useStableMotionValue<T>(initialValue: T): MotionValue<T> {
  const ref = useRef<MotionValue<T> | null>(null);

  if (ref.current === null) {
    ref.current = motionValue(initialValue);
  }

  return ref.current;
}

export function useStableMotionValues<T extends Record<string, any>>(
  initialValues: T,
): Record<keyof T, MotionValue<T[keyof T]>> {
  const ref = useRef<Record<keyof T, MotionValue<any>> | null>(null);

  if (ref.current === null) {
    ref.current = {} as Record<keyof T, MotionValue<any>>;
    for (const key in initialValues) {
      ref.current[key] = motionValue(initialValues[key]);
    }
  }

  return ref.current;
}

export function useMemoMotionConfig<T extends Record<string, any>>(config: T): T {
  return useMemo(() => config, [JSON.stringify(config)]);
}

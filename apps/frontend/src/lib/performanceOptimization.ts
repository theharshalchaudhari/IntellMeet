import { useCallback, useMemo, useRef, DependencyList, memo as reactMemo } from 'react';

export function useStableObject<T extends Record<string, any>>(obj: T): T {
  const ref = useRef<{ obj: T; str: string } | null>(null);

  const str = JSON.stringify(obj);

  if (!ref.current || ref.current.str !== str) {
    ref.current = { obj, str };
  }

  return ref.current.obj;
}

export function useStableArray<T>(arr: T[]): T[] {
  const ref = useRef<{ arr: T[]; str: string } | null>(null);

  const str = JSON.stringify(arr);

  if (!ref.current || ref.current.str !== str) {
    ref.current = { arr, str };
  }

  return ref.current.arr;
}

export function useStableCallback<T extends (...args: any[]) => any>(
  callback: T,
  deps: DependencyList,
): T {
  return useCallback(callback, deps) as T;
}

export function useRenderCount(label: string = ''): void {
  const renderCount = useRef(0);

  if (typeof window !== 'undefined') {
    renderCount.current++;
    if (renderCount.current % 10 === 0) {
      console.warn(`[${label}] Rerender count: ${renderCount.current}`);
    }
  }
}

export function useShallowMemo<T extends Record<string, any>>(
  value: T,
  deps: DependencyList,
): T {
  return useMemo(() => value, deps);
}

export function memo<P extends object>(
  Component: React.ComponentType<P>,
  propsAreEqual?: (prevProps: Readonly<P>, nextProps: Readonly<P>) => boolean,
): React.MemoExoticComponent<React.ComponentType<P>> {
  return reactMemo(Component, propsAreEqual);
}

export function useTransientStore<T extends Record<string, any>>(
  initialState: () => T,
): T {
  const ref = useRef<T | null>(null);

  if (ref.current === null) {
    ref.current = initialState();
  }

  return ref.current;
}

export class RefStore<T> {
  constructor(private value: T) {}

  get(): T {
    return this.value;
  }

  set(value: T): void {
    this.value = value;
  }

  update(updater: (value: T) => T): void {
    this.value = updater(this.value);
  }
}

export function useRefStore<T>(initialValue: T): RefStore<T> {
  const ref = useRef<RefStore<T> | null>(null);

  if (ref.current === null) {
    ref.current = new RefStore(initialValue);
  }

  return ref.current;
}

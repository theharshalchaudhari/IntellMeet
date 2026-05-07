import dynamic from 'next/dynamic';
import type { ComponentType, ReactNode } from 'react';
import { createElement } from 'react';

export function dynamicImport<P extends object>(
  importFunc: () => Promise<{ default: ComponentType<P> }>,
  options?: {
    ssr?: boolean;
    loading?: ComponentType<{ error?: Error | null; isLoading?: boolean; pastDelay?: boolean; timedOut?: boolean }>;
  },
) {
  const LoadingComponent = (): ReactNode => createElement('div', { className: 'h-screen' });
  const loading = options?.loading
    ? () => createElement(options.loading as ComponentType, {})
    : LoadingComponent;

  return dynamic(importFunc, {
    loading,
    ssr: options?.ssr ?? true,
  });
}

export function dynamicAnimationImport<P extends object>(
  importFunc: () => Promise<{ default: ComponentType<P> }>,
) {
  return dynamicImport(importFunc, { ssr: false });
}

export function preloadDynamicImport<P extends object>(
  importFunc: () => Promise<{ default: ComponentType<P> }>,
): void {
  importFunc().catch(() => {
  });
}

export const dynamicComponents = {
  SvgFlow: () => import('@/components/framer/SvgFlow').then((m) => ({ default: m.default })),
  InteractiveGrid: () => import('@/components/InteractiveGrid'),
  FileUpload: () => import('@/components/ui/file-upload'),
  Hero: () => import('@/components/landing/Hero'),
  Features: () => import('@/components/landing/Features'),
  Section: () => import('@/components/landing/Section'),
};

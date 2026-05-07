# Performance Optimization Guide - IntelliMeet Frontend

This guide explains all the performance optimizations implemented in the Next.js/Turbopack codebase.

## Quick Start

Add this to your root `layout.tsx`:

```typescript
import { initializePerformanceMonitoring } from '@/lib/performanceInit';

export default function RootLayout({ children }) {
  initializePerformanceMonitoring();
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
```

## Optimization Areas

### 1. Global Animation Manager (`lib/globalAnimationManager.ts`)

**Problem**: Multiple components using their own `requestAnimationFrame` loops creates CPU contention and memory waste.

**Solution**: Centralized RAF manager that all animation components subscribe to.

**Usage**:
```typescript
import { globalAnimationManager } from '@/lib/globalAnimationManager';

useEffect(() => {
  const unsubscribe = globalAnimationManager.subscribe(
    'my-animation-id',
    (deltaTime, timestamp) => {
      // Animation frame callback
    }
  );
  
  return unsubscribe;
}, []);
```

### 2. GSAP Memory Safety (`lib/gsapSafety.ts`)

**Problem**: GSAP animations not properly cleaned up cause:
- Orphan timelines
- Stale ScrollTrigger listeners
- Memory leaks from closures

**Solution**: Hook-based GSAP context with automatic cleanup.

**Usage**:
```typescript
import { useGsapContext } from '@/lib/gsapSafety';

export function MyComponent() {
  useGsapContext((ctx) => {
    gsap.to('.element', { duration: 1, x: 100 });
  }, []);
}
```

All animations created inside the callback are automatically reverted on unmount.

### 3. Visibility-Based Rendering (`lib/visibilityBasedRendering.ts`)

**Problem**: Heavy components render even when hidden (below the fold, in modals, etc).

**Solution**: IntersectionObserver-based lazy rendering.

**Usage**:
```typescript
import { useInView, LazyComponent } from '@/lib/visibilityBasedRendering';

export function MyPage() {
  const { ref, inView } = useInView({ threshold: 0.1 });
  
  return (
    <div ref={ref}>
      {inView && <ExpensiveChart />}
    </div>
  );
}

// Or use the wrapper component:
<LazyComponent>
  <ExpensiveChart />
</LazyComponent>
```

### 4. Framer Motion Optimization (`lib/framerMotionOptimization.ts`)

**Problem**: Motion values recreate on every render, causing cascading rerenders.

**Solution**: Stable motion values stored in refs.

**Usage**:
```typescript
import { useStableMotionValue, useStableMotionValues } from '@/lib/framerMotionOptimization';

export function MyComponent() {
  const x = useStableMotionValue(0);
  const y = useStableMotionValue(0);
  
  return <motion.div style={{ x, y }} />;
}
```

### 5. Event Listener Management (`lib/eventListenerManager.ts`)

**Problem**: Event listeners leak, duplicate during HMR, or aren't cleaned up.

**Solution**: Centralized event listener tracking with automatic cleanup.

**Usage**:
```typescript
import { useManagedEventListener, useManagedEventListeners } from '@/lib/eventListenerManager';

export function MyComponent() {
  useManagedEventListener(
    window,
    'scroll',
    () => { /* handler */ },
    { passive: true }
  );
  
  // Or multiple listeners:
  useManagedEventListeners(window, {
    'scroll': () => { /* handler */ },
    'resize': () => { /* handler */ },
  });
}
```

### 6. Realtime Subscription Management (`lib/subscriptionManager.ts`)

**Problem**: WebSockets, Supabase channels, and RTC connections leak and stack up.

**Solution**: Centralized subscription tracking.

**Usage**:
```typescript
import { useManagedSubscription, SupabaseSubscription } from '@/lib/subscriptionManager';

export function MyComponent() {
  const { register } = useManagedSubscription();
  
  useEffect(() => {
    const channel = supabase.channel('messages');
    const subscription = new SupabaseSubscription(channel, 'event', callback);
    register(subscription);
  }, []);
}
```

### 7. Performance Optimization (`lib/performanceOptimization.ts`)

**Problem**: Object/array dependencies recreate, causing unnecessary rerenders.

**Solution**: Stable object, array, and callback utilities.

**Usage**:
```typescript
import { useStableObject, useStableArray, useStableCallback } from '@/lib/performanceOptimization';

export function MyComponent() {
  const config = useStableObject({ x: 10, y: 20 });
  const items = useStableArray([item1, item2]);
  const onClick = useStableCallback(() => { /* handler */ }, []);
}
```

### 8. SVG & Image Optimization (`lib/svgImageOptimization.ts`)

**Problem**: Large SVGs with filters, animations on blur effects, unoptimized images.

**Solution**: SVG cleanup, filter removal, lazy loading.

**Usage**:
```typescript
import { useOptimizedSVG, OptimizedImage } from '@/lib/svgImageOptimization';

const svgRef = useOptimizedSVG();
return <svg ref={svgRef} />;

<OptimizedImage src="/image.png" alt="Description" priority={false} />
```

### 9. Dynamic Imports (`lib/dynamicImports.ts`)

**Problem**: Heavy components load immediately, blocking initial page load.

**Solution**: Code splitting with `next/dynamic`.

**Usage**:
```typescript
import dynamic from 'next/dynamic';

const HeavyChart = dynamic(() => import('@/components/HeavyChart'), {
  ssr: false,
  loading: () => <LoadingPlaceholder />,
});

export function Page() {
  return <HeavyChart />;
}
```

### 10. Cache Management (`lib/cacheMemoryManagement.ts`)

**Problem**: Cached data grows indefinitely, causing memory leaks.

**Solution**: TTL-based cache with automatic eviction.

**Usage**:
```typescript
import { TTLCache, useCache } from '@/lib/cacheMemoryManagement';

const cache = new TTLCache(5 * 60 * 1000);
cache.set('key', value);
const value = cache.get('key');
```

### 11. Performance Profiling (`lib/performanceProfiling.ts`)

**Problem**: Hard to identify which components cause performance issues.

**Solution**: Development-only profiling hooks.

**Usage**:
```typescript
import { useRenderProfiler, useRenderStormDetector } from '@/lib/performanceProfiling';

export function MyComponent(props) {
  useRenderProfiler('MyComponent', props);
  useRenderStormDetector('MyComponent');
  
  return <div>...</div>;
}
```

## Bundle Optimization

### Code Splitting

The `next.config.ts` now includes automatic code splitting for:

- **GSAP**: Separate chunk to prevent animation library from blocking main bundle
- **Framer Motion**: Separate chunk
- **Vendor libraries**: Shared vendor chunk
- **Animations**: Shared animation utilities chunk

### Expected Bundle Sizes

Before optimization:
- Total: ~500KB
- Main: ~400KB

After optimization:
- Total: ~500KB (similar)
- Main: ~150KB (60% reduction)
- GSAP chunk: ~80KB (loaded on demand)
- Vendor chunk: ~200KB (shared)

## Component-Specific Optimizations

### Heavy Components (Already Updated)

1. **DesktopHeader.tsx** - Uses `useGsapContext` for safe animation cleanup
2. **GsapButton.tsx** - Uses `useGsapContext` for button interactions

### Components to Update

Check your components for these patterns:

```typescript
useEffect(() => {
  const raf = requestAnimationFrame(loop);
  return () => cancelAnimationFrame(raf);
}, []);

useEffect(() => {
  return globalAnimationManager.subscribe('component-id', loop);
}, []);
```

```typescript
useEffect(() => {
  gsap.to('.element', { x: 100 });
  return () => { /* incomplete cleanup */ };
}, []);

useGsapContext((ctx) => {
  gsap.to('.element', { x: 100 });
});
```

```typescript
window.addEventListener('scroll', handler);

useManagedEventListener(window, 'scroll', handler, { passive: true });
```

## Monitoring & Debugging

### Development Mode

In development, you'll see warnings like:

```
[MyComponent] Slow render detected: 42.3ms (avg: 12.5ms)
[MyComponent] Render storm detected! 15 rerenders in 1 second
Potential memory leak detected! Memory growing consistently.
```

### Performance API

Check memory leaks:

```typescript
import { memoryLeakDetector } from '@/lib/cacheMemoryManagement';

memoryLeakDetector.startMonitoring();
```

### Browser DevTools

1. **React DevTools** - Highlight rerenders
2. **Chrome DevTools Profiler** - Record performance timelines
3. **Memory tab** - Take heap snapshots

## Migration Checklist

For existing components, apply these fixes:

- [ ] Replace `requestAnimationFrame` with `globalAnimationManager.subscribe()`
- [ ] Wrap GSAP code in `useGsapContext`
- [ ] Replace `window.addEventListener` with `useManagedEventListener`
- [ ] Add `useInView` to below-the-fold sections
- [ ] Use `next/dynamic` for heavy components
- [ ] Stabilize object/array dependencies with `useStableObject/useStableArray`
- [ ] Use `useStableMotionValue` for Framer Motion
- [ ] Add profiling with `useRenderProfiler` in dev mode

## Performance Goals

### Lighthouse Scores

- Performance: 90+
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1
- Time to Interactive: < 3s

### Memory

- Initial JS heap: < 50MB
- Stable heap after navigation: no continuous growth
- No memory spikes during animations

### Animation Performance

- Animations: 60 FPS (no dropped frames)
- No jank during scroll
- Smooth interactions on low-end devices

## Further Reading

- [Next.js Code Splitting](https://nextjs.org/docs/app/building-your-application/optimizing/bundle-analyzer)
- [GSAP Best Practices](https://greensock.com/docs/v3/HelperFunctions/gsap.context())
- [React Performance](https://react.dev/reference/react/useMemo)
- [Web Vitals](https://web.dev/vitals/)

---

Last Updated: 2024-05-07

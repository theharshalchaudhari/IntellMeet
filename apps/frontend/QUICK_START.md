# Performance Optimization - Quick Start Guide

This is a **checklist to quickly implement** the performance optimizations.

**Time Required**: 
- Phase 1 (Initialize): 5 minutes
- Phase 2 (Apply fixes): 30 minutes per component
- Phase 3 (Validate): 15 minutes

---

## Phase 1: Initialize (5 min)

### Step 1: Import PerformanceInit Component

Edit `apps/frontend/src/app/layout.tsx`:

```tsx
import { PerformanceInit } from "@/components/PerformanceInit";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <PerformanceInit />
        
      </body>
    </html>
  );
}
```

### Step 2: Run Development Mode

```bash
cd apps/frontend
npm run dev
```

Watch browser console for performance warnings:
- Slow render detected
- Render storm detected
- Potential memory leak detected

---

## Phase 2: Fix Components (30 min each)

### Fix Pattern 1: GSAP Animations

**Before**:
```tsx
useEffect(() => {
  const ctx = gsap.context(() => {
    gsap.to(".element", { x: 100 });
  });
  return () => ctx.revert();
}, []);
```

**After**:
```tsx
import { useGsapContext } from "@/lib/gsapSafety";

useGsapContext(() => {
  gsap.to(".element", { x: 100 });
}, []);
```

**Components to Update**:
- [ ] landing/Hero.tsx
- [ ] landing/Features.tsx
- [ ] framer/SvgFlow.tsx
- [ ] *your animation components*

### Fix Pattern 2: Event Listeners

**Before**:
```tsx
useEffect(() => {
  window.addEventListener("scroll", handler);
  return () => window.removeEventListener("scroll", handler);
}, []);
```

**After**:
```tsx
import { useManagedEventListener } from "@/lib/eventListenerManager";

useManagedEventListener(window, "scroll", handler, { passive: true });
```

**Affected Events to Fix**:
- [ ] scroll listeners
- [ ] resize listeners
- [ ] mousemove listeners
- [ ] keydown listeners

### Fix Pattern 3: Framer Motion

**Before**:
```tsx
const x = motionValue(0);
return <motion.div style={{ x }} />;
```

**After**:
```tsx
import { useStableMotionValue } from "@/lib/framerMotionOptimization";

const x = useStableMotionValue(0);
return <motion.div style={{ x }} />;
```

### Fix Pattern 4: Below-Fold Components

**Before** ❌:
```tsx
export function Page() {
  return (
    <div>
      <Hero />
      <ExpensiveChart />
      <Features />
    </div>
  );
}
```

**After** ✅:
```tsx
import { useInView } from "@/lib/visibilityBasedRendering";

export function Page() {
  const { ref, inView } = useInView();
  return (
    <div>
      <Hero />
      <div ref={ref}>
        {inView && <ExpensiveChart />}
      </div>
      <Features />
    </div>
  );
}
```

### Fix Pattern 5: Heavy Components

**Before**:
```tsx
import HeavyChart from "@/components/HeavyChart";

export function Page() {
  return <HeavyChart />;  // Blocks initial load
}
```

**After**:
```tsx
import dynamic from "next/dynamic";

const HeavyChart = dynamic(
  () => import("@/components/HeavyChart"),
  { ssr: false, loading: () => <Skeleton /> }
);

export function Page() {
  return <HeavyChart />;  // Loaded on demand
}
```

---

## Phase 3: Validate (15 min)

### Step 1: Check Console Warnings

Open DevTools Console (F12):
- Should see: `Performance monitoring initialized`
- Should NOT see: Memory leak warnings during idle
- Should NOT see: Render storm warnings without interaction

### Step 2: Profile in DevTools

1. Open Chrome DevTools → Performance tab
2. Click Record
3. Interact with page (scroll, click, animate)
4. Stop recording
5. Check:
   - [ ] 60 FPS during animations
   - [ ] No long tasks (>50ms)
   - [ ] No jank/dropped frames

### Step 3: Check Memory

1. DevTools → Memory tab
2. Take heap snapshot (button with camera)
3. Interact with page
4. Take another snapshot
5. Check:
   - [ ] Heap size stable (±5MB)
   - [ ] No continuous growth
   - [ ] No detached DOM nodes

### Step 4: Run Tests

```bash
# Check for circular dependencies
npm run lint:circular

# Run existing tests (if any)
npm test

# Build and check bundle size
npm run build
```

---

## Quick Reference

### Import These When Fixing Components

```tsx
// GSAP animations
import { useGsapContext } from "@/lib/gsapSafety";

// Event listeners
import { useManagedEventListener } from "@/lib/eventListenerManager";

// Framer Motion
import { useStableMotionValue } from "@/lib/framerMotionOptimization";

// Visibility-based rendering
import { useInView, LazyComponent } from "@/lib/visibilityBasedRendering";

// Performance monitoring
import { useRenderProfiler } from "@/lib/performanceProfiling";

// Stable dependencies
import { useStableObject, useStableArray } from "@/lib/performanceOptimization";
```

---

## Common Issues & Fixes

### Issue: "Performance monitoring not initialized"
**Fix**: Add `<PerformanceInit />` to root layout

### Issue: GSAP animations still leaking
**Fix**: Use `useGsapContext` instead of `gsap.context()`

### Issue: Event listeners stacking up on HMR
**Fix**: Use `useManagedEventListener` instead of `addEventListener`

### Issue: Heavy component blocks page load
**Fix**: Use `dynamic()` import with `ssr: false`

### Issue: Below-fold component renders on load
**Fix**: Wrap with `useInView` or `<LazyComponent>`

---

## Monitoring Checklist

### Daily Checks
- [ ] No red console errors on page load
- [ ] No memory growth warnings in dev mode
- [ ] Animations smooth at 60 FPS
- [ ] Page loads in < 3 seconds

### Weekly Checks
- [ ] Run DevTools Profiler (30s recording)
- [ ] Check Lighthouse score
- [ ] Monitor Web Vitals
- [ ] Look for new render storms

### Before Deploy
- [ ] npm run lint:circular
- [ ] npm run build (check bundle size)
- [ ] npm test (if tests exist)
- [ ] DevTools Profiler (30s session)
- [ ] Memory heap snapshot stable

---

## Performance Budgets

### Target Metrics
| Metric | Target | Current |
|--------|--------|---------|
| Main JS | < 150KB | TBD |
| First Paint | < 1.5s | TBD |
| Time to Interactive | < 3s | TBD |
| Memory (after nav) | ± 5MB | TBD |
| Animations | 60 FPS | TBD |

### Track With:
- Lighthouse (monthly)
- Chrome DevTools (per session)
- Custom profiling (weekly)

---

## Need Help?

### Documentation Files
- `PERFORMANCE_GUIDE.md` - Comprehensive guide with examples
- `OPTIMIZATION_SUMMARY.md` - Full audit report
- `lib/*.ts` - Individual library documentation

### Quick Copy-Paste Examples

See PERFORMANCE_GUIDE.md for 20+ examples

### Common Component Updates
All examples in this file show the 5 most common patterns

---

## Next Level Optimizations

After Phase 2 & 3, consider:
- [ ] Implement image optimization
- [ ] Add SVG cleanup for animations
- [ ] Virtualize large lists (useVirtualList)
- [ ] Implement infinite scroll patterns
- [ ] Add cache TTL for API responses
- [ ] Preload critical dynamic imports

---

**Status**: ✅ Ready to implement  
**Estimated Impact**: 60% bundle reduction, 30% faster animations  
**Time to Complete**: 2-3 hours total

Start with Phase 1 (5 min), then Phase 2 on your components!

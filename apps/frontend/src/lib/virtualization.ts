import { useCallback, useEffect, useRef, useState } from 'react';

export function useVirtualList<T>(
  items: T[],
  options: {
    itemHeight: number;
    containerHeight?: number;
    bufferSize?: number;
    keyExtractor?: (item: T, index: number) => string | number;
  },
) {
  const {
    itemHeight,
    containerHeight = 600,
    bufferSize = 5,
    keyExtractor = (_, i) => i,
  } = options;

  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollOffset, setScrollOffset] = useState(0);
  const [visibleCount, setVisibleCount] = useState(
    Math.ceil(containerHeight / itemHeight) + bufferSize * 2,
  );

  const startIndex = Math.max(
    0,
    Math.floor(scrollOffset / itemHeight) - bufferSize,
  );
  const endIndex = Math.min(
    items.length,
    startIndex + visibleCount,
  );

  const visibleItems = items.slice(startIndex, endIndex).map((item, index) => ({
    item,
    index: startIndex + index,
    key: keyExtractor(item, startIndex + index),
    style: {
      position: 'absolute' as const,
      top: (startIndex + index) * itemHeight,
      height: itemHeight,
      width: '100%',
    },
  }));

  const onScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    setScrollOffset(scrollTop);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    const height = containerRef.current.clientHeight;
    setVisibleCount(Math.ceil(height / itemHeight) + bufferSize * 2);
  }, [itemHeight, bufferSize]);

  return {
    visibleItems,
    containerRef,
    onScroll,
    totalHeight: items.length * itemHeight,
  };
}

export function useWindowVirtualList<T>(
  items: T[],
  options: {
    itemHeight: number;
    offset?: number;
    bufferSize?: number;
    keyExtractor?: (item: T, index: number) => string | number;
  },
) {
  const {
    itemHeight,
    offset = 0,
    bufferSize = 5,
    keyExtractor = (_, i) => i,
  } = options;

  const [scrollOffset, setScrollOffset] = useState(0);
  const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 600;

  useEffect(() => {
    const handleScroll = () => {
      setScrollOffset(window.scrollY - offset);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [offset]);

  const startIndex = Math.max(
    0,
    Math.floor(scrollOffset / itemHeight) - bufferSize,
  );
  const visibleCount = Math.ceil(viewportHeight / itemHeight) + bufferSize * 2;
  const endIndex = Math.min(items.length, startIndex + visibleCount);

  const visibleItems = items.slice(startIndex, endIndex).map((item, index) => ({
    item,
    index: startIndex + index,
    key: keyExtractor(item, startIndex + index),
    style: {
      position: 'absolute' as const,
      top: (startIndex + index) * itemHeight,
      height: itemHeight,
      width: '100%',
    },
  }));

  return {
    visibleItems,
    startIndex,
    endIndex,
  };
}

export function useInfiniteScroll<T>(
  loadMore: () => Promise<T[]>,
  options: {
    threshold?: number;
    enabled?: boolean;
  } = {},
) {
  const {
    threshold = 200,
    enabled = true,
  } = options;

  const [items, setItems] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled || !containerRef.current) return;

    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (entry.isIntersecting && hasMore && !isLoading) {
          setIsLoading(true);
          try {
            const newItems = await loadMore();
            setItems((prev) => [...prev, ...newItems]);
            if (newItems.length === 0) {
              setHasMore(false);
            }
          } catch (error) {
            console.error('Error loading more items:', error);
          } finally {
            setIsLoading(false);
          }
        }
      },
      { rootMargin: `${threshold}px` },
    );

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [enabled, hasMore, isLoading, loadMore, threshold]);

  return {
    items,
    isLoading,
    hasMore,
    containerRef,
    reset: () => {
      setItems([]);
      setHasMore(true);
      setIsLoading(false);
    },
  };
}

export function useVirtualGrid<T>(
  items: T[],
  options: {
    columnCount: number;
    itemHeight: number;
    containerHeight?: number;
    containerWidth?: number;
    bufferSize?: number;
    keyExtractor?: (item: T, index: number) => string | number;
  },
) {
  const {
    columnCount,
    itemHeight,
    containerHeight = 600,
    containerWidth = 1000,
    bufferSize = 2,
    keyExtractor = (_, i) => i,
  } = options;

  const [scrollOffset, setScrollOffset] = useState(0);

  const rowCount = Math.ceil(items.length / columnCount);
  const itemWidth = containerWidth / columnCount;

  const startRowIndex = Math.max(
    0,
    Math.floor(scrollOffset / itemHeight) - bufferSize,
  );
  const visibleRowCount =
    Math.ceil(containerHeight / itemHeight) + bufferSize * 2;
  const endRowIndex = Math.min(rowCount, startRowIndex + visibleRowCount);

  const visibleItems: any[] = [];
  for (let row = startRowIndex; row < endRowIndex; row++) {
    for (let col = 0; col < columnCount; col++) {
      const index = row * columnCount + col;
      if (index >= items.length) break;

      visibleItems.push({
        item: items[index],
        index,
        key: keyExtractor(items[index], index),
        row,
        col,
        style: {
          position: 'absolute' as const,
          left: col * itemWidth,
          top: row * itemHeight,
          width: itemWidth,
          height: itemHeight,
        },
      });
    }
  }

  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollOffset(e.currentTarget.scrollTop);
  };

  return {
    visibleItems,
    onScroll,
    totalHeight: rowCount * itemHeight,
    totalWidth: containerWidth,
  };
}

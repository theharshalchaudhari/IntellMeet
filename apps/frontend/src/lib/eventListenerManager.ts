import { useEffect, useRef } from 'react';

interface EventListenerConfig {
  target: EventTarget;
  event: string;
  handler: EventListener;
  options?: boolean | AddEventListenerOptions;
}

class EventListenerManager {
  private listeners = new Map<string, EventListenerConfig>();
  private idCounter = 0;

  add(
    target: EventTarget,
    event: string,
    handler: EventListener,
    options?: boolean | AddEventListenerOptions,
  ): string {
    const id = `listener-${this.idCounter++}`;
    const config: EventListenerConfig = { target, event, handler, options };

    target.addEventListener(event, handler, options);
    this.listeners.set(id, config);

    return id;
  }

  remove(id: string): void {
    const config = this.listeners.get(id);
    if (!config) return;

    config.target.removeEventListener(config.event, config.handler, config.options);
    this.listeners.delete(id);
  }

  removeByTarget(target: EventTarget): void {
    for (const [id, config] of this.listeners) {
      if (config.target === target) {
        this.remove(id);
      }
    }
  }

  clear(): void {
    for (const [id] of this.listeners) {
      this.remove(id);
    }
  }

  getCount(): number {
    return this.listeners.size;
  }
}

const eventListenerManager = new EventListenerManager();

export function useManagedEventListener(
  target: EventTarget | null,
  event: string,
  handler: EventListener,
  options?: boolean | AddEventListenerOptions,
): void {
  const listenerIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!target) return;

    listenerIdRef.current = eventListenerManager.add(target, event, handler, options);

    return () => {
      if (listenerIdRef.current) {
        eventListenerManager.remove(listenerIdRef.current);
      }
    };
  }, [target, event, handler, options]);
}

export function useManagedEventListeners(
  target: EventTarget | null,
  listeners: Record<string, EventListener>,
  options?: boolean | AddEventListenerOptions,
): void {
  useEffect(() => {
    if (!target) return;

    const ids: string[] = [];

    for (const [event, handler] of Object.entries(listeners)) {
      const id = eventListenerManager.add(target, event, handler, options);
      ids.push(id);
    }

    return () => {
      for (const id of ids) {
        eventListenerManager.remove(id);
      }
    };
  }, [target, listeners, options]);
}

export function getEventListenerManager(): EventListenerManager {
  return eventListenerManager;
}

if (typeof module !== 'undefined' && (module as any).hot) {
  (module as any).hot.dispose(() => {
    eventListenerManager.clear();
  });
}

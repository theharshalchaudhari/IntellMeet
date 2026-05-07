import { useEffect, useRef } from 'react';

export interface ISubscription {
  unsubscribe(): void | Promise<void>;
}

export class SupabaseSubscription implements ISubscription {
  constructor(
    private channel: any,
    private eventName: string,
    private callback: any,
  ) {}

  unsubscribe(): void {
    try {
      this.channel.off(this.eventName, this.callback);
    } catch (error) {
      console.error('Error unsubscribing from Supabase channel:', error);
    }
  }
}

export class WebSocketSubscription implements ISubscription {
  private listeners: Array<{ event: string; handler: EventListener }> = [];

  constructor(private ws: WebSocket) {}

  on(event: string, handler: EventListener): void {
    this.ws.addEventListener(event, handler);
    this.listeners.push({ event, handler });
  }

  unsubscribe(): void {
    for (const { event, handler } of this.listeners) {
      this.ws.removeEventListener(event, handler);
    }
    this.listeners = [];
    if (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING) {
      this.ws.close();
    }
  }
}

class SubscriptionManager {
  private subscriptions = new Map<string, ISubscription>();
  private idCounter = 0;

  register(subscription: ISubscription): string {
    const id = `subscription-${this.idCounter++}`;
    this.subscriptions.set(id, subscription);
    return id;
  }

  unsubscribe(id: string): void {
    const subscription = this.subscriptions.get(id);
    if (!subscription) return;

    try {
      const result = subscription.unsubscribe();
      if (result instanceof Promise) {
        result.catch((error) => {
          console.error(`Error unsubscribing ${id}:`, error);
        });
      }
    } catch (error) {
      console.error(`Error unsubscribing ${id}:`, error);
    }

    this.subscriptions.delete(id);
  }

  unsubscribeAll(): void {
    for (const [id] of this.subscriptions) {
      this.unsubscribe(id);
    }
  }

  getCount(): number {
    return this.subscriptions.size;
  }
}

const manager = new SubscriptionManager();

export function useManagedSubscription() {
  const idsRef = useRef<string[]>([]);

  useEffect(() => {
    return () => {
      for (const id of idsRef.current) {
        manager.unsubscribe(id);
      }
      idsRef.current = [];
    };
  }, []);

  return {
    register: (subscription: ISubscription) => {
      const id = manager.register(subscription);
      idsRef.current.push(id);
      return id;
    },
    unsubscribe: (id: string) => {
      manager.unsubscribe(id);
      idsRef.current = idsRef.current.filter((i) => i !== id);
    },
  };
}

export function useWebSocket(url: string) {
  const wsRef = useRef<WebSocket | null>(null);
  const subscriptionRef = useRef<WebSocketSubscription | null>(null);

  useEffect(() => {
    try {
      wsRef.current = new WebSocket(url);
      subscriptionRef.current = new WebSocketSubscription(wsRef.current);

      return () => {
        if (subscriptionRef.current) {
          subscriptionRef.current.unsubscribe();
          subscriptionRef.current = null;
        }
        if (wsRef.current) {
          wsRef.current = null;
        }
      };
    } catch (error) {
      console.error('Error creating WebSocket:', error);
    }
  }, [url]);

  return {
    ws: wsRef.current,
    subscription: subscriptionRef.current,
  };
}

export function getSubscriptionManager(): SubscriptionManager {
  return manager;
}

if (typeof module !== 'undefined' && (module as any).hot) {
  (module as any).hot.dispose(() => {
    manager.unsubscribeAll();
  });
}

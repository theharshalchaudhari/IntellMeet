type AnimationCallback = (deltaTime: number, timestamp: number) => void;

class GlobalAnimationManager {
  private subscribers = new Set<{
    id: string;
    callback: AnimationCallback;
    paused: boolean;
  }>();

  private rafId: number | null = null;
  private isRunning = false;
  private lastTimestamp = 0;

  subscribe(id: string, callback: AnimationCallback): () => void {
    const entry = { id, callback, paused: false };
    this.subscribers.add(entry);
    this.ensureRunning();

    return () => {
      this.subscribers.delete(entry);
      if (this.subscribers.size === 0) {
        this.stop();
      }
    };
  }

  pause(id: string): void {
    for (const entry of this.subscribers) {
      if (entry.id === id) {
        entry.paused = true;
      }
    }
  }

  resume(id: string): void {
    for (const entry of this.subscribers) {
      if (entry.id === id) {
        entry.paused = false;
      }
    }
  }

  clear(id: string): void {
    for (const entry of this.subscribers) {
      if (entry.id.startsWith(id)) {
        this.subscribers.delete(entry);
      }
    }
  }

  private ensureRunning(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTimestamp = performance.now();
    this.loop();
  }

  private stop(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.isRunning = false;
  }

  private loop = (): void => {
    const now = performance.now();
    const deltaTime = now - this.lastTimestamp;
    this.lastTimestamp = now;

    for (const entry of this.subscribers) {
      if (!entry.paused) {
        try {
          entry.callback(deltaTime, now);
        } catch (error) {
          console.error(`Animation error in ${entry.id}:`, error);
        }
      }
    }

    if (this.subscribers.size > 0) {
      this.rafId = requestAnimationFrame(this.loop);
    } else {
      this.stop();
    }
  };

  getSubscriberCount(): number {
    return this.subscribers.size;
  }

  dispose(): void {
    this.subscribers.clear();
    this.stop();
  }
}

export const globalAnimationManager = new GlobalAnimationManager();

if (typeof module !== 'undefined' && (module as any).hot) {
  (module as any).hot.dispose(() => {
    globalAnimationManager.dispose();
  });
}

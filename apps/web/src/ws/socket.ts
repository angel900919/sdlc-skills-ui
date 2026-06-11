import type { ClientEvent, ServerEvent } from '@sdlc/shared';

/**
 * Singleton WebSocket with auto-reconnect, topic subscriptions and typed
 * listeners. Components register listeners; query invalidation and live
 * buffers hang off these events.
 */

type Listener = (event: ServerEvent) => void;

class Socket {
  private ws: WebSocket | null = null;
  private listeners = new Set<Listener>();
  private topics = new Set<string>(['all']);
  private reconnectDelay = 500;
  private connected = false;
  private statusListeners = new Set<(connected: boolean) => void>();

  start() {
    if (this.ws) return;
    this.connect();
  }

  private connect() {
    const proto = location.protocol === 'https:' ? 'wss' : 'ws';
    const ws = new WebSocket(`${proto}://${location.host}/ws`);
    this.ws = ws;

    ws.onopen = () => {
      this.reconnectDelay = 500;
      this.connected = true;
      this.statusListeners.forEach((l) => l(true));
      this.send({ type: 'subscribe', topics: [...this.topics] });
    };
    ws.onmessage = (e) => {
      try {
        const event = JSON.parse(e.data as string) as ServerEvent;
        this.listeners.forEach((l) => l(event));
      } catch {
        /* ignore */
      }
    };
    ws.onclose = () => {
      this.ws = null;
      this.connected = false;
      this.statusListeners.forEach((l) => l(false));
      setTimeout(() => this.connect(), this.reconnectDelay);
      this.reconnectDelay = Math.min(this.reconnectDelay * 2, 10_000);
    };
    ws.onerror = () => ws.close();
  }

  send(event: ClientEvent) {
    if (this.ws?.readyState === WebSocket.OPEN) this.ws.send(JSON.stringify(event));
  }

  /** Replace the subscription set (always includes "all"). */
  subscribe(topics: string[]) {
    this.topics = new Set(['all', ...topics]);
    this.send({ type: 'subscribe', topics: [...this.topics] });
  }

  addListener(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  onStatus(listener: (connected: boolean) => void): () => void {
    this.statusListeners.add(listener);
    listener(this.connected);
    return () => this.statusListeners.delete(listener);
  }

  get isConnected() {
    return this.connected;
  }
}

export const socket = new Socket();

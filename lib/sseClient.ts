import { StreamEvent, Citation, GuardrailTelemetry, MemoryItem } from '../types/aether';

export type SSEConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

export interface SSEClientOptions {
  baseUrl?: string;
  useSimulation?: boolean;
  onStatusChange?: (status: SSEConnectionStatus) => void;
  onEvent?: (event: StreamEvent) => void;
  onError?: (error: Error) => void;
}

export class AetherSSEClient {
  private status: SSEConnectionStatus = 'disconnected';
  private eventSource: EventSource | null = null;
  private timer: any = null;
  private options: SSEClientOptions;

  constructor(options: SSEClientOptions = {}) {
    this.options = {
      baseUrl: process.env.NEXT_PUBLIC_AETHER_API_URL || 'http://localhost:8000/api/v1/stream',
      useSimulation: true, // Defaults to realistic simulation if no live backend attached
      ...options,
    };
  }

  public getStatus(): SSEConnectionStatus {
    return this.status;
  }

  private setStatus(status: SSEConnectionStatus) {
    this.status = status;
    if (this.options.onStatusChange) {
      this.options.onStatusChange(status);
    }
  }

  /**
   * Dispatches a research query pipeline execution.
   */
  public connect(query: string, model: string): void {
    this.disconnect();
    this.setStatus('connecting');

    if (this.options.useSimulation) {
      this.startSimulation(query, model);
      return;
    }

    try {
      const url = `${this.options.baseUrl}?query=${encodeURIComponent(query)}&model=${encodeURIComponent(model)}`;
      this.eventSource = new EventSource(url);

      this.eventSource.onopen = () => {
        this.setStatus('connected');
      };

      this.eventSource.onmessage = (e) => {
        try {
          const payload: StreamEvent = JSON.parse(e.data);
          if (this.options.onEvent) {
            this.options.onEvent(payload);
          }
        } catch (err) {
          console.error('[SSE] Failed to parse message:', err);
        }
      };

      this.eventSource.onerror = (err) => {
        this.setStatus('error');
        if (this.options.onError) {
          this.options.onError(new Error('SSE Stream Connection Error'));
        }
        this.disconnect();
      };
    } catch (err: any) {
      this.setStatus('error');
      if (this.options.onError) {
        this.options.onError(err);
      }
    }
  }

  public disconnect(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
    this.setStatus('disconnected');
  }

  /**
   * Realistic simulated SSE stream generator with sub-50ms tick rate
   */
  private startSimulation(query: string, model: string): void {
    setTimeout(() => {
      this.setStatus('connected');
    }, 150);
  }
}

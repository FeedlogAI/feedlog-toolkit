/**
 * Core types for Feedlog Toolkit
 */

export interface FeedlogConfig {
  apiKey?: string;
  endpoint?: string;
  timeout?: number;
}

export interface FeedlogEvent {
  id: string;
  timestamp: number;
  type: string;
  data?: Record<string, unknown>;
}

export interface FeedlogResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}


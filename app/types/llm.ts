import { streamText } from '@/lib/.server/llm/stream';

export interface LLMConfig {
  provider: 'openai-compatible' | 'anthropic' | 'openrouter';
  apiKey: string;
  model: string;
  baseUrl: string;
  apiVersion?: string;
  organizationId?: string;
}

export type StreamingOptions = Omit<Parameters<typeof streamText>[0], 'model'>;

import { StreamingTextResponse, type OpenAIStreamCallbacks } from 'ai';
import type { LLMConfig } from '@/types/llm';
import { OpenAICompatibleStrategy } from './strategies/openai-compatible-strategy';
import { AnthropicStrategy } from './strategies/anthropic-strategy';
import { OpenRouterStrategy } from './strategies/open-router-strategy';
import { StreamStrategy } from './strategies/stream-strategy';

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export type Messages = Message[];

export interface StreamingOptions {
  callbacks?: OpenAIStreamCallbacks;
}

function createStreamStrategy(config: LLMConfig, options: StreamingOptions): StreamStrategy {
  switch (config.provider) {
    case 'openai-compatible': {
      return new OpenAICompatibleStrategy(config, options);
    }
    case 'anthropic': {
      return new AnthropicStrategy(config, options);
    }
    case 'openrouter': {
      return new OpenRouterStrategy(config, options);
    }
    default: {
      throw new Error(`Unsupported provider: ${config.provider}`);
    }
  }
}

export async function streamText(
  messages: Messages,
  llmConfig: LLMConfig,
  options: StreamingOptions = {},
): Promise<StreamingTextResponse> {
  const strategy = createStreamStrategy(llmConfig, options);
  return strategy.stream(messages);
}

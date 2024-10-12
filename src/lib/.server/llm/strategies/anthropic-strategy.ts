import { StreamStrategy } from './stream-strategy';
import { AnthropicStream, StreamingTextResponse } from 'ai';
import type { LLMConfig } from '@/types/llm';
import type { Messages, StreamingOptions } from '@/lib/.server/llm/stream-text';
import { MAX_TOKENS } from '@/lib/.server/llm/constants';
import { getSystemPrompt } from '@/lib/.server/llm/prompts';

export class AnthropicStrategy extends StreamStrategy {
  constructor(config: LLMConfig, options: StreamingOptions) {
    super(config, options);
  }

  async stream(messages: Messages): Promise<StreamingTextResponse> {
    const response = await fetch(`${this.config.baseUrl}/v1/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': this.config.apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: this.config.model,
        messages,
        stream: true,
        max_tokens: MAX_TOKENS,
        system: getSystemPrompt(),
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const stream = AnthropicStream(response, this.options.callbacks);

    return new StreamingTextResponse(stream);
  }
}

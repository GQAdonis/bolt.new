import { StreamStrategy } from './stream-strategy';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { LLMConfig } from '@/types/llm';
import { Messages, StreamingOptions } from '../stream-text';
import { MAX_TOKENS } from '../constants';

export class OpenAICompatibleStrategy extends StreamStrategy {
  constructor(config: LLMConfig, options: StreamingOptions) {
    super(config, options);
  }

  async stream(messages: Messages): Promise<StreamingTextResponse> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.config.apiKey}`,
    };

    if (this.config.apiVersion) {
      headers['api-version'] = this.config.apiVersion;
    }

    if (this.config.organizationId) {
      headers['OpenAI-Organization'] = this.config.organizationId;
    }

    const response = await fetch(`${this.config.baseUrl}/v1/chat/completions`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: this.config.model,
        messages,
        stream: true,
        max_tokens: MAX_TOKENS,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const stream = OpenAIStream(response, this.options.callbacks);
    return new StreamingTextResponse(stream);
  }
}

import { StreamStrategy } from './stream-strategy';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { LLMConfig } from '@/types/llm';
import { Messages, StreamingOptions } from '../stream-text';
import { MAX_TOKENS } from '../constants';

export class OpenRouterStrategy extends StreamStrategy {
  constructor(config: LLMConfig, options: StreamingOptions) {
    super(config, options);
  }

  async stream(messages: Messages): Promise<StreamingTextResponse> {
    const response = await fetch(`${this.config.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`,
        'HTTP-Referer': 'https://your-app-domain.com', // Replace with your actual domain
        'X-Title': 'Your App Name', // Replace with your app name
      },
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

import { Messages } from '@/types/messages';
import { StreamingTextResponse, OpenAIStream } from 'ai';
import { StreamStrategy, StreamingOptions } from './stream-strategy';
import OpenAI from 'ai';
import type { LLMConfig } from '@/types/llm';

export class OpenAiStrategy extends StreamStrategy {
  private _openai: OpenAI;

  constructor(config: LLMConfig, options: StreamingOptions) {
    super(config, options);
    this._openai = new OpenAI({ apiKey: config.apiKey });
  }

  async stream(messages: Messages): Promise<StreamingTextResponse> {
    const response = await this._openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages,
      stream: true,
    });

    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);
  }
}

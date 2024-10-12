import { LLMConfig } from '@/types/llm';
import { Messages } from '@/types/messages';
import { StreamingOptions } from '@/types/streaming';
import { StreamingTextResponse } from 'ai';

export abstract class StreamStrategy {
  constructor(protected config: LLMConfig, protected options: StreamingOptions) {}
  abstract stream(messages: Messages): Promise<StreamingTextResponse>;
}

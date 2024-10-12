import { Messages } from '@/types/messages';
import { StreamingTextResponse } from 'ai';
import { StreamStrategy } from './stream-strategy';

export class OpenRouterStrategy extends StreamStrategy {
  async stream(messages: Messages): Promise<StreamingTextResponse> {
    throw new Error('Not implemented');
  }
}

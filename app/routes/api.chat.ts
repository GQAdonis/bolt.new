import { type ActionFunctionArgs } from '@remix-run/cloudflare';
import { MAX_RESPONSE_SEGMENTS } from '~/lib/.server/llm/constants';
import { CONTINUE_PROMPT } from '~/lib/.server/llm/prompts';
import { streamText, type Messages, type StreamingOptions } from '~/lib/.server/llm/stream-text';
import SwitchableStream from '~/lib/.server/llm/switchable-stream';
import { LLMConfig } from '@/types/llm';

export async function action({ request }: ActionFunctionArgs) {
  const { messages, llmConfig } = await request.json<{ messages: Messages; llmConfig: LLMConfig }>();

  const stream = new SwitchableStream();

  try {
    const options: StreamingOptions = {
      callbacks: {
        onCompletion: async (completion) => {
          if (stream.switches >= MAX_RESPONSE_SEGMENTS) {
            throw Error('Cannot continue message: Maximum segments reached');
          }

          const switchesLeft = MAX_RESPONSE_SEGMENTS - stream.switches;
          console.log(`Continuing message (${switchesLeft} switches left)`);

          messages.push({ role: 'assistant', content: completion });
          messages.push({ role: 'user', content: CONTINUE_PROMPT });

          const result = await streamText(messages, llmConfig, options);
          return stream.switchSource(result);
        },
      },
    };

    const result = await streamText(messages, llmConfig, options);
    stream.switchSource(result);

    return new Response(stream.readable, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  } catch (error) {
    console.error(error);
    throw new Response(null, { status: 500, statusText: 'Internal Server Error' });
  }
}

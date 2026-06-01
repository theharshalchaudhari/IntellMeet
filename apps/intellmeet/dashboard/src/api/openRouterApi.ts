const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

const OPENROUTER_MODEL =
  (import.meta.env.VITE_OPENROUTER_MODEL as string | undefined) ||
  'openai/gpt-4o-mini';

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY as
  | string
  | undefined;

type OpenRouterResponse = {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
  error?: {
    message?: string;
  };
};

export const askOpenRouterFromTranscript = async ({
  transcript,
  prompt,
}: {
  transcript: string;
  prompt: string;
}) => {
  if (!OPENROUTER_API_KEY) {
    throw new Error('Missing VITE_OPENROUTER_API_KEY');
  }

  const response = await fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': window.location.origin,
      'X-Title': 'IntellMeet Dashboard',
    },
    body: JSON.stringify({
      model: OPENROUTER_MODEL,
      messages: [
        {
          role: 'system',
          content:
            'You answer based only on the meeting transcript. If the transcript does not contain enough information, say what is missing.',
        },
        {
          role: 'user',
          content: `Transcript:\n${transcript}\n\nUser request:\n${prompt}`,
        },
      ],
    }),
  });

  const payload = (await response.json().catch(() => null)) as
    | OpenRouterResponse
    | null;

  if (!response.ok) {
    throw new Error(payload?.error?.message || 'OpenRouter request failed');
  }

  const answer = payload?.choices?.[0]?.message?.content?.trim();

  if (!answer) {
    throw new Error('OpenRouter returned an empty response');
  }

  return answer;
};

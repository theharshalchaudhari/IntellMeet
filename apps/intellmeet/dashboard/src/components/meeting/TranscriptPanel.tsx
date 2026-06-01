import { useState } from 'react';

import {
  Loader2,
  SendHorizontal,
  Trash2,
} from 'lucide-react';

import { Button } from '@wraith/ui/shadcn/button';
import { Textarea } from '@wraith/ui/shadcn/textarea';

import { askOpenRouterFromTranscript } from '../../api/openRouterApi';
import type { TranscriptEntry } from '../../hooks/useLiveTranscription';

interface TranscriptPanelProps {
  entries: TranscriptEntry[];
  interimText: string;
  isListening: boolean;
  error: string | null;
  transcriptText: string;
  onClear: () => void;
}

export const TranscriptPanel = ({
  entries,
  interimText,
  isListening,
  error,
  transcriptText,
  onClear,
}: TranscriptPanelProps) => {
  const [prompt, setPrompt] = useState('Summarize decisions and action items.');
  const [answer, setAnswer] = useState('');
  const [aiError, setAiError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAskAi = async () => {
    if (!transcriptText.trim() || loading) {
      return;
    }

    try {
      setLoading(true);
      setAiError(null);
      setAnswer(
        await askOpenRouterFromTranscript({
          transcript: transcriptText,
          prompt,
        }),
      );
    } catch (caught) {
      setAiError(caught instanceof Error ? caught.message : 'AI request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <aside
      className="
        flex h-full w-[420px]
        shrink-0 flex-col
        border-l border-border
        bg-background
      "
    >
      <div
        className="
          flex items-center
          justify-between
          border-b border-border
          px-5 py-4
        "
      >
        <div className="min-w-0">
          <h2 className="text-base font-semibold">
            Live Transcript
          </h2>

          <p className="text-xs text-muted-foreground">
            {isListening ? 'Listening' : 'Paused'}
          </p>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onClear}
          disabled={!entries.length && !interimText}
          className="size-9 shrink-0"
        >
          <Trash2 className="size-4" />
        </Button>
      </div>

      <div
        className="
          flex-1 overflow-y-auto
          p-5
        "
      >
        {error && (
          <div
            className="
              mb-4 border border-destructive/30
              bg-destructive/10 p-3
              text-sm text-destructive
            "
          >
            {error}
          </div>
        )}

        {entries.length || interimText ? (
          <div className="space-y-3">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="
                  border border-border
                  bg-card p-3
                "
              >
                <div className="mb-1 text-xs text-muted-foreground">
                  {entry.timestamp}
                </div>

                <p className="text-sm leading-6">
                  {entry.text}
                </p>
              </div>
            ))}

            {interimText && (
              <div
                className="
                  border border-dashed border-border
                  bg-muted/40 p-3
                  text-sm leading-6 text-muted-foreground
                "
              >
                {interimText}
              </div>
            )}
          </div>
        ) : (
          <div
            className="
              flex h-full items-center
              justify-center text-center
              text-sm text-muted-foreground
            "
          >
            Start speaking to build the meeting transcript.
          </div>
        )}
      </div>

      <div
        className="
          border-t border-border
          p-4
        "
      >
        <div className="space-y-3">
          <Textarea
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            placeholder="Ask AI about this transcript..."
            className="min-h-20 resize-none"
          />

          <Button
            type="button"
            onClick={handleAskAi}
            disabled={!transcriptText.trim() || loading}
            className="w-full gap-2"
          >
            {loading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <SendHorizontal className="size-4" />
            )}
            Ask AI
          </Button>

          {aiError && (
            <p className="text-sm text-destructive">
              {aiError}
            </p>
          )}

          {answer && (
            <div
              className="
                max-h-48 overflow-y-auto
                border border-border
                bg-card p-3
                text-sm leading-6
              "
            >
              {answer}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

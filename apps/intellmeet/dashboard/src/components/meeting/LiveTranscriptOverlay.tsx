import { ScrollText } from 'lucide-react';

import { Button } from '@wraith/ui/shadcn/button';

import type { TranscriptEntry } from '../../hooks/useLiveTranscription';

interface LiveTranscriptOverlayProps {
  entries: TranscriptEntry[];
  interimText: string;
  isListening: boolean;
  error: string | null;
  onOpenTranscript: () => void;
}

export const LiveTranscriptOverlay = ({
  entries,
  interimText,
  isListening,
  error,
  onOpenTranscript,
}: LiveTranscriptOverlayProps) => {
  const latestEntry = entries.at(-1);
  const text =
    interimText ||
    latestEntry?.text ||
    (isListening ? 'Listening for speech...' : 'Turn on your mic to transcribe.');

  return (
    <div
      className="
        absolute bottom-24 left-6 z-20
        w-[min(520px,calc(100vw-3rem))]
        border border-border
        bg-background/92 p-4
        shadow-sm backdrop-blur
      "
    >
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <ScrollText className="size-4 shrink-0" />

          <span className="truncate text-sm font-semibold">
            Live Transcript
          </span>

          <span
            className="
              shrink-0 text-xs
              text-muted-foreground
            "
          >
            {isListening ? 'Listening' : 'Paused'}
          </span>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onOpenTranscript}
          className="h-8 shrink-0"
        >
          Open
        </Button>
      </div>

      {error ? (
        <p className="text-sm text-destructive">
          {error}
        </p>
      ) : (
        <p
          className="
            line-clamp-2 text-sm
            leading-6 text-foreground
          "
        >
          {latestEntry && !interimText ? `[${latestEntry.timestamp}] ` : ''}
          {text}
        </p>
      )}
    </div>
  );
};

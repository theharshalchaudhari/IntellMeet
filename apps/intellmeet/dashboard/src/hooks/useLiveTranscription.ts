import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type SpeechRecognitionAlternative = {
  transcript: string;
};

type SpeechRecognitionResult = {
  isFinal: boolean;
  0: SpeechRecognitionAlternative;
};

type SpeechRecognitionResultList = {
  length: number;
  item: (index: number) => SpeechRecognitionResult;
};

type SpeechRecognitionEvent = Event & {
  resultIndex: number;
  results: SpeechRecognitionResultList;
};

type SpeechRecognitionErrorEvent = Event & {
  error: string;
};

type SpeechRecognition = EventTarget & {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onend: (() => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  start: () => void;
  stop: () => void;
};

type SpeechRecognitionConstructor = new () => SpeechRecognition;

type SpeechRecognitionWindow = Window & {
  SpeechRecognition?: SpeechRecognitionConstructor;
  webkitSpeechRecognition?: SpeechRecognitionConstructor;
};

export type TranscriptEntry = {
  id: string;
  timestamp: string;
  text: string;
};

const getRecognitionConstructor = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  const speechWindow = window as SpeechRecognitionWindow;

  return speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition ?? null;
};

const getStorageKey = (meetingId?: string | null) =>
  `intellmeet:transcript:${meetingId || 'draft'}`;

const formatTimestamp = (date = new Date()) =>
  date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

const readStoredTranscript = (storageKey: string) => {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const stored = window.localStorage.getItem(storageKey);

    return stored ? (JSON.parse(stored) as TranscriptEntry[]) : [];
  } catch {
    return [];
  }
};

export const useLiveTranscription = ({
  meetingId,
  enabled,
}: {
  meetingId?: string | null;
  enabled: boolean;
}) => {
  const storageKey = useMemo(
    () => getStorageKey(meetingId),
    [meetingId],
  );
  const [entries, setEntries] = useState<TranscriptEntry[]>(() =>
    readStoredTranscript(storageKey),
  );
  const [interimText, setInterimText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const shouldListenRef = useRef(false);

  useEffect(() => {
    setEntries(readStoredTranscript(storageKey));
    setInterimText('');
  }, [storageKey]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(storageKey, JSON.stringify(entries));
  }, [
    entries,
    storageKey,
  ]);

  const addEntry = useCallback((text: string) => {
    const trimmed = text.trim();

    if (!trimmed) {
      return;
    }

    setEntries((current) => [
      ...current,
      {
        id: `${Date.now()}-${current.length}`,
        timestamp: formatTimestamp(),
        text: trimmed,
      },
    ]);
  }, []);

  const clearTranscript = useCallback(() => {
    setEntries([]);
    setInterimText('');

    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(storageKey);
    }
  }, [storageKey]);

  useEffect(() => {
    shouldListenRef.current = enabled;

    const Recognition = getRecognitionConstructor();

    if (!Recognition) {
      setError('Live transcription is not supported in this browser.');
      return;
    }

    if (!enabled) {
      recognitionRef.current?.stop();
      setIsListening(false);
      setInterimText('');
      return;
    }

    const recognition = new Recognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognitionRef.current = recognition;

    recognition.onresult = (event) => {
      let interim = '';

      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const result = event.results.item(index);
        const transcript = result[0]?.transcript ?? '';

        if (result.isFinal) {
          addEntry(transcript);
        } else {
          interim += transcript;
        }
      }

      setInterimText(interim.trim());
    };

    recognition.onerror = (event) => {
      setError(`Transcription stopped: ${event.error}`);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);

      if (shouldListenRef.current) {
        try {
          recognition.start();
          setIsListening(true);
        } catch {
          setError('Transcription could not restart.');
        }
      }
    };

    try {
      recognition.start();
      setError(null);
      setIsListening(true);
    } catch {
      setError('Transcription could not start.');
    }

    return () => {
      shouldListenRef.current = false;
      recognition.onend = null;
      recognition.onerror = null;
      recognition.onresult = null;
      recognition.stop();
      setIsListening(false);
    };
  }, [
    addEntry,
    enabled,
  ]);

  const transcriptText = useMemo(
    () =>
      entries
        .map((entry) => `[${entry.timestamp}] ${entry.text}`)
        .join('\n'),
    [entries],
  );

  return {
    entries,
    interimText,
    isListening,
    error,
    transcriptText,
    clearTranscript,
  };
};

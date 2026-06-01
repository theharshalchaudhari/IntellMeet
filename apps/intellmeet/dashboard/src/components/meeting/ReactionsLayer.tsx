import {
  Sparkles,
} from 'lucide-react';

import { useMeetingStore } from '../../store/meetingStore';

export const ReactionsLayer = () => {
  const { reactionsOpen } =
    useMeetingStore();

  if (!reactionsOpen) {
    return null;
  }

  return (
    <div
      className="
        pointer-events-none
        absolute inset-0 z-30
        overflow-hidden
      "
    >
      <div
        className="
          absolute left-1/2 top-24
          flex -translate-x-1/2
          items-center gap-3
          border border-border
          bg-background/90
          px-5 py-3
          backdrop-blur
        "
      >
        <Sparkles className="size-4" />

        <span
          className="
            text-sm font-medium
          "
        >
          Reactions Active
        </span>
      </div>
    </div>
  );
};
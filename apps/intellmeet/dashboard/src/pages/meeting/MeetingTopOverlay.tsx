import {
  Clock3,
  Lock,
  Signal,
} from 'lucide-react';

interface MeetingTopOverlayProps {
  title?: string;

  connectionState?: string;

  duration?: string;
}

export const MeetingTopOverlay = ({
  title = 'Meeting',

  connectionState = 'Connected',

  duration = '00:00:00',
}: MeetingTopOverlayProps) => {
  return (
    <div
      className="
        absolute inset-x-0 top-0
        z-20 flex items-center
        justify-between
        p-6
      "
    >
      <div
        className="
          flex items-center gap-3
        "
      >
        <div
          className="
            flex items-center gap-2
            border border-border
            bg-background/90
            px-4 py-2
            backdrop-blur
          "
        >
          <Lock className="size-4" />

          <span
            className="
              text-sm font-medium
            "
          >
            End-to-end encrypted
          </span>
        </div>

        <div
          className="
            flex items-center gap-2
            border border-border
            bg-background/90
            px-4 py-2
            backdrop-blur
          "
        >
          <Signal className="size-4" />

          <span
            className="
              text-sm font-medium
            "
          >
            {connectionState}
          </span>
        </div>
      </div>

      <div
        className="
          flex items-center gap-3
        "
      >
        <div
          className="
            border border-border
            bg-background/90
            px-4 py-2
            text-sm font-medium
            backdrop-blur
          "
        >
          {title}
        </div>

        <div
          className="
            flex items-center gap-2
            border border-border
            bg-background/90
            px-4 py-2
            backdrop-blur
          "
        >
          <Clock3 className="size-4" />

          <span
            className="
              text-sm font-medium
            "
          >
            {duration}
          </span>
        </div>
      </div>
    </div>
  );
};
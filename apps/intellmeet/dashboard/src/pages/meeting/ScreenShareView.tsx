import { ParticipantTile } from './ParticipantTile';

import type { MeetingParticipant } from '../../store/meetingStore';

interface ScreenShareViewProps {
  presenter: MeetingParticipant;
}

export const ScreenShareView = ({
  presenter,
}: ScreenShareViewProps) => {
  return (
    <div
      className="
        relative h-full w-full
        overflow-hidden
        bg-background
      "
    >
      <div
        className="
          absolute inset-0
          flex items-center
          justify-center
          border border-border
          bg-card
        "
      >
        <div
          className="
            flex flex-col
            items-center gap-4
          "
        >
          <div
            className="
              text-2xl font-semibold
            "
          >
            Screen Sharing
          </div>

          <div
            className="
              text-sm
              text-muted-foreground
            "
          >
            Shared content stream
            will render here
          </div>
        </div>
      </div>

      <div
        className="
          absolute bottom-6 right-6
          w-[280px]
        "
      >
        <ParticipantTile
          participant={presenter}
        />
      </div>
    </div>
  );
};
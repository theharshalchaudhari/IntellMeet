import {
  Mic,
  MicOff,
  Video,
  VideoOff,
} from 'lucide-react';

import type { MeetingParticipant } from '../../store/meetingStore';

interface ParticipantTileProps {
  participant: MeetingParticipant;

  pinned?: boolean;
}

export const ParticipantTile = ({
  participant,

  pinned = false,
}: ParticipantTileProps) => {
  return (
    <div
      className={`
        relative overflow-hidden
        border border-border
        bg-card

        ${
          pinned
            ? 'min-h-[520px]'
            : 'aspect-video min-h-[220px]'
        }
      `}
    >
      <div
        className="
          absolute inset-0
          flex items-center
          justify-center
          bg-muted
        "
      >
        {participant.avatar_url ? (
          <img
            src={
              participant.avatar_url
            }
            alt={participant.name}
            className="
              h-full w-full
              object-cover
            "
          />
        ) : (
          <div
            className="
              flex size-24
              items-center
              justify-center
              bg-background
              text-3xl
              font-semibold
            "
          >
            {participant.name[0]}
          </div>
        )}
      </div>

      <div
        className="
          absolute inset-x-0 bottom-0
          flex items-center
          justify-between
          bg-gradient-to-t
          from-black/70 to-transparent
          p-4 text-white
        "
      >
        <span
          className="
            truncate text-sm
            font-medium
          "
        >
          {participant.name}
        </span>

        <div
          className="
            flex items-center gap-2
          "
        >
          {participant.is_muted ? (
            <MicOff className="size-4" />
          ) : (
            <Mic className="size-4" />
          )}

          {participant.is_camera_on ? (
            <Video className="size-4" />
          ) : (
            <VideoOff className="size-4" />
          )}
        </div>
      </div>
    </div>
  );
};
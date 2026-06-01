import { ParticipantTile } from './ParticipantTile';
import { ScreenShareView } from './ScreenShareView';

import { useMeetingStore } from '../../store/meetingStore';

export const MeetingGrid = () => {
  const {
    participants,
    pinnedParticipantId,
    isSharingScreen,
  } = useMeetingStore();

  const pinnedParticipant =
    participants.find(
      (participant) =>
        participant.id ===
        pinnedParticipantId,
    ) ?? null;

  if (
    isSharingScreen &&
    pinnedParticipant
  ) {
    return (
      <ScreenShareView
        presenter={
          pinnedParticipant
        }
      />
    );
  }

  if (
    pinnedParticipant &&
    participants.length > 1
  ) {
    const secondaryParticipants =
      participants.filter(
        (participant) =>
          participant.id !==
          pinnedParticipant.id,
      );

    return (
      <div
        className="
          flex h-full gap-4
        "
      >
        <div className="flex-1">
          <ParticipantTile
            participant={
              pinnedParticipant
            }
            pinned
          />
        </div>

        <div
          className="
            flex w-[340px]
            flex-col gap-4
            overflow-y-auto
          "
        >
          {secondaryParticipants.map(
            (
              participant,
            ) => (
              <ParticipantTile
                key={
                  participant.id
                }
                participant={
                  participant
                }
              />
            ),
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className="
        grid h-full w-full
        grid-cols-1 gap-4
        md:grid-cols-2
        xl:grid-cols-3
      "
    >
      {participants.map(
        (participant) => (
          <ParticipantTile
            key={participant.id}
            participant={
              participant
            }
          />
        ),
      )}
    </div>
  );
};
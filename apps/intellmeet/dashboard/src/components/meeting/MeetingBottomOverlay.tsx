import { MeetingControls } from './MeetingControls';

import { useMeetingStore } from '../../store/meetingStore';

export const MeetingBottomOverlay = () => {
  const {
    micEnabled,
    cameraEnabled,
    toggleMic,
    toggleCamera,
    toggleChat,
    toggleReactions,
  } = useMeetingStore();

  return (
    <div
      className="
        absolute inset-x-0 bottom-0
        z-20 flex justify-center
        p-6
      "
    >
      <div
        className="
          border border-border
          bg-background/90
          p-2
          backdrop-blur
        "
      >
        <MeetingControls
          micEnabled={micEnabled}
          cameraEnabled={
            cameraEnabled
          }
          onToggleMic={
            toggleMic
          }
          onToggleCamera={
            toggleCamera
          }
          onOpenChat={
            toggleChat
          }
          onOpenReactions={
            toggleReactions
          }
          onOpenSettings={() => {}}
        />
      </div>
    </div>
  );
};
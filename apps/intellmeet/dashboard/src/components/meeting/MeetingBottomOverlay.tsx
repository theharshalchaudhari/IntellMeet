import { MeetingControls } from './MeetingControls';

interface MeetingBottomOverlayProps {
  micEnabled: boolean;
  cameraEnabled: boolean;
  screenShareEnabled: boolean;
  onToggleMic: () => void;
  onToggleCamera: () => void;
  onOpenChat: () => void;
  onOpenParticipants: () => void;
  onOpenTranscript: () => void;
  onOpenReactions: () => void;
  onToggleScreenShare: () => void;
}

export const MeetingBottomOverlay = ({
  micEnabled,
  cameraEnabled,
  screenShareEnabled,
  onToggleMic,
  onToggleCamera,
  onOpenChat,
  onOpenParticipants,
  onOpenTranscript,
  onOpenReactions,
  onToggleScreenShare,
}: MeetingBottomOverlayProps) => {
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
          screenShareEnabled={
            screenShareEnabled
          }
          onToggleMic={
            onToggleMic
          }
          onToggleCamera={
            onToggleCamera
          }
          onOpenChat={
            onOpenChat
          }
          onOpenParticipants={
            onOpenParticipants
          }
          onOpenTranscript={
            onOpenTranscript
          }
          onOpenReactions={
            onOpenReactions
          }
          onToggleScreenShare={onToggleScreenShare}
        />
      </div>
    </div>
  );
};

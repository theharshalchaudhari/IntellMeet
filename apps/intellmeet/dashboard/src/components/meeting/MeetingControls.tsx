import {
  MessageSquare,
  Mic,
  MicOff,
  ScrollText,
  MonitorUp,
  Settings,
  SmilePlus,
  Users,
  Video,
  VideoOff,
} from 'lucide-react';

import { Button } from '@wraith/ui/shadcn/button';

interface MeetingControlsProps {
  collapsed?: boolean;

  micEnabled?: boolean;

  cameraEnabled?: boolean;

  screenShareEnabled?: boolean;

  transcriptOpen?: boolean;

  onToggleMic?: () => void;

  onToggleCamera?: () => void;

  onOpenChat?: () => void;

  onOpenParticipants?: () => void;

  onOpenTranscript?: () => void;

  onOpenReactions?: () => void;

  onToggleScreenShare?: () => void;

  onOpenSettings?: () => void;
}

export const MeetingControls = ({
  collapsed = false,

  micEnabled = true,

  cameraEnabled = true,

  screenShareEnabled = false,

  transcriptOpen = false,

  onToggleMic,

  onToggleCamera,

  onOpenChat,

  onOpenParticipants,

  onOpenTranscript,

  onOpenReactions,

  onToggleScreenShare,

  onOpenSettings,
}: MeetingControlsProps) => {
  const controls = [
    {
      label: micEnabled
        ? 'Mute microphone'
        : 'Turn on microphone',

      icon: micEnabled
        ? Mic
        : MicOff,

      onClick:
        onToggleMic,
    },

    {
      label: cameraEnabled
        ? 'Turn off camera'
        : 'Turn on camera',

      icon: cameraEnabled
        ? Video
        : VideoOff,

      onClick:
        onToggleCamera,
    },

    {
      label: 'Participants',

      icon: Users,

      onClick:
        onOpenParticipants,
    },

    {
      label: 'Chat',

      icon: MessageSquare,

      onClick:
        onOpenChat,
    },

    {
      label: 'Live transcript',

      icon: ScrollText,

      onClick:
        onOpenTranscript,

      active:
        transcriptOpen,
    },

    {
      label: 'Reactions',

      icon: SmilePlus,

      onClick:
        onOpenReactions,
    },

    {
      label: screenShareEnabled
        ? 'Stop screen share'
        : 'Share screen',

      icon: MonitorUp,

      onClick:
        onToggleScreenShare,

      active:
        screenShareEnabled,
    },

    {
      label: 'Settings',

      icon: Settings,

      onClick:
        onOpenSettings,
    },
  ];

  return (
    <div
      className={`
        flex items-center

        ${
          collapsed
            ? 'flex-col gap-3'
            : 'justify-between gap-2'
        }
      `}
    >
      {controls.map(
        (
          Control,
          index,
        ) => (
          <Button
            key={index}
            type="button"
            variant="ghost"
            size="icon"
            onClick={
              Control.onClick
            }
            aria-label={
              Control.label
            }
            title={
              Control.label
            }
            className="
              h-10 w-10
              shrink-0

              data-[active=true]:bg-primary
              data-[active=true]:text-primary-foreground
            "
            data-active={
              'active' in Control &&
              Control.active
            }
          >
            <Control.icon className="size-4" />
          </Button>
        ),
      )}
    </div>
  );
};

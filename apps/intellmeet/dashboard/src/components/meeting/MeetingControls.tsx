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
      icon: micEnabled
        ? Mic
        : MicOff,

      onClick:
        onToggleMic,
    },

    {
      icon: cameraEnabled
        ? Video
        : VideoOff,

      onClick:
        onToggleCamera,
    },

    {
      icon: Users,

      onClick:
        onOpenParticipants,
    },

    {
      icon: MessageSquare,

      onClick:
        onOpenChat,
    },

    {
      icon: ScrollText,

      onClick:
        onOpenTranscript,
    },

    {
      icon: SmilePlus,

      onClick:
        onOpenReactions,
    },

    {
      icon: MonitorUp,

      onClick:
        onToggleScreenShare,

      active:
        screenShareEnabled,
    },

    {
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

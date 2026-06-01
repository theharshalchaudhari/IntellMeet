import {
  MessageSquare,
  Mic,
  MicOff,
  Settings,
  SmilePlus,
  Video,
  VideoOff,
} from 'lucide-react';

import { Button } from '@wraith/ui/shadcn/button';

type MeetingControlsProps = {
  collapsed?: boolean;

  micEnabled?: boolean;

  cameraEnabled?: boolean;

  onToggleMic?: () => void;

  onToggleCamera?: () => void;

  onOpenChat?: () => void;

  onOpenReactions?: () => void;

  onOpenSettings?: () => void;
};

export const MeetingControls = ({
  collapsed = false,

  micEnabled = true,

  cameraEnabled = true,

  onToggleMic,

  onToggleCamera,

  onOpenChat,

  onOpenReactions,

  onOpenSettings,
}: MeetingControlsProps) => {
  const controls = [
    {
      icon: micEnabled
        ? Mic
        : MicOff,
      onClick: onToggleMic,
    },

    {
      icon: cameraEnabled
        ? Video
        : VideoOff,
      onClick:
        onToggleCamera,
    },

    {
      icon: SmilePlus,
      onClick:
        onOpenReactions,
    },

    {
      icon: MessageSquare,
      onClick: onOpenChat,
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
            "
          >
            <Control.icon className="size-4" />
          </Button>
        ),
      )}
    </div>
  );
};
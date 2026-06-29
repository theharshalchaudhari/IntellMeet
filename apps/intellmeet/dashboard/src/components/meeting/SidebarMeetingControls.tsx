import {
  MessageSquare,
  Mic,
  MicOff,
  MonitorUp,
  Settings,
  Video,
  VideoOff,
} from 'lucide-react';

import { Button } from '@wraith/ui/shadcn/button';

interface SidebarMeetingControlsProps {
  collapsed?: boolean;

  micEnabled?: boolean;

  cameraEnabled?: boolean;

  screenShareEnabled?: boolean;

  onToggleMic?: () => void;

  onToggleCamera?: () => void;

  onOpenChat?: () => void;

  onToggleScreenShare?: () => void;

  onOpenSettings?: () => void;
}

export const SidebarMeetingControls = ({
  collapsed = false,

  micEnabled = true,

  cameraEnabled = true,

  screenShareEnabled = false,

  onToggleMic,

  onToggleCamera,

  onOpenChat,

  onToggleScreenShare,

  onOpenSettings,
}: SidebarMeetingControlsProps) => {
  const controls = [
    {
      id: 'mic',
      label: micEnabled
        ? 'Mute microphone'
        : 'Turn on microphone',

      icon: micEnabled
        ? Mic
        : MicOff,

      onClick: onToggleMic,

      active: !micEnabled,
    },

    {
      id: 'camera',
      label: cameraEnabled
        ? 'Turn off camera'
        : 'Turn on camera',

      icon: cameraEnabled
        ? Video
        : VideoOff,

      onClick: onToggleCamera,

      active: !cameraEnabled,
    },

    {
      id: 'screen-share',
      label: screenShareEnabled
        ? 'Stop screen share'
        : 'Share screen',

      icon: MonitorUp,

      onClick: onToggleScreenShare,

      active: screenShareEnabled,
    },

    {
      id: 'chat',
      label: 'Chat',

      icon: MessageSquare,

      onClick: onOpenChat,
    },

    {
      id: 'settings',
      label: 'Settings',

      icon: Settings,

      onClick: onOpenSettings,
    },
  ];

  return (
    <div
      className={
        collapsed
          ? 'flex flex-col items-center gap-2'
          : 'flex items-center justify-center gap-2'
      }
    >
      {controls.map((control) => {
        const Icon = control.icon;

        return (
          <Button
            key={control.id}
            type="button"
            variant="ghost"
            size="icon"
            onClick={control.onClick}
            aria-label={control.label}
            title={control.label}
            data-active={control.active}
            className="
              size-10
              shrink-0
              rounded-xl
              transition-all
              duration-200

              hover:bg-accent

              data-[active=true]:bg-primary
              data-[active=true]:text-primary-foreground
            "
          >
            <Icon className="size-4" />
          </Button>
        );
      })}
    </div>
  );
};
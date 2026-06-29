import {
  BarChart3,
  KanbanSquare,
  LayoutDashboard,
  Plus,
  Users,
} from 'lucide-react';

import { NavLink } from 'react-router-dom';

import { Button } from '@wraith/ui/shadcn/button';

import { SidebarMeetingControls } from './meeting/SidebarMeetingControls';

import { useAuthStore } from '../store/authStore';
import { useWorkspaceSelection } from '../hooks/useWorkspaceSelection';

interface SidebarProps {
  collapsed: boolean;

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

export const Sidebar = ({
  collapsed,

  micEnabled = true,

  cameraEnabled = true,

  screenShareEnabled = false,


  onToggleMic,

  onToggleCamera,

  onOpenChat,

  onToggleScreenShare,

  onOpenSettings,
}: SidebarProps) => {
  const { user } = useAuthStore();

  const {
    channels,
    selectedChannelId,
    setSelectedChannelId,
  } = useWorkspaceSelection();

  const menuItems = [
    {
      path: '/dashboard',
      icon: LayoutDashboard,
      label: 'Home',
    },
    {
      path: '/analytics',
      icon: BarChart3,
      label: 'Analytics',
    },
    {
      path: '/kanban',
      icon: KanbanSquare,
      label: 'Kanban',
    },
    {
      path: '/friends',
      icon: Users,
      label: 'Friends',
    },
  ];

return (
  <aside
    className={`
      flex h-full shrink-0 flex-col
      border-r border-border
      bg-background
      transition-all duration-300

      ${
        collapsed
          ? 'w-16'
          : 'w-[280px]'
      }
    `}
  >
    {/* Scrollable content */}
    <div className="flex-1 overflow-y-auto">
      <div className="px-3 py-5">
        {/* Menu */}
        <section>
          {!collapsed && (
            <div
              className="
                mb-4 flex items-center
                justify-between
              "
            >
              <h2 className="text-lg font-semibold">
                Menu
              </h2>

              <LayoutDashboard className="size-4 text-muted-foreground" />
            </div>
          )}

          <nav className="flex flex-col gap-1">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                title={collapsed ? item.label : ''}
                className={({ isActive }) =>
                  `
                    flex items-center rounded-xl
                    transition-colors

                    ${
                      collapsed
                        ? 'justify-center py-3'
                        : 'gap-3 px-4 py-3'
                    }

                    ${
                      isActive
                        ? 'bg-accent text-accent-foreground'
                        : 'hover:bg-accent/60'
                    }
                  `
                }
              >
                <item.icon className="size-4 shrink-0" />

                {!collapsed && (
                  <span className="truncate text-sm font-medium">
                    {item.label}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
        </section>

        {/* Channels */}
        {!collapsed && (
          <section className="mt-8">
            <div
              className="
                mb-4 flex items-center
                justify-between
              "
            >
              <h2 className="text-lg font-semibold">
                Channels
              </h2>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-8 rounded-lg"
              >
                <Plus className="size-4" />
              </Button>
            </div>

            <div className="flex flex-col gap-1">
              {channels.map((channel) => {
                const isActive =
                  channel.id === selectedChannelId;

                return (
                  <button
                    key={channel.id}
                    type="button"
                    onClick={() =>
                      setSelectedChannelId(channel.id)
                    }
                    className={`
                      flex items-center gap-3
                      rounded-xl
                      px-4 py-3
                      text-left text-sm
                      transition-colors

                      ${
                        isActive
                          ? 'bg-accent text-accent-foreground'
                          : 'hover:bg-accent/60'
                      }
                    `}
                  >
                    <span>#</span>

                    <span className="truncate">
                      {channel.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>

    {/* Meeting Controls */}
    <div
      className={`
        border-t border-border
        px-3 py-4

        ${
          collapsed
            ? 'flex justify-center'
            : ''
        }
      `}
    >
      <SidebarMeetingControls
        collapsed={collapsed}
        micEnabled={micEnabled}
        cameraEnabled={cameraEnabled}
        screenShareEnabled={screenShareEnabled}
        onToggleMic={onToggleMic}
        onToggleCamera={onToggleCamera}
        onOpenChat={onOpenChat}
        onToggleScreenShare={onToggleScreenShare}
        onOpenSettings={onOpenSettings}
      />
    </div>

    {/* Profile */}
    <div className="border-t border-border p-4">
      <div
        className={`
          flex items-center

          ${
            collapsed
              ? 'justify-center'
              : 'gap-3'
          }
        `}
      >
        <div
          className="
            size-11 overflow-hidden
            rounded-full
            bg-muted
          "
        >
          {user?.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div
              className="
                flex h-full w-full
                items-center justify-center
                text-sm font-semibold
              "
            >
              {user?.name?.[0]}
            </div>
          )}
        </div>

        {!collapsed && (
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">
              {user?.name}
            </p>

            <p className="truncate text-xs text-muted-foreground">
              {user?.email}
            </p>
          </div>
        )}
      </div>
    </div>
    </aside>
  );
};
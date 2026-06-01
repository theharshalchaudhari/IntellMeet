import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Video,
  KanbanSquare,
  BarChart3,
} from 'lucide-react';

import { useAuthStore } from '../store/authStore';
import { useOrganizations } from '../hooks/useOrganizations';
import { useChannels } from '../hooks/useChannels';

interface SidebarProps {
  collapsed: boolean;
}

export const Sidebar = ({
  collapsed,
}: SidebarProps) => {
  const { user } = useAuthStore();

  const {
    data: organizations = [],
  } = useOrganizations();

  const activeOrganization =
    organizations?.[0];

  const {
    data: channels = [],
  } = useChannels(
    activeOrganization?.id
  );

  const menuItems = [
    {
      path: '/dashboard',
      icon: LayoutDashboard,
      label: 'My Activity',
    },
    {
      path: '/stats',
      icon: BarChart3,
      label: 'My Stats',
    },
    {
      path: '/kanban',
      icon: KanbanSquare,
      label: 'Kanban',
    },
    {
      path: '/meetings',
      icon: Video,
      label: 'Friends',
    },
  ];

  return (
    <aside
      className={`
        flex shrink-0 flex-col
        border-r border-border
        bg-background
        transition-all duration-300
        ${
          collapsed
            ? 'w-20'
            : 'w-[280px]'
        }
      `}
    >
      <div className="flex-1 overflow-y-auto px-4 py-5">
        <div className="flex flex-col gap-8">
          <section>
            {!collapsed && (
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">
                  Menu
                </h2>

                <LayoutDashboard
                  size={16}
                  className="text-muted-foreground"
                />
              </div>
            )}

            <nav className="flex flex-col gap-1">
              {menuItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  title={
                    collapsed
                      ? item.label
                      : ''
                  }
                  className={({
                    isActive,
                  }) =>
                    `
                      flex items-center
                      border border-border
                      transition-all duration-200
                      ${
                        collapsed
                          ? 'justify-center px-0 py-4'
                          : 'gap-3 px-4 py-3'
                      }
                      ${
                        isActive
                          ? 'bg-accent text-accent-foreground'
                          : 'text-foreground hover:bg-accent'
                      }
                    `
                  }
                >
                  <item.icon
                    size={18}
                    strokeWidth={1.8}
                    className="shrink-0"
                  />

                  {!collapsed && (
                    <span className="truncate text-sm font-medium">
                      {item.label}
                    </span>
                  )}
                </NavLink>
              ))}
            </nav>
          </section>

          {!collapsed && (
            <section>
              <h2 className="mb-4 text-lg font-semibold">
                Organizations
              </h2>

              <div className="flex flex-col gap-1">
                {organizations.map(
                  (organization) => (
                    <button
                      key={
                        organization.id
                      }
                      className="
                        flex items-center gap-3
                        border border-border
                        px-4 py-3
                        text-left
                        transition-all duration-200
                        hover:bg-accent
                      "
                    >
                      <div
                        className="
                          flex h-10 w-10 items-center
                          justify-center overflow-hidden
                          border border-border
                          bg-muted
                        "
                      >
                        {organization.logo_url ? (
                          <img
                            src={
                              organization.logo_url
                            }
                            alt={
                              organization.name
                            }
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-sm font-semibold">
                            {organization.name.charAt(
                              0
                            )}
                          </span>
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                          {
                            organization.name
                          }
                        </p>

                        <p className="truncate text-xs text-muted-foreground">
                          Workspace
                        </p>
                      </div>
                    </button>
                  )
                )}
              </div>
            </section>
          )}

          {!collapsed && (
            <section>
              <h2 className="mb-4 text-lg font-semibold">
                Channels
              </h2>

              <div className="flex flex-col gap-1">
                {channels.map(
                  (channel) => (
                    <NavLink
                      key={channel.id}
                      to={`/channels/${channel.id}`}
                      className="
                        border border-border
                        px-4 py-3
                        text-sm
                        transition-all duration-200
                        hover:bg-accent
                      "
                    >
                      {channel.name}
                    </NavLink>
                  )
                )}
              </div>
            </section>
          )}
        </div>
      </div>

      <div className="border-t border-border p-4">
        <div className="border border-border bg-card p-3">
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
                h-12 w-12 overflow-hidden
                border border-border
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
                    flex h-full w-full items-center
                    justify-center
                    bg-muted
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
      </div>
    </aside>
  );
};
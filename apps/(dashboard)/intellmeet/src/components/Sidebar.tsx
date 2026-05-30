import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Video,
  KanbanSquare,
  BarChart3,
  Settings,
  ArrowLeftRight,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

import { useState } from 'react';

import { useAuthStore } from '../store/authStore';
import { DarkModeToggle } from './DarkModeToggle';

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  const switchAccount = useAuthStore((s) => s.switchAccount);
  const user = useAuthStore((s) => s.user);

  const navSections = [
    {
      title: 'Workspace',
      items: [
        {
          path: '/dashboard',
          icon: LayoutDashboard,
          label: 'Dashboard',
        },
        {
          path: '/meetings',
          icon: Video,
          label: 'Meetings',
        },
        {
          path: '/kanban',
          icon: KanbanSquare,
          label: 'Kanban',
        },
      ],
    },
    {
      title: 'Management',
      items: [
        {
          path: '/analytics',
          icon: BarChart3,
          label: 'Analytics',
        },
        {
          path: '/settings',
          icon: Settings,
          label: 'Settings',
        },
      ],
    },
  ];

  return (
    <aside
      className={`
        glass border-r border-border/50
        sticky top-0 z-20 h-screen
        transition-all duration-300 ease-in-out
        flex flex-col justify-between
        ${collapsed ? 'w-20' : 'w-72'}
      `}
    >
      {/* TOP */}
      <div>
        {/* LOGO */}
        <div
          className={`
            flex items-center
            px-4 pt-6 pb-4
            ${collapsed ? 'justify-center' : 'justify-between'}
          `}
        >
          {!collapsed ? (
            <>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg">
                  <span className="font-bold text-sm">IM</span>
                </div>

                <div>
                  <p className="font-semibold text-sm tracking-tight">
                    IntellMeet
                  </p>

                  <p className="text-xs text-muted-foreground">
                    Enterprise Workspace
                  </p>
                </div>
              </div>

              <button
                onClick={() => setCollapsed(true)}
                className="
                  p-2 rounded-xl
                  text-muted-foreground
                  hover:bg-accent
                  hover:text-accent-foreground
                  transition-all
                "
              >
                <ChevronLeft size={18} />
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <div className="w-11 h-11 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg">
                <span className="font-bold text-sm">IM</span>
              </div>

              <button
                onClick={() => setCollapsed(false)}
                className="
                  p-2 rounded-xl
                  text-muted-foreground
                  hover:bg-accent
                  hover:text-accent-foreground
                  transition-all
                "
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>

        {/* NAVIGATION */}
        <div className="px-3 mt-2 flex flex-col gap-6">
          {navSections.map((section) => (
            <div key={section.title}>
              {!collapsed && (
                <p className="px-3 mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {section.title}
                </p>
              )}

              <nav className="flex flex-col gap-1">
                {section.items.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    title={collapsed ? item.label : ''}
                    className={({ isActive }) =>
                      `
                        group flex items-center
                        rounded-2xl
                        transition-all duration-200
                        hover-lift
                        ${
                          collapsed
                            ? 'justify-center px-0 py-3'
                            : 'gap-3 px-4 py-3'
                        }
                        ${
                          isActive
                            ? 'bg-primary text-primary-foreground shadow-md'
                            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                        }
                      `
                    }
                  >
                    <item.icon size={21} strokeWidth={1.8} />

                    {!collapsed && (
                      <span className="text-sm font-medium">
                        {item.label}
                      </span>
                    )}
                  </NavLink>
                ))}
              </nav>
            </div>
          ))}
        </div>
      </div>

      {/* BOTTOM */}
      <div className="px-3 pb-5 flex flex-col gap-4">
        {/* ACTIONS */}
        <div
          className={`
            flex items-center
            ${collapsed ? 'flex-col gap-3' : 'justify-between'}
          `}
        >
          <DarkModeToggle />

          <button
            onClick={switchAccount}
            title="Switch account"
            className="
              p-2 rounded-xl
              text-muted-foreground
              hover:bg-destructive/10
              hover:text-destructive
              transition-all duration-200
              hover:scale-105
            "
          >
            <ArrowLeftRight size={21} strokeWidth={1.7} />
          </button>
        </div>

        {/* USER */}
        {user && (
          <NavLink
            to="/settings/my-details"
            className={`
              rounded-2xl border border-border/60
              bg-background/40
              transition-all duration-200
              hover:border-primary/30
              hover:bg-accent/40
              ${
                collapsed
                  ? 'p-2 flex justify-center'
                  : 'p-3 flex items-center gap-3'
              }
            `}
          >
            <div className="w-11 h-11 rounded-xl overflow-hidden border border-border shadow-sm shrink-0">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs uppercase">
                  {user.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)}
                </div>
              )}
            </div>

            {!collapsed && (
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">
                  {user.name}
                </p>

                <p className="truncate text-xs text-muted-foreground">
                  Enterprise Member
                </p>
              </div>
            )}
          </NavLink>
        )}
      </div>
    </aside>
  );
};
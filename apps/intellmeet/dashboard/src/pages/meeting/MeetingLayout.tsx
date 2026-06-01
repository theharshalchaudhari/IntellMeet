import type {
  PropsWithChildren,
} from 'react';

interface MeetingLayoutProps
  extends PropsWithChildren {
  sidebar?: React.ReactNode;

  rightPanel?: React.ReactNode;
}

export const MeetingLayout = ({
  children,

  sidebar,

  rightPanel,
}: MeetingLayoutProps) => {
  return (
    <div
      className="
        flex h-screen
        overflow-hidden
        bg-background
      "
    >
      {sidebar}

      <main
        className="
          relative flex-1
          overflow-hidden
        "
      >
        {children}
      </main>

      {rightPanel}
    </div>
  );
};
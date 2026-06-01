import { useMemo } from 'react';
import { Link } from 'react-router-dom';

import { CircleCheckBig, Clock3, Radio, Sparkles } from 'lucide-react';

import { PageTransition } from '../components/PageTransition';
import { MeetingCard } from '../components/MeetingCard';
import { useMeetings, useRecordedMeetings, useLiveMeetings } from '../hooks/useMeetings';
import { useWorkspaceSelection } from '../hooks/useWorkspaceSelection';
import { useAuthStore } from '../store/authStore';

const StatCard = ({
  label,
  value,
  hint,
  icon: Icon,
}: {
  label: string;
  value: string;
  hint: string;
  icon: typeof Sparkles;
}) => (
  <div className="border border-border bg-card p-5 shadow-sm">
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
        <p className="mt-3 text-3xl font-semibold tracking-tight">{value}</p>
        <p className="mt-2 text-sm text-muted-foreground">{hint}</p>
      </div>

      <div className="flex h-11 w-11 items-center justify-center border border-border bg-background text-muted-foreground">
        <Icon size={18} />
      </div>
    </div>
  </div>
);

export const DashboardPage = () => {
  const { user } = useAuthStore();
  const { activeOrganization, channels, selectedOrganizationId } = useWorkspaceSelection();

  const { data: meetings = [] } = useMeetings(selectedOrganizationId);
  const { data: recordedMeetings = [] } = useRecordedMeetings(selectedOrganizationId);
  const { data: liveMeetings = [] } = useLiveMeetings(selectedOrganizationId);

  const upcomingMeetings = useMemo(
    () =>
      meetings.filter(
        (meeting) => meeting.status === 'upcoming' || meeting.status === 'scheduled',
      ),
    [meetings],
  );

  return (
    <PageTransition>
      <div className="flex h-full min-h-0 flex-col gap-6 overflow-hidden">
        <header className="space-y-3">
          <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
            {activeOrganization?.name || 'Workspace'}
          </p>

          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">
                My Activity
              </h1>

              <p className="mt-3 max-w-2xl text-sm text-muted-foreground md:text-base">
                Welcome back{user?.name ? `, ${user.name}` : ''}. {channels.length} channels, {upcomingMeetings.length} upcoming meetings, and {recordedMeetings.length} recordings are ready in this workspace.
              </p>
            </div>

            <Link
              to="/meetings"
              className="inline-flex items-center gap-2 border border-border bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              <Sparkles size={14} />
              Open Meetings
            </Link>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          <StatCard
            label="Upcoming"
            value={String(upcomingMeetings.length)}
            hint="Scheduled sessions waiting in this workspace"
            icon={Clock3}
          />

          <StatCard
            label="Live"
            value={String(liveMeetings.length)}
            hint="Rooms currently active right now"
            icon={Radio}
          />

          <StatCard
            label="Recorded"
            value={String(recordedMeetings.length)}
            hint="Saved recordings ready to watch"
            icon={CircleCheckBig}
          />
        </section>

        <section className="grid min-h-0 flex-1 gap-5 overflow-hidden xl:grid-cols-2">
          <div className="flex min-h-0 flex-col gap-4 overflow-hidden">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold">Upcoming Meetings</h2>
                <p className="text-sm text-muted-foreground">
                  Sessions scheduled in the selected workspace.
                </p>
              </div>
            </div>

            <div className="grid min-h-0 gap-4 overflow-hidden lg:grid-cols-2">
              {upcomingMeetings.map((meeting) => (
                <MeetingCard
                  key={meeting.id}
                  meeting={meeting}
                  variant="upcoming"
                  primaryActionLabel="Open"
                  primaryActionHref={`/meetings/${meeting.id}`}
                  creatorLabel={meeting.creator_label}
                />
              ))}

              {upcomingMeetings.length === 0 && (
                <div className="border border-dashed border-border bg-card p-5 text-sm text-muted-foreground lg:col-span-2">
                  No upcoming meetings for this workspace.
                </div>
              )}
            </div>
          </div>

          <div className="flex min-h-0 flex-col gap-4 overflow-hidden">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold">Recorded Meetings</h2>
                <p className="text-sm text-muted-foreground">
                  YouTube recordings with watch and summary actions.
                </p>
              </div>
            </div>

            <div className="grid min-h-0 gap-4 overflow-hidden lg:grid-cols-2">
              {recordedMeetings.map((meeting) => (
                <MeetingCard
                  key={meeting.id}
                  meeting={meeting}
                  variant="recorded"
                  primaryActionLabel="Watch"
                  primaryActionHref={meeting.youtube_url}
                  secondaryActionLabel="Summary"
                  secondaryActionHref={`/meetings/${meeting.id}/summary`}
                  creatorLabel={meeting.creator_label}
                />
              ))}

              {recordedMeetings.length === 0 && (
                <div className="border border-dashed border-border bg-card p-5 text-sm text-muted-foreground lg:col-span-2">
                  No recordings have been saved yet.
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
};
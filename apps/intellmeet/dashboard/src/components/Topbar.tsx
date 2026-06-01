import {
  Bell,
  Menu,
  Plus,
  Search,
  Upload,
  Video,
} from 'lucide-react';

import { useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@wraith/ui/shadcn/dialog';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@wraith/ui/shadcn/select';

import { Logo } from './Logo';

import { useOrganizations } from '../hooks/useOrganizations';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';

interface TopbarProps {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
}

export const Topbar = ({
  collapsed,
  setCollapsed,
}: TopbarProps) => {
  const { user } = useAuthStore();

  const {
    data: organizations = [],
  } = useOrganizations();

  const [selectedOrganization, setSelectedOrganization] =
    useState<string>('');

  const [open, setOpen] = useState(false);

  const [meetingType, setMeetingType] = useState<
    'new' | 'recording'
  >('new');

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: '',
    description: '',
    youtube_url: '',
    organization_id: '',
    scheduled_for: '',
  });

  const handleCreate = async () => {
    if (!form.organization_id || !form.title) {
      return;
    }

    try {
      setLoading(true);

      if (meetingType === 'recording') {
        await supabase
          .from('recorded_meetings')
          .insert({
            organization_id: form.organization_id,
            title: form.title,
            description: form.description,
            youtube_url: form.youtube_url,
            created_by: user?.id,
          });
      } else {
        await supabase
          .from('meetings')
          .insert({
            organization_id: form.organization_id,
            title: form.title,
            description: form.description,
            created_by: user?.id,
            scheduled_for: form.scheduled_for,
            status: 'upcoming',
          });
      }

      setOpen(false);

      setForm({
        title: '',
        description: '',
        youtube_url: '',
        organization_id: '',
        scheduled_for: '',
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <header
        className="
          fixed inset-x-0 top-0 z-50
          h-20
          border-b border-border
          bg-background
        "
      >
        <div className="flex h-full items-center px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() =>
                setCollapsed(!collapsed)
              }
              className="
                flex h-11 w-11 items-center
                justify-center
                border border-border
                bg-card
                text-muted-foreground
                transition-colors
                hover:text-foreground
              "
            >
              <Menu size={18} />
            </button>

            <Logo
              src="/Logo.svg"
              alt="IntellMeet"
              size={145}
              className="h-auto w-auto"
            />
          </div>

          <div className="flex flex-1 justify-center px-8">
            <div className="relative w-full max-w-3xl">
              <Search
                size={18}
                className="
                  absolute left-4 top-1/2
                  -translate-y-1/2
                  text-muted-foreground
                "
              />

              <input
                type="text"
                placeholder="Search meetings, classrooms, members..."
                className="
                  h-12 w-full
                  border border-border
                  bg-card
                  pl-11 pr-4
                  text-sm
                  outline-none
                  placeholder:text-muted-foreground
                "
              />
            </div>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <Dialog
              open={open}
              onOpenChange={setOpen}
            >
              <DialogTrigger asChild>
                <button
                  className="
                    flex h-11 items-center gap-2
                    border border-border
                    bg-card
                    px-4 text-sm
                    transition-colors
                    hover:bg-accent
                  "
                >
                  <Plus size={16} />
                  Create Meet
                </button>
              </DialogTrigger>

              <DialogContent
                className="
                  border border-border
                  bg-background
                "
              >
                <DialogHeader>
                  <DialogTitle>
                    Create Meeting
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-5 pt-2">
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() =>
                        setMeetingType('new')
                      }
                      className={`
                        flex items-center justify-center gap-2
                        border border-border
                        px-4 py-3 text-sm
                        ${
                          meetingType === 'new'
                            ? 'bg-accent text-foreground'
                            : 'bg-background text-muted-foreground'
                        }
                      `}
                    >
                      <Video size={16} />
                      New Meeting
                    </button>

                    <button
                      onClick={() =>
                        setMeetingType(
                          'recording'
                        )
                      }
                      className={`
                        flex items-center justify-center gap-2
                        border border-border
                        px-4 py-3 text-sm
                        ${
                          meetingType ===
                          'recording'
                            ? 'bg-accent text-foreground'
                            : 'bg-background text-muted-foreground'
                        }
                      `}
                    >
                      <Upload size={16} />
                      Old Recording
                    </button>
                  </div>

                  <Select
                    value={
                      form.organization_id
                    }
                    onValueChange={(value) =>
                      setForm({
                        ...form,
                        organization_id:
                          value,
                      })
                    }
                  >
                    <SelectTrigger
                      className="
                        h-12 w-full
                        border-border
                        bg-card
                        shadow-none
                      "
                    >
                      <SelectValue placeholder="Select Organization" />
                    </SelectTrigger>

                    <SelectContent>
                      {organizations.map(
                        (
                          organization: any
                        ) => (
                          <SelectItem
                            key={
                              organization.id
                            }
                            value={
                              organization.id
                            }
                          >
                            <div className="flex items-center gap-2">
                              {organization.logo_url && (
                                <img
                                  src={
                                    organization.logo_url
                                  }
                                  alt={
                                    organization.name
                                  }
                                  className="h-4 w-4 object-cover"
                                />
                              )}

                              <span>
                                {
                                  organization.name
                                }
                              </span>
                            </div>
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>

                  <input
                    type="text"
                    placeholder="Meeting title"
                    value={form.title}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        title:
                          e.target.value,
                      })
                    }
                    className="
                      h-12 w-full
                      border border-border
                      bg-card
                      px-4 text-sm
                      outline-none
                    "
                  />

                  <textarea
                    placeholder="Description"
                    value={form.description}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        description:
                          e.target.value,
                      })
                    }
                    className="
                      min-h-[120px] w-full
                      border border-border
                      bg-card
                      p-4 text-sm
                      outline-none
                    "
                  />

                  {meetingType ===
                  'recording' ? (
                    <input
                      type="text"
                      placeholder="YouTube URL"
                      value={
                        form.youtube_url
                      }
                      onChange={(e) =>
                        setForm({
                          ...form,
                          youtube_url:
                            e.target.value,
                        })
                      }
                      className="
                        h-12 w-full
                        border border-border
                        bg-card
                        px-4 text-sm
                        outline-none
                      "
                    />
                  ) : (
                    <input
                      type="datetime-local"
                      value={
                        form.scheduled_for
                      }
                      onChange={(e) =>
                        setForm({
                          ...form,
                          scheduled_for:
                            e.target.value,
                        })
                      }
                      className="
                        h-12 w-full
                        border border-border
                        bg-card
                        px-4 text-sm
                        outline-none
                      "
                    />
                  )}

                  <button
                    onClick={handleCreate}
                    disabled={loading}
                    className="
                      flex h-12 w-full
                      items-center justify-center
                      border border-border
                      bg-primary
                      text-primary-foreground
                    "
                  >
                    {loading
                      ? 'Creating...'
                      : meetingType ===
                        'recording'
                      ? 'Upload Recording'
                      : 'Create Meeting'}
                  </button>
                </div>
              </DialogContent>
            </Dialog>

            <Select
              value={selectedOrganization}
              onValueChange={
                setSelectedOrganization
              }
            >
              <SelectTrigger
                className="
                  h-11 min-w-[220px]
                  border-border
                  bg-card
                  shadow-none
                "
              >
                <SelectValue placeholder="Select Workspace" />
              </SelectTrigger>

              <SelectContent>
                {organizations.map(
                  (organization: any) => (
                    <SelectItem
                      key={organization.id}
                      value={organization.id}
                    >
                      <div className="flex items-center gap-2">
                        {organization.logo_url && (
                          <img
                            src={
                              organization.logo_url
                            }
                            alt={
                              organization.name
                            }
                            className="h-4 w-4 object-cover"
                          />
                        )}

                        <span>
                          {organization.name}
                        </span>
                      </div>
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>

            <button
              className="
                relative flex h-11 w-11
                items-center justify-center
                border border-border
                bg-card
                text-muted-foreground
                transition-colors
                hover:text-foreground
              "
            >
              <Bell size={18} />

              <span
                className="
                  absolute right-2 top-2
                  h-2 w-2
                  bg-primary
                "
              />
            </button>
          </div>
        </div>
      </header>
    </>
  );
};
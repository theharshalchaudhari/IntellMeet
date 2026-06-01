import { useMemo, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { Plus, Upload, Video } from 'lucide-react';
import toast from 'react-hot-toast';

import { Button } from '@wraith/ui/shadcn/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@wraith/ui/shadcn/dialog';
import { Input } from '@wraith/ui/shadcn/input';
import { Textarea } from '@wraith/ui/shadcn/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@wraith/ui/shadcn/select';

import { useWorkspaceSelection } from '../hooks/useWorkspaceSelection';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';

type MeetingType = 'new' | 'recording';

type FormState = {
  title: string;
  description: string;
  youtubeUrl: string;
  scheduledFor: string;
};

export const CreateMeetingDialog = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const {
    organizations,
    channels,
    selectedOrganizationId,
    selectedChannelId,
    setSelectedOrganizationId,
    setSelectedChannelId,
  } = useWorkspaceSelection();

  const [open, setOpen] = useState(false);
  const [meetingType, setMeetingType] = useState<MeetingType>('new');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<FormState>({
    title: '',
    description: '',
    youtubeUrl: '',
    scheduledFor: '',
  });

  const activeOrganization = useMemo(
    () => organizations.find((organization) => organization.id === selectedOrganizationId) ?? null,
    [organizations, selectedOrganizationId],
  );

  const resetForm = () => {
    setForm({
      title: '',
      description: '',
      youtubeUrl: '',
      scheduledFor: '',
    });
    setMeetingType('new');
    setLoading(false);
  };

  const handleSubmit = async () => {
    const organizationId = selectedOrganizationId || activeOrganization?.id || '';
    const channelId = selectedChannelId || channels[0]?.id || '';
    const title = form.title.trim();
    const description = form.description.trim();

    if (!organizationId) {
      toast.error('Select a workspace first.');
      return;
    }

    if (!channelId) {
      toast.error('Select a channel first.');
      return;
    }

    if (!title) {
      toast.error('Meeting title is required.');
      return;
    }

    if (meetingType === 'recording' && !form.youtubeUrl.trim()) {
      toast.error('YouTube URL is required for recordings.');
      return;
    }

    try {
      setLoading(true);

      if (meetingType === 'recording') {
        const { error } = await supabase.from('recorded_meetings').insert({
          organization_id: organizationId,
          channel_id: channelId,
          title,
          description: description || null,
          youtube_url: form.youtubeUrl.trim(),
          created_by: user?.id ?? null,
        });

        if (error) {
          throw error;
        }
      } else {
        const { error } = await supabase.from('meetings').insert({
          organization_id: organizationId,
          channel_id: channelId,
          title,
          description: description || null,
          status: 'upcoming',
          scheduled_for: form.scheduledFor || null,
          meeting_type: 'new',
          created_by: user?.id ?? null,
        });

        if (error) {
          throw error;
        }
      }

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['meetings', organizationId] }),
        queryClient.invalidateQueries({ queryKey: ['recorded-meetings', organizationId] }),
        queryClient.invalidateQueries({ queryKey: ['live-meetings', organizationId] }),
      ]);

      toast.success(meetingType === 'recording' ? 'Recording saved.' : 'Meeting created.');
      setOpen(false);
      resetForm();
    } catch (error) {
      console.error(error);
      toast.error('Unable to create the meeting.');
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) {
          resetForm();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button className="h-11 gap-2 px-4">
          <Plus className="size-4" />
          Create Meet
        </Button>
      </DialogTrigger>

      <DialogContent className="overflow-visible sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create meeting</DialogTitle>
          <DialogDescription>Choose the meeting type, workspace, and channel.</DialogDescription>
        </DialogHeader>

        <div className="space-y-5 pt-2">
          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant={meetingType === 'new' ? 'default' : 'outline'}
              className="justify-center gap-2"
              onClick={() => setMeetingType('new')}
            >
              <Video className="size-4" />
              New Meeting
            </Button>

            <Button
              type="button"
              variant={meetingType === 'recording' ? 'default' : 'outline'}
              className="justify-center gap-2"
              onClick={() => setMeetingType('recording')}
            >
              <Upload className="size-4" />
              Old Recording
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Select value={selectedOrganizationId} onValueChange={setSelectedOrganizationId}>
              <SelectTrigger className="h-11 w-full justify-between border-border bg-background shadow-none">
                <SelectValue placeholder="Select workspace" />
              </SelectTrigger>

              <SelectContent position="popper" sideOffset={8} className="z-[80]">
                {organizations.map((organization) => (
                  <SelectItem key={organization.id} value={organization.id}>
                    {organization.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={selectedChannelId}
              onValueChange={setSelectedChannelId}
              disabled={!channels.length}
            >
              <SelectTrigger className="h-11 w-full justify-between border-border bg-background shadow-none">
                <SelectValue placeholder="Select channel" />
              </SelectTrigger>

              <SelectContent position="popper" sideOffset={8} className="z-[80]">
                {channels.map((channel) => (
                  <SelectItem key={channel.id} value={channel.id}>
                    {channel.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Input
            type="text"
            placeholder="Meeting title"
            value={form.title}
            onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
            className="h-11"
          />

          <Textarea
            placeholder="Description"
            value={form.description}
            onChange={(event) =>
              setForm((current) => ({ ...current, description: event.target.value }))
            }
            className="min-h-32"
          />

          {meetingType === 'recording' ? (
            <Input
              type="url"
              placeholder="YouTube URL"
              value={form.youtubeUrl}
              onChange={(event) =>
                setForm((current) => ({ ...current, youtubeUrl: event.target.value }))
              }
              className="h-11"
            />
          ) : (
            <Input
              type="datetime-local"
              value={form.scheduledFor}
              onChange={(event) =>
                setForm((current) => ({ ...current, scheduledFor: event.target.value }))
              }
              className="h-11"
            />
          )}

          <Button type="button" onClick={handleSubmit} disabled={loading || !channels.length}>
            {loading ? 'Creating...' : meetingType === 'recording' ? 'Upload Recording' : 'Create Meeting'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
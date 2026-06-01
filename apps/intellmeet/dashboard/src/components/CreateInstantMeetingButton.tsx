import { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { Video } from 'lucide-react';
import toast from 'react-hot-toast';

import { Button } from '@wraith/ui/shadcn/button';

import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';

const generateMeetingCode = () => {
  const chars =
    'abcdefghijklmnopqrstuvwxyz';

  const generatePart = () =>
    Array.from({
      length: 4,
    })
      .map(
        () =>
          chars[
            Math.floor(
              Math.random() *
                chars.length,
            )
          ],
      )
      .join('');

  return `${generatePart()}-${generatePart()}-${generatePart()}`;
};

export const CreateInstantMeetingButton =
  () => {
    const navigate =
      useNavigate();

    const { user } =
      useAuthStore();

    const [loading, setLoading] =
      useState(false);

    const handleCreateMeeting =
      async () => {
        if (!user?.id) {
          toast.error(
            'You must be logged in.',
          );

          return;
        }

        try {
          setLoading(true);

          const meetingCode =
            generateMeetingCode();

          const { error } =
            await supabase
              .from('meetings')
              .insert({
                meeting_code:
                  meetingCode,

                meeting_type:
                  'instant',

                title:
                  'Instant Meeting',

                status: 'live',

                created_by:
                  user.id,

                organization_id:
                  null,

                channel_id: null,
              });

          if (error) {
            throw error;
          }

          navigate(
            `/${meetingCode}`,
          );
        } catch (error) {
          console.error(error);

          toast.error(
            'Unable to create meeting.',
          );
        } finally {
          setLoading(false);
        }
      };

    return (
      <Button
        type="button"
        onClick={
          handleCreateMeeting
        }
        disabled={loading}
        className="
          h-11 gap-2
        "
      >
        <Video className="size-4" />

        <span>
          {loading
            ? 'Starting...'
            : 'Instant Meet'}
        </span>
      </Button>
    );
  };
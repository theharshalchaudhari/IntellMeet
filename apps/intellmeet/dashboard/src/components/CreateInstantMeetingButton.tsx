import { useNavigate } from 'react-router-dom';

import { useMutation } from '@tanstack/react-query';
import { Video } from 'lucide-react';

import { Button } from '@wraith/ui/shadcn/button';

import { intellmeetRealtimeApi, type LiveKitTokenResponse, } from "../api/intellmeetRealtimeApi";

export const CreateInstantMeetingButton = () => {
  const navigate = useNavigate();

  const createMeetingMutation = useMutation<LiveKitTokenResponse, Error>({
    mutationFn: () => intellmeetRealtimeApi.createInstantMeeting(),

    onSuccess: ({ meeting }) => {
      navigate(`/${meeting.meeting_slug}`);
    },

    onError: (error) => {
      console.error('Failed to create instant meeting:', error);
    },
  });

  const handleStartMeeting = () => {
    if (createMeetingMutation.isPending) {
      return;
    }

    createMeetingMutation.mutate();
  };

  return (
    <Button
      type="button"
      onClick={handleStartMeeting}
      disabled={createMeetingMutation.isPending}
      className="h-11 gap-2"
    >
      <Video className="size-4" />

      <span>
        {createMeetingMutation.isPending
          ? 'Creating...'
          : 'Instant Meet'}
      </span>
    </Button>
  );
};
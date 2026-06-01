import { useNavigate } from 'react-router-dom';

import { Video } from 'lucide-react';

import { Button } from '@wraith/ui/shadcn/button';

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

    const handleStartMeeting =
      () => {
        const meetingCode =
          generateMeetingCode();

        navigate(
          `/${meetingCode}`,
        );
      };

    return (
      <Button
        type="button"
        onClick={handleStartMeeting}
        className="
          h-11 gap-2
        "
      >
        <Video className="size-4" />

        <span>
          Instant Meet
        </span>
      </Button>
    );
  };
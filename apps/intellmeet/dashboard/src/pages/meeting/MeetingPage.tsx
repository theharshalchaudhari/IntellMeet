import { useMemo } from 'react';

import { useLocation } from 'react-router-dom';

import { Sidebar } from '../../components/Sidebar';

import { ChatPanel } from '../../components/meeting/ChatPanel';
import { MeetingBottomOverlay } from '../../components/meeting/MeetingBottomOverlay';
import { ParticipantsPanel } from '../../components/meeting/ParticipantsPanel';
import { ReactionsLayer } from '../../components/meeting/ReactionsLayer';

import { MeetingGrid } from './MeetingGrid';
import { MeetingLayout } from './MeetingLayout';
import { MeetingTopOverlay } from './MeetingTopOverlay';

import { useMeetingStore } from '../../store/meetingStore';

export const MeetingPage = () => {
  const location =
    useLocation();

  const {
    micEnabled,

    cameraEnabled,

    chatOpen,

    participantsOpen,

    toggleMic,

    toggleCamera,

    toggleChat,

    toggleParticipants,

    toggleReactions,
  } = useMeetingStore();

  const isOrganizationMeeting =
    useMemo(
      () =>
        location.pathname.startsWith(
          '/org/',
        ),
      [location.pathname],
    );

  return (
    <MeetingLayout
      sidebar={
        isOrganizationMeeting ? (
          <Sidebar
            collapsed={false}
            micEnabled={
              micEnabled
            }
            cameraEnabled={
              cameraEnabled
            }
            onToggleMic={
              toggleMic
            }
            onToggleCamera={
              toggleCamera
            }
            onOpenChat={
              toggleChat
            }
            onOpenReactions={
              toggleReactions
            }
            onOpenSettings={() => {}}
          />
        ) : null
      }
      rightPanel={
        chatOpen ? (
          <ChatPanel />
        ) : participantsOpen ? (
          <ParticipantsPanel />
        ) : null
      }
    >
      <div
        className="
          relative h-full
          overflow-hidden
          bg-background
          p-4
        "
      >
        <MeetingTopOverlay
          title={
            isOrganizationMeeting
              ? 'Organization Meeting'
              : 'Instant Meeting'
          }
          connectionState="Connected"
          duration="00:00:00"
        />

        <MeetingGrid />

        {!isOrganizationMeeting && (
          <MeetingBottomOverlay />
        )}

        <ReactionsLayer />
      </div>
    </MeetingLayout>
  );
};
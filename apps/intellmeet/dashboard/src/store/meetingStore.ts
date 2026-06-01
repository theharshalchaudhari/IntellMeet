import { create } from 'zustand';

export type MeetingParticipant = {
  id: string;

  name: string;

  avatar_url?: string | null;

  is_muted: boolean;

  is_camera_on: boolean;

  is_screen_sharing?: boolean;
};

type MeetingStore = {
  meetingType:
    | 'instant'
    | 'organization';

  participants: MeetingParticipant[];

  pinnedParticipantId: string | null;

  micEnabled: boolean;

  cameraEnabled: boolean;

  isSharingScreen: boolean;

  chatOpen: boolean;

  participantsOpen: boolean;

  transcriptOpen: boolean;

  reactionsOpen: boolean;

  setMeetingType: (
    type:
      | 'instant'
      | 'organization',
  ) => void;

  setParticipants: (
    participants: MeetingParticipant[],
  ) => void;

  setPinnedParticipant: (
    participantId: string | null,
  ) => void;

  toggleMic: () => void;

  toggleCamera: () => void;

  toggleScreenShare: () => void;

  toggleChat: () => void;

  toggleParticipants: () => void;

  toggleTranscript: () => void;

  toggleReactions: () => void;
};

export const useMeetingStore =
  create<MeetingStore>(
    (set) => ({
      meetingType:
        'instant',

      participants: [],

      pinnedParticipantId:
        null,

      micEnabled: true,

      cameraEnabled: true,

      isSharingScreen: false,

      chatOpen: false,

      participantsOpen: false,

      transcriptOpen: false,

      reactionsOpen: false,

      setMeetingType: (
        meetingType,
      ) =>
        set({
          meetingType,
        }),

      setParticipants: (
        participants,
      ) =>
        set({
          participants,
        }),

      setPinnedParticipant: (
        pinnedParticipantId,
      ) =>
        set({
          pinnedParticipantId,
        }),

      toggleMic: () =>
        set((state) => ({
          micEnabled:
            !state.micEnabled,
        })),

      toggleCamera: () =>
        set((state) => ({
          cameraEnabled:
            !state.cameraEnabled,
        })),

      toggleScreenShare: () =>
        set((state) => ({
          isSharingScreen:
            !state.isSharingScreen,
        })),

      toggleChat: () =>
        set((state) => ({
          chatOpen:
            !state.chatOpen,
          participantsOpen: false,
          transcriptOpen: false,
        })),

      toggleParticipants:
        () =>
          set((state) => ({
            participantsOpen:
              !state.participantsOpen,
            chatOpen: false,
            transcriptOpen: false,
          })),

      toggleTranscript: () =>
        set((state) => ({
          transcriptOpen:
            !state.transcriptOpen,
          chatOpen: false,
          participantsOpen: false,
        })),

      toggleReactions: () =>
        set((state) => ({
          reactionsOpen:
            !state.reactionsOpen,
        })),
    }),
  );

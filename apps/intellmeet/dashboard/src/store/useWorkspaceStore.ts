import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface WorkspaceState {
  selectedOrganizationId: string;
  selectedChannelId: string;
  setSelectedOrganizationId: (organizationId: string) => void;
  setSelectedChannelId: (channelId: string) => void;
}

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set) => ({
      selectedOrganizationId: '',
      selectedChannelId: '',
      setSelectedOrganizationId: (organizationId) =>
        set((state) =>
          state.selectedOrganizationId === organizationId
            ? state
            : {
                selectedOrganizationId: organizationId,
                selectedChannelId: '',
              },
        ),
      setSelectedChannelId: (channelId) => set({ selectedChannelId: channelId }),
    }),
    {
      name: 'intellmeet-workspace',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        selectedOrganizationId: state.selectedOrganizationId,
        selectedChannelId: state.selectedChannelId,
      }),
    },
  ),
);
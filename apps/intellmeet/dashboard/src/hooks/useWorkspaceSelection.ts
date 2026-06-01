import { useEffect, useMemo } from 'react';

import { useOrganizations } from './useOrganizations';
import { useChannels } from './useChannels';
import { useWorkspaceStore } from '../store/useWorkspaceStore';

export const useWorkspaceSelection = () => {
  const { data: organizations = [] } = useOrganizations();
  const selectedOrganizationId = useWorkspaceStore((state) => state.selectedOrganizationId);
  const selectedChannelId = useWorkspaceStore((state) => state.selectedChannelId);
  const setSelectedOrganizationId = useWorkspaceStore((state) => state.setSelectedOrganizationId);
  const setSelectedChannelId = useWorkspaceStore((state) => state.setSelectedChannelId);

  const activeOrganization = useMemo(
    () =>
      organizations.find((organization) => organization.id === selectedOrganizationId) ??
      organizations[0] ??
      null,
    [organizations, selectedOrganizationId],
  );

  const organizationIdForChannels =
    organizations.some((organization) => organization.id === selectedOrganizationId)
      ? selectedOrganizationId
      : activeOrganization?.id;

  const { data: channels = [] } = useChannels(organizationIdForChannels);

  useEffect(() => {
    if (!organizations.length) {
      if (selectedOrganizationId) {
        setSelectedOrganizationId('');
      }

      if (selectedChannelId) {
        setSelectedChannelId('');
      }

      return;
    }

    if (activeOrganization?.id && activeOrganization.id !== selectedOrganizationId) {
      setSelectedOrganizationId(activeOrganization.id);
    }
  }, [
    activeOrganization,
    organizations,
    selectedOrganizationId,
    selectedChannelId,
    setSelectedChannelId,
    setSelectedOrganizationId,
  ]);

  useEffect(() => {
    if (!organizationIdForChannels) {
      if (selectedChannelId) {
        setSelectedChannelId('');
      }

      return;
    }

    if (!channels.length) {
      if (selectedChannelId) {
        setSelectedChannelId('');
      }

      return;
    }

    const channelExists = channels.some((channel) => channel.id === selectedChannelId);

    if (!selectedChannelId || !channelExists) {
      setSelectedChannelId(channels[0].id);
    }
  }, [channels, organizationIdForChannels, selectedChannelId, setSelectedChannelId]);

  return {
    organizations,
    channels,
    selectedOrganizationId: activeOrganization?.id ?? '',
    selectedChannelId,
    activeOrganization,
    setSelectedOrganizationId,
    setSelectedChannelId,
  };
};
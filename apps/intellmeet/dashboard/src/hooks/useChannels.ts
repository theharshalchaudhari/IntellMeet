import { useQuery } from '@tanstack/react-query';

import { supabase } from '../lib/supabase';

import type { WorkspaceChannel } from '../types';

export const useChannels = (organizationId?: string) => {
  return useQuery<WorkspaceChannel[]>({
    queryKey: ['channels', organizationId],

    enabled: Boolean(organizationId),

    queryFn: async () => {
      if (!organizationId) {
        return [];
      }

      const { data, error } = await supabase
        .from('channels')
        .select(
          'id, organization_id, name, description, created_by, created_at',
        )
        .eq('organization_id', organizationId)
        .order('created_at', { ascending: true });

      if (error) {
        throw error;
      }

      return data ?? [];
    },
  });
};
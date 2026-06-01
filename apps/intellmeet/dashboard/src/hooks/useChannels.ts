import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

export interface Channel {
  id: string;
  name: string;
}

export const useChannels = (
  organizationId?: string
) => {
  return useQuery<Channel[]>({
    queryKey: ['channels', organizationId],

    enabled: !!organizationId,

    queryFn: async () => {
      const { data, error } = await supabase
        .from('channels')
        .select('id, name')
        .eq('organization_id', organizationId);

      if (error) {
        throw error;
      }

      return data ?? [];
    },
  });
};
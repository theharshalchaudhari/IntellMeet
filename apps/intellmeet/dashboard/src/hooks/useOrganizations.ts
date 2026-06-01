import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

export interface Organization {
  id: string;
  name: string;
  logo_url: string | null;
}

export const useOrganizations = () => {
  return useQuery<Organization[]>({
    queryKey: ['organizations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('organizations')
        .select('id, name, logo_url');

      if (error) {
        throw error;
      }

      return data ?? [];
    },
  });
};
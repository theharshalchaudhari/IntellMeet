import { useQuery } from '@tanstack/react-query';

import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';

import type { WorkspaceOrganization } from '../types';

type MembershipRow = {
  organization_id: string;
  role: 'owner' | 'admin' | 'member';
};

type OrganizationRow = {
  id: string;
 name: string;
  slug: string;
  owner_id: string;
  secret_code: string;
  logo_url: string | null;
  created_at: string;
};

export const useOrganizations = () => {
  const userId = useAuthStore(
    (state) => state.user?.id ?? null,
  );

  return useQuery<
    WorkspaceOrganization[]
  >({
    queryKey: [
      'organizations',
      userId,
    ],

    enabled: !!userId,

    queryFn: async () => {
      console.log(
        'zustandUserId',
        userId,
      );

      console.log(
        'SUPABASE_URL',
        import.meta.env
          .VITE_SUPABASE_URL,
      );

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      console.log(
        'supabaseSession',
        session,
      );

      console.log(
        'sessionError',
        sessionError,
      );

      const {
        data: allMembers,
        error: allMembersError,
      } = await supabase
        .from(
          'organization_members',
        )
        .select('*');

      console.log(
        'ALL_MEMBERS',
        allMembers,
      );

      console.log(
        'ALL_MEMBERS_ERROR',
        allMembersError,
      );

      if (!userId) {
        console.log(
          'No zustand user id found',
        );

        return [];
      }

      const {
        data: memberships,
        error: membershipsError,
      } = await supabase
        .from(
          'organization_members',
        )
        .select(`
          organization_id,
          role
        `)
        .eq('user_id', userId);

      console.log(
        'memberships',
        memberships,
      );

      console.log(
        'membershipsError',
        membershipsError,
      );

      if (membershipsError) {
        throw membershipsError;
      }

      if (!memberships?.length) {
        console.log(
          'No organization memberships found',
        );

        return [];
      }

      const organizationIds =
        memberships.map(
          (membership) =>
            membership.organization_id,
        );

      console.log(
        'organizationIds',
        organizationIds,
      );

      const {
        data: organizationsData,
        error: organizationsError,
      } = await supabase
        .from('organizations')
        .select(`
          id,
          name,
          slug,
          owner_id,
          secret_code,
          logo_url,
          created_at
        `)
        .in('id', organizationIds);

      console.log(
        'organizationsData',
        organizationsData,
      );

      console.log(
        'organizationsError',
        organizationsError,
      );

      if (organizationsError) {
        throw organizationsError;
      }

      const roleMap = new Map<
        string,
        MembershipRow['role']
      >();

      memberships.forEach(
        (membership) => {
          roleMap.set(
            membership.organization_id,
            membership.role,
          );
        },
      );

      const finalOrganizations =
        (
          organizationsData as OrganizationRow[]
        )?.map((organization) => ({
          ...organization,
          role:
            roleMap.get(
              organization.id,
            ) ?? 'member',
        })) ?? [];

      console.log(
        'finalOrganizations',
        finalOrganizations,
      );

      return finalOrganizations;
    },
  });
};
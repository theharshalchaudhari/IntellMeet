import { useEffect } from 'react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@wraith/ui/shadcn/select';

import { useWorkspaceSelection } from '../hooks/useWorkspaceSelection';

type OrganizationSelectorProps = {
  className?: string;
};

export const OrganizationSelector = ({
  className,
}: OrganizationSelectorProps) => {
  const {
    organizations,
    selectedOrganizationId,
    setSelectedOrganizationId,
  } = useWorkspaceSelection();

  useEffect(() => {
    if (
      !selectedOrganizationId &&
      organizations.length > 0
    ) {
      setSelectedOrganizationId(
        organizations[0].id,
      );
    }
  }, [
    organizations,
    selectedOrganizationId,
    setSelectedOrganizationId,
  ]);

  return (
    <Select
      value={
        selectedOrganizationId || undefined
      }
      onValueChange={
        setSelectedOrganizationId
      }
      disabled={!organizations.length}
    >
      <SelectTrigger
        className={
          className ??
          `
            h-11 min-w-[240px]
            border-border
            bg-card
            shadow-none
          `
        }
      >
        <SelectValue
          placeholder={
            organizations.length
              ? 'Select workspace'
              : 'No workspaces'
          }
        />
      </SelectTrigger>

      <SelectContent
        position="popper"
        sideOffset={8}
        className="
          z-[999]
          min-w-[240px]
        "
      >
        {organizations.map(
          (organization) => (
            <SelectItem
              key={organization.id}
              value={organization.id}
              className="cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div
                  className="
                    flex h-5 w-5 shrink-0
                    items-center justify-center
                    overflow-hidden
                    border border-border
                    bg-muted
                    text-[10px]
                    font-semibold
                    text-muted-foreground
                  "
                >
                  {organization.logo_url ? (
                    <img
                      src={
                        organization.logo_url
                      }
                      alt={
                        organization.name
                      }
                      className="
                        h-full w-full
                        object-cover
                      "
                    />
                  ) : (
                    organization.name.charAt(
                      0,
                    )
                  )}
                </div>

                <div className="flex min-w-0 flex-col">
                  <span className="truncate text-sm">
                    {organization.name}
                  </span>

                  <span
                    className="
                      truncate text-xs
                      text-muted-foreground
                    "
                  >
                    {organization.role}
                  </span>
                </div>
              </div>
            </SelectItem>
          ),
        )}
      </SelectContent>
    </Select>
  );
};
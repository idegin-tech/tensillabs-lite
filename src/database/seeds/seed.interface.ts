export interface SeedData {
  users: UserSeedData[];
  workspaces: WorkspaceSeedData[];
  workspaceMembers: WorkspaceMemberSeedData[];
  roles: RoleSeedData[];
  teams: TeamSeedData[];
  offices: OfficeSeedData[];
  clients: ClientSeedData[];
  spaces?: SpaceSeedData[];
  lists?: ListSeedData[];
  spaceParticipants?: SpaceParticipantSeedData[];
  tasks?: TaskSeedData[];
}

export interface UserSeedData {
  email: string;
  password: string;
  timezone?: string;
  isEmailVerified?: boolean;
}

export interface WorkspaceSeedData {
  name: string;
  description?: string;
  slug: string;
  createdByEmail: string;
}

export interface WorkspaceMemberSeedData {
  userEmail: string;
  workspaceSlug: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  primaryEmail: string;
  secondaryEmail?: string;
  permission: 'super_admin' | 'admin' | 'manager' | 'regular';
  bio?: string;
  workPhone?: string;
  mobilePhone?: string;
  status?: 'pending' | 'active' | 'suspended';
}

export interface RoleSeedData {
  name: string;
  description?: string;
  workspaceSlug: string;
  createdByEmail: string;
  isActive?: boolean;
}

export interface TeamSeedData {
  name: string;
  description?: string;
  workspaceSlug: string;
  createdByEmail: string;
  isActive?: boolean;
}

export interface OfficeSeedData {
  name: string;
  description?: string;
  workspaceSlug: string;
  createdByEmail: string;
  isActive?: boolean;
}

export interface ClientSeedData {
  name: string;
  description?: string;
  workspaceSlug: string;
  createdByEmail: string;
  isActive?: boolean;
}

export interface SpaceSeedData {
  name: string;
  description?: string;
  color: string;
  icon: string;
  workspaceSlug: string;
  createdByEmail: string;
  isPublic?: boolean;
}

export interface ListSeedData {
  name: string;
  description?: string;
  spaceName: string;
  workspaceSlug: string;
  isPrivate?: boolean;
}

export interface SpaceParticipantSeedData {
  spaceName: string;
  workspaceSlug: string;
  memberEmail: string;
  permissions: 'admin' | 'regular';
  status?: 'active' | 'inactive';
}

export interface TaskSeedData {
  name: string;
  description?: string;
  listName: string;
  spaceName: string;
  workspaceSlug: string;
  createdByEmail: string;
  priority?: 'urgent' | 'high' | 'normal' | 'low';
  status?: 'todo' | 'in_progress' | 'in_review' | 'canceled' | 'completed';
  timeframe?: {
    start?: string;
    end?: string;
  };
  assigneeEmails?: string[];
}

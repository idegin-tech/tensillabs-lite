export interface Workspace {
  _id: string
  name: string
  description?: string
  logoURL?: {
    sm: string
    original: string
  }
  bannerURL?: {
    sm: string
    original: string
  }
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface WorkspaceMember {
  _id: string
  user: string | {
    _id: string
    email: string
    timezone: string
    isEmailVerified: boolean
  }
  workspace: string | Workspace
  avatarURL: {
    sm: string
    original: string
  }
  firstName: string
  middleName?: string
  lastName: string
  primaryEmail: string
  secondaryEmail?: string
  permission: 'super_admin' | 'admin' | 'manager' | 'regular'
  bio?: string
  workPhone?: string
  mobilePhone?: string
  status: 'pending' | 'active' | 'suspended'
  primaryRole?: string
  secondaryRoles: string[]
  primaryTeam?: string
  secondaryTeams: string[]
  lastActiveAt?: string
  invitedBy?: string
  createdAt: string
  updatedAt: string
}

export interface PaginatedWorkspaceMembers {
  docs: WorkspaceMember[]
  totalDocs: number
  limit: number
  totalPages: number
  page: number
  pagingCounter: number
  hasPrevPage: boolean
  hasNextPage: boolean
  prevPage?: number
  nextPage?: number
}

export interface WorkspaceMembershipsResponse {
  success: boolean
  message: string
  payload: PaginatedWorkspaceMembers
}

export interface GetMembershipsParams {
  page?: number
  limit?: number
  search?: string
  sortBy?: string
}

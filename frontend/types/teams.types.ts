export interface Team {
  _id: string
  name: string
  description?: string
  workspace: string
  createdBy: string | {
    _id: string
    firstName: string
    lastName: string
    primaryEmail: string
    avatarURL: {
      sm: string
      original: string
    }
  }
  isActive: boolean
  isDeleted: boolean
  createdAt: string
  updatedAt: string
}

export interface PaginatedTeams {
  docs: Team[]
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

export interface TeamsResponse {
  success: boolean
  message: string
  payload: PaginatedTeams
}

export interface GetTeamsParams {
  page?: number
  limit?: number
  search?: string
  sortBy?: string
}

export interface CreateTeamData {
  name: string
  description?: string
}

export interface UpdateTeamData {
  name?: string
  description?: string
}

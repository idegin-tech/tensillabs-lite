export interface Project {
  _id: string
  name: string
  description?: string
  client?: string | {
    _id: string
    name: string
    email?: string
  }
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

export interface PaginatedProjects {
  docs: Project[]
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

export interface ProjectsResponse {
  success: boolean
  message: string
  payload: PaginatedProjects
}

export interface GetProjectsParams {
  page?: number
  limit?: number
  search?: string
  sortBy?: string
}

export interface CreateProjectData {
  name: string
  description?: string
  client?: string
}

export interface UpdateProjectData {
  name?: string
  description?: string
  client?: string
}

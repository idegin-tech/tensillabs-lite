import { WorkspaceMember } from "./workspace.types"

export interface Role {
  _id: string
  name: string
  description?: string
  workspace: string
  createdBy: WorkspaceMember;
  isActive: boolean
  isDeleted: boolean
  createdAt: string
  updatedAt: string
}

export interface PaginatedRoles {
  docs: Role[]
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

export interface RolesResponse {
  success: boolean
  message: string
  payload: PaginatedRoles
}

export interface GetRolesParams {
  page?: number
  limit?: number
  search?: string
  sortBy?: string
}

export interface CreateRoleData {
  name: string
  description?: string
}

export interface UpdateRoleData {
  name?: string
  description?: string
}

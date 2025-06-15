export interface Office {
  _id: string
  name: string
  description?: string
  address?: string
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

export interface PaginatedOffices {
  docs: Office[]
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

export interface OfficesResponse {
  success: boolean
  message: string
  payload: PaginatedOffices
}

export interface GetOfficesParams {
  page?: number
  limit?: number
  search?: string
  sortBy?: string
}

export interface CreateOfficeData {
  name: string
  description?: string
  address?: string
}

export interface UpdateOfficeData {
  name?: string
  description?: string
  address?: string
}

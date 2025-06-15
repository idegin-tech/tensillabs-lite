export interface Client {
  _id: string
  name: string
  description?: string
  offices: string[] | Office[]
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

export interface Office {
  _id: string
  name: string
  description?: string
  address?: string
}

export interface PaginatedClients {
  docs: Client[]
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

export interface ClientsResponse {
  success: boolean
  message: string
  payload: PaginatedClients
}

export interface GetClientsParams {
  page?: number
  limit?: number
  search?: string
  sortBy?: string
}

export interface CreateClientData {
  name: string
  description?: string
  offices?: string[]
}

export interface UpdateClientData {
  name?: string
  description?: string
  offices?: string[]
}

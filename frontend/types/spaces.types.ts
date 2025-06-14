export interface SpaceParticipantMember {
  _id: string
  firstName: string
  lastName: string
  primaryEmail: string
}

export interface Space {
  _id: string
  name: string
  description?: string
  color: string
  icon: string
  createdBy: string
  isPublic: boolean
  isDeleted: boolean
  workspace: string
  createdAt: string
  updatedAt: string
  participantCount: number
  recentParticipants: SpaceParticipantMember[]
  listCount: number
}

export interface SpaceParticipant {
  _id: string
  space: Space
  member: string
  workspace: string
  role: string
  status: string
  createdAt: string
  updatedAt: string
}

export interface GetSpacesResponse {
  success: boolean
  message: string
  payload: {
    docs: SpaceParticipant[]
    totalDocs: number
    limit: number
    page: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

export interface CreateSpaceRequest {
  name: string
  description?: string
  color?: string
  icon?: string
}

export interface CreateSpaceResponse {
  success: boolean
  message: string
  payload: Space
}

export interface TasksAppState {
  showCreateSpace: boolean
  showCreateList: boolean
  spaces: Space[]
  isLoading: boolean
  error: Error | null
}

export interface TasksAppContextType {
  state: TasksAppState
  updateState: (updates: Partial<TasksAppState>) => void
  refetchSpaces: () => void
  fetchNextPage: () => void
  hasNextPage: boolean
  isFetchingNextPage: boolean
}

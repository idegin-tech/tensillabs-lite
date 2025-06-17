import { TaskList } from './tasks.types'

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

export interface CreateListRequest {
  name: string
  description?: string
  isPrivate: boolean
}

export interface CreateListResponse {
  success: boolean
  message: string
  payload: TaskList
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

export interface SpaceDetailsParticipant {
  _id: string
  firstName: string
  lastName: string
  primaryEmail: string
  role: string
  status: string
  joinedAt: string
}

export interface SpaceDetails {
  space: Omit<Space, 'participantCount' | 'recentParticipants' | 'listCount'>
  lists: TaskList[]
  recentParticipants: SpaceDetailsParticipant[]
}

export interface GetSpaceDetailsResponse {
  success: boolean
  message: string
  payload: SpaceDetails
}

export interface TasksSpaceState {
  space: SpaceDetails | null
  isLoading: boolean
  error: Error | null
}

export interface TasksSpaceContextType {
  state: TasksSpaceState
  refetchSpace: () => void
}

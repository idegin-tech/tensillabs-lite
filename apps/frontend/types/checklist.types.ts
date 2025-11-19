export interface ChecklistItem {
  _id: string
  name: string
  isDone: boolean
  task: string
  workspace: string
  space?: string
  list?: string
  createdBy: string
  createdAt: string
  updatedAt: string
  index?: number
}

export interface CreateChecklistRequest {
  name: string
  index?: number
}

export interface UpdateChecklistRequest {
  name?: string
  isDone?: boolean
  index?: number
}

export interface GetChecklistsResponse {
  success: boolean
  message: string
  payload: ChecklistItem[]
}

export interface CreateChecklistResponse {
  success: boolean
  message: string
  payload: ChecklistItem
}

export interface UpdateChecklistResponse {
  success: boolean
  message: string
  payload: ChecklistItem
}

export interface DeleteChecklistResponse {
  success: boolean
  message: string
  payload: ChecklistItem
}

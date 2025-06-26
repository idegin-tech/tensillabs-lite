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
}

export interface CreateChecklistRequest {
  name: string
  task?: string
  space?: string
  list?: string
}

export interface UpdateChecklistRequest {
  name?: string
  isDone?: boolean
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

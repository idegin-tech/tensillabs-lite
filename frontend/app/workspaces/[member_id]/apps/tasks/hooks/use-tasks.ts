'use client'

import { useApiMutation } from '@/hooks/use-api'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import useCommon from '@/hooks/use-common'
import { Task, TaskStatus, TaskPriority } from '@/types/tasks.types'
import { ChecklistItem } from '@/types/checklist.types'
import { ApiError } from '@/lib/api'

interface CreateTasksResponse {
  success: boolean
  message: string
  payload: Task[]
}

interface GetTasksByGroupResponse {
  success: boolean
  message: string
  payload: {
    tasks: Task[]
    totalCount: number
    hasMore: boolean
  }
}

interface CreateTaskData {
  name: string
  description?: string
  status: TaskStatus
  priority?: TaskPriority
  timeframe?: {
    start?: string
    end?: string
  }
}

interface CreateTasksRequest {
  tasks: CreateTaskData[]
}

interface GetTasksByGroupParams {
  page?: number
  limit?: number
  meMode?: boolean
  groupBy?: string
  status?: string
  priority?: string
  due_status?: string
  assignee_id?: string
}

interface UpdateTasksResponse {
  success: boolean
  message: string
  payload: Task
}

interface UpdateTaskData {
  status?: TaskStatus
  priority?: TaskPriority
  timeframe?: {
    start?: string
    end?: string
  }
  assignee?: string[]
  name?: string
  description?: string
}

interface UpdateTaskRequest {
  taskId: string
  data: UpdateTaskData
}

interface GetTaskDetailsResponse {
  success: boolean
  message: string
  payload: {
    task: Task
    checklist: ChecklistItem[]
  }
}

export function useCreateTasks(listId: string) {
  const { member_id } = useCommon()

  return useApiMutation<CreateTasksResponse, CreateTasksRequest>(
    async (data) => {
      return api.post<CreateTasksResponse>(`/lists/${listId}/tasks`, data, {
        headers: {
          'x-member-id': member_id,
        },
      })
    }
  )
}

export function useGetTasksByGroup(listId: string, params: GetTasksByGroupParams, enabled = true) {
  const { member_id } = useCommon()
  
  const queryParams = new URLSearchParams()
  if (params.page) queryParams.append('page', params.page.toString())
  if (params.limit) queryParams.append('limit', params.limit.toString())
  if (params.meMode !== undefined) queryParams.append('meMode', params.meMode.toString())
  if (params.status) queryParams.append('status', params.status)
  if (params.priority) queryParams.append('priority', params.priority)
  if (params.due_status) queryParams.append('due_status', params.due_status)
  if (params.assignee_id) queryParams.append('assignee_id', params.assignee_id)

  const endpoint = `/lists/${listId}/tasks/group?${queryParams}`

  return useQuery<GetTasksByGroupResponse, ApiError>({
    queryKey: [`tasks-by-group`, listId, JSON.stringify(params)],
    queryFn: () => api.get<GetTasksByGroupResponse>(endpoint, {
      headers: {
        'x-member-id': member_id,
      },
    }),
    enabled,
    staleTime: 1 * 1000 * 60, 
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  })
}

export function useUpdateTask(listId: string) {
  const { member_id } = useCommon()

  return useApiMutation<UpdateTasksResponse, UpdateTaskRequest>(
    async ({ taskId, data }) => {
      return api.put<UpdateTasksResponse>(`/lists/${listId}/tasks/${taskId}`, data, {
        headers: {
          'x-member-id': member_id,
        },
      })
    }
  )
}

export function useGetTaskDetails(listId: string, taskId: string, enabled = true) {
  const { member_id } = useCommon()

  return useQuery({
    queryKey: ['task-details', listId, taskId, member_id],
    queryFn: async () => {
      const response = await api.get<GetTaskDetailsResponse>(`/lists/${listId}/tasks/${taskId}`, {
        headers: {
          'x-member-id': member_id,
        },
      })
      return response
    },
    enabled: !!(listId && taskId && member_id && enabled),
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
  })
}

'use client'

import { useApiMutation } from '@/hooks/use-api'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import useCommon from '@/hooks/use-common'
import { Task, TaskStatus, TaskPriority } from '@/types/tasks.types'
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
  status?: string
  priority?: string
  due_status?: string
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

  const endpoint = `/lists/${listId}/tasks/group?${queryParams}`

  return useQuery<GetTasksByGroupResponse, ApiError>({
    queryKey: [`tasks-by-group`, listId, JSON.stringify(params)],
    queryFn: () => api.get<GetTasksByGroupResponse>(endpoint, {
      headers: {
        'x-member-id': member_id,
      },
    }),
    enabled,
    staleTime: 1000 * 60 * 5,
  })
}

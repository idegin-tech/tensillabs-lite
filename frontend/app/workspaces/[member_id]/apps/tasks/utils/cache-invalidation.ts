import { QueryClient } from '@tanstack/react-query'
import { Task } from '@/types/tasks.types'
import { taskGroupConfig } from '../task-app.config'
import { GroupByType } from '../contexts/task-list.context'

interface InvalidationParams {
  listId: string
  groupBy: GroupByType
  task?: Task
  previousTask?: Task
  queryClient: QueryClient
}

const debouncedInvalidations = new Map<string, NodeJS.Timeout>()

export function getGroupQueryParams(groupBy: GroupByType, task: Task) {
  if (groupBy === 'none') {
    return {}
  }

  const groupConfigs = taskGroupConfig[groupBy] || []
  
  for (const config of groupConfigs) {
    const query = config.query
    let matches = true

    if (query.status && task.status !== query.status) {
      matches = false
    }
    if (query.priority && task.priority !== query.priority) {
      matches = false
    }
    if (query.due_status) {
      matches = false
    }

    if (matches) {
      return query
    }
  }

  return {}
}

export function invalidateTaskGroups({
  listId,
  groupBy,
  task,
  previousTask,
  queryClient
}: InvalidationParams) {
  if (!task || !previousTask || groupBy === 'none') {
    return
  }

  const hasGroupingFieldChanged = 
    (groupBy === 'status' && task.status !== previousTask.status) ||
    (groupBy === 'priority' && task.priority !== previousTask.priority) ||
    (groupBy === 'due_date' && task.timeframe?.end !== previousTask.timeframe?.end)

  const invalidationKey = `${listId}-${groupBy}`
  
  if (debouncedInvalidations.has(invalidationKey)) {
    clearTimeout(debouncedInvalidations.get(invalidationKey)!)
  }

  const timeout = setTimeout(() => {
    if (hasGroupingFieldChanged) {
      queryClient.invalidateQueries({
        queryKey: [`tasks-by-group`, listId],
        exact: false
      })
    } else {
      const oldGroupQuery = getGroupQueryParams(groupBy, previousTask)
      queryClient.invalidateQueries({
        queryKey: [`tasks-by-group`, listId, JSON.stringify({ 
          page: 1, 
          limit: 20, 
          ...oldGroupQuery 
        })],
        exact: true
      })
    }
    debouncedInvalidations.delete(invalidationKey)
  }, 300)

  debouncedInvalidations.set(invalidationKey, timeout)
}

export function invalidateTaskDetails(listId: string, taskId: string, memberId: string, queryClient: QueryClient) {
  queryClient.invalidateQueries({
    queryKey: ['task-details', listId, taskId, memberId]
  })
}
'use client'

import React from 'react'
import InputSelector, { InputSelectorData } from '@/components/InputSelector'
import { BaseSelectorProps } from '@/types/selector.types'
import { useSearchTasks } from '../hooks/use-tasks'

interface TaskSelectorProps extends BaseSelectorProps {
  listId?: string
  spaceId?: string
  excludeTaskIds?: string[]
}

export default function TaskSelector({
  value,
  onChange,
  placeholder = "Select tasks...",
  disabled = false,
  className,
  isMulti = true,
  listId,
  spaceId,
  excludeTaskIds = []
}: TaskSelectorProps) {
  const [searchTerm, setSearchTerm] = React.useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = React.useState('')
  const [isOpen, setIsOpen] = React.useState(false)

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 400)

    return () => clearTimeout(timer)
  }, [searchTerm])

  const { tasks, isLoading, error, refetch } = useSearchTasks(
    {
      search: debouncedSearchTerm,
      listId,
      spaceId,
      limit: 50
    },
    {
      enabled: isOpen
    }
  )

  const options: InputSelectorData[] = React.useMemo(() => {
    const filteredTasks = tasks.filter(task => !excludeTaskIds.includes(task._id))
    
    return filteredTasks.map(task => ({
      label: task.name,
      value: task._id,
      description: task.task_id,
      metadata: {
        status: task.status,
        priority: task.priority
      }
    }))
  }, [tasks, excludeTaskIds])

  const handleSearchChange = (search: string) => {
    setSearchTerm(search)
  }

  const handleRetry = () => {
    refetch()
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (open && !debouncedSearchTerm) {
      refetch()
    }
  }

  return (
    <InputSelector
      options={options}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className={className}
      showImage={false}
      isLoading={isLoading}
      hasError={!!error}
      onRetry={handleRetry}
      searchPlaceholder="Search tasks by name..."
      emptyMessage="No tasks found."
      onSearchChange={handleSearchChange}
      onOpenChange={handleOpenChange}
      isMulti={isMulti}
    />
  )
}

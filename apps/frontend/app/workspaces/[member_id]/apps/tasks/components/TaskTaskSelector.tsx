'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Check, Loader2, X, Plus } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { useSearchTasks } from '../hooks/use-tasks'
import { Task } from '@/types/tasks.types'
import { TbSquareRoundedMinus } from 'react-icons/tb'
import { useParams } from 'next/navigation'

interface TaskBlockingSelectorProps {
    value: string[]
    onChange: (taskIds: string[]) => void
    placeholder?: string
    disabled?: boolean
    className?: string
    currentTaskId?: string
    allTasks?: Task[]
    maxVisible?: number
    displayMode?: 'compact' | 'full'
}

export default function TaskTaskSelector({
    value = [],
    onChange,
    placeholder = "Add blocking tasks",
    disabled = false,
    className,
    currentTaskId,
    allTasks = [],
    maxVisible = 3,
    displayMode = 'full'
}: TaskBlockingSelectorProps) {
    const params = useParams()
    const listId = params.list_id as string
    const spaceId = params.space_id as string

    const [open, setOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
    const [pendingValue, setPendingValue] = useState<string[]>(value)

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm)
        }, 300)
        return () => clearTimeout(timer)
    }, [searchTerm])

    useEffect(() => {
        setPendingValue(value)
    }, [value])

    const { tasks, isLoading } = useSearchTasks(
        {
            search: debouncedSearchTerm,
            listId,
            spaceId,
            limit: 50
        },
        {
            enabled: open
        }
    )

    const availableTasks = tasks.filter(task =>
        task._id !== currentTaskId && !pendingValue.includes(task._id)
    )

    const selectedTasks = useMemo(() => {
        const tasksFromAllTasks = allTasks.filter(task => value.includes(task._id))
        const tasksFromSearch = tasks.filter(task => value.includes(task._id))
        
        const combinedMap = new Map<string, Task>()
        
        tasksFromAllTasks.forEach(task => combinedMap.set(task._id, task))
        tasksFromSearch.forEach(task => combinedMap.set(task._id, task))
        
        return Array.from(combinedMap.values())
    }, [value, allTasks, tasks])

    const isSelected = (taskId: string) => {
        return pendingValue.includes(taskId)
    }

    const handleSelect = (task: Task) => {
        if (isSelected(task._id)) {
            setPendingValue(pendingValue.filter(id => id !== task._id))
        } else {
            setPendingValue([...pendingValue, task._id])
        }
    }

    const handleRemove = (taskId: string, e?: React.MouseEvent) => {
        e?.preventDefault()
        e?.stopPropagation()
        setPendingValue(pendingValue.filter(id => id !== taskId))
    }

    const handleOpenChange = (open: boolean) => {
        setOpen(open)

        if (!open) {
            onChange(pendingValue)
        }
    }

    const renderSelectedBadges = () => {
        if (selectedTasks.length === 0) return null

        if (displayMode === 'compact') {
            const firstTask = selectedTasks[0]
            const remainingCount = selectedTasks.length - 1

            return (
                <div className="flex items-center gap-1.5">
                    <Badge
                        variant="outline"
                        className="gap-1 font-normal text-xs h-6 text-muted-foreground border-secondary/40"
                    >
                        <span className="max-w-[100px] truncate">{firstTask.name}</span>
                    </Badge>
                    {remainingCount > 0 && (
                        <Badge variant="outline" className="font-normal text-xs h-6 text-muted-foreground border-secondary/40">
                            +{remainingCount}
                        </Badge>
                    )}
                </div>
            )
        }

        const visibleTasks = selectedTasks.slice(0, maxVisible)
        const remainingCount = selectedTasks.length - maxVisible

        return (
            <div className="flex items-center gap-1.5 flex-wrap">
                {visibleTasks.map((task) => (
                    <Badge
                        key={task._id}
                        variant="secondary"
                        className="gap-1.5 font-normal hover:bg-secondary/80"
                    >
                        <TbSquareRoundedMinus className="h-3.5 w-3.5 text-orange-500" />
                        <span className="max-w-[120px] truncate">{task.name}</span>
                    </Badge>
                ))}
                {remainingCount > 0 && (
                    <Badge variant="secondary" className="font-normal">
                        +{remainingCount}
                    </Badge>
                )}
            </div>
        )
    }

    return (
        <Popover open={open} onOpenChange={handleOpenChange}>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    role="combobox"
                    aria-expanded={open}
                    className={cn(
                        "h-7 w-full justify-start font-normal hover:bg-muted/50 px-2",
                        !value.length && "text-muted-foreground text-xs",
                        className
                    )}
                    disabled={disabled}
                >
                    {value.length > 0 ? (
                        renderSelectedBadges()
                    ) : (
                        <span className="flex items-center gap-1.5">
                            <Plus className="h-4 w-4" />
                            {placeholder}
                        </span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-96 p-0" align="start">
                <Command>
                    <CommandInput
                        placeholder="Search tasks by name..."
                        value={searchTerm}
                        onValueChange={setSearchTerm}
                    />
                    <CommandList>
                        {isLoading ? (
                            <div className="flex items-center justify-center py-6">
                                <Loader2 className="h-4 w-4 animate-spin" />
                            </div>
                        ) : (
                            <>
                                <CommandEmpty>No tasks found.</CommandEmpty>
                                <CommandGroup>
                                    {availableTasks.map((task) => (
                                        <CommandItem
                                            key={task._id}
                                            value={task.name}
                                            onSelect={() => handleSelect(task)}
                                            className="flex items-center gap-3 py-2"
                                        >
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate">
                                                    {task.name}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {task.task_id}
                                                </p>
                                            </div>
                                            <Check
                                                className={cn(
                                                    "h-4 w-4",
                                                    isSelected(task._id) ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </>
                        )}
                    </CommandList>
                </Command>

                {pendingValue.length > 0 && (
                    <div className="border-t p-3">
                        <div className="text-xs text-muted-foreground mb-2">
                            Blocking ({pendingValue.length})
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                            {allTasks.filter(t => pendingValue.includes(t._id)).map((task) => (
                                <Badge key={task._id} variant="secondary" className="gap-1.5">
                                    <TbSquareRoundedMinus className="h-3.5 w-3.5 text-orange-500" />
                                    <span className="text-xs">{task.task_id}</span>
                                    <span className="max-w-[150px] truncate text-xs">{task.name}</span>
                                    <button
                                        onClick={(e) => handleRemove(task._id, e)}
                                        className="ml-1 hover:bg-muted rounded-full p-0.5"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}
            </PopoverContent>
        </Popover>
    )
}

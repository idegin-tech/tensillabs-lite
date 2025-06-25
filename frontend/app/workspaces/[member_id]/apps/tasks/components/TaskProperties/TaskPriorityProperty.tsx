'use client'

import { TaskPriority } from '@/types/tasks.types'
import React, { useState } from 'react'
import { TbFlag, TbFlag2Filled, TbFlagExclamation, TbFlagDown } from 'react-icons/tb'
import { TaskPropertyProps } from '.'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { cn } from '@/lib/utils'

export default function TaskPriorityProperty({ onChange, value }: TaskPropertyProps) {
  const [internalValue, setInternalValue] = useState<TaskPriority | undefined>(value)

  const getPriorityIcon = (priority?: TaskPriority) => {
    switch (priority) {
      case TaskPriority.URGENT:
        return <TbFlagExclamation className="h-4 w-4 text-red-600" />
      case TaskPriority.HIGH:
        return <TbFlag2Filled className="h-4 w-4 text-orange-600" />
      case TaskPriority.NORMAL:
        return <TbFlag className="h-4 w-4 text-blue-600" />
      case TaskPriority.LOW:
        return <TbFlagDown className="h-4 w-4 text-gray-600" />
      default:
        return <TbFlag className="h-4 w-4 text-gray-400" />
    }
  }

  const getPriorityLabel = (priority?: TaskPriority) => {
    if (!priority) return 'No Priority'
    return priority.charAt(0).toUpperCase() + priority.slice(1)
  }

  const priorityOptions = [undefined, ...Object.values(TaskPriority)]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className={cn("w-[150px] h-8 justify-start p-1 font-normal", {
          "text-muted opacity-70": !internalValue,
        })}>
          <div className="flex items-center gap-2">
            {getPriorityIcon(internalValue)}
            <span className="text-sm">{getPriorityLabel(internalValue)}</span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[150px]">
        {priorityOptions.map((priority) => (          <DropdownMenuItem 
            key={priority || 'none'} 
            onClick={() => {
              setInternalValue(priority)
              onChange?.(priority)
            }}
            className={internalValue === priority ? "bg-accent" : ""}
          >
            <div className="flex items-center gap-2">
              {getPriorityIcon(priority)}
              <span>{getPriorityLabel(priority)}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

'use client'

import { TaskStatus } from '@/types/tasks.types'
import React, { useState } from 'react'
import { TbAlertTriangle, TbCircle, TbCircleCheck, TbClock, TbX } from 'react-icons/tb'
import { TaskPropertyProps } from '.'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

export default function TaskStatusProperty({ onChange, value }: TaskPropertyProps) {
  const [internalValue, setInternalValue] = useState<TaskStatus>(value || TaskStatus.TODO)

  const handleStatusChange = (status: TaskStatus) => {
    setInternalValue(status)
    setTimeout(() => {
      onChange?.(status)
    }, 50);
  }

  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.COMPLETED:
        return <TbCircleCheck className="h-4 w-4 text-green-600" />
      case TaskStatus.IN_PROGRESS:
        return <TbClock className="h-4 w-4 text-blue-600" />
      case TaskStatus.IN_REVIEW:
        return <TbAlertTriangle className="h-4 w-4 text-orange-600" />
      case TaskStatus.CANCELED:
        return <TbX className="h-4 w-4 text-red-600" />
      default:
        return <TbCircle className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusLabel = (status: TaskStatus) => {
    return status?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  const statusOptions = Object.values(TaskStatus)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="w-[150px] h-8 justify-start p-1 font-normal">
          <div className="flex items-center gap-2">
            {getStatusIcon(internalValue)}
            <span className="text-sm">{getStatusLabel(internalValue)}</span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[150px]">        
        {statusOptions.map((status) => (
          <DropdownMenuItem 
            key={status} 
            onClick={() => handleStatusChange(status)}
            className={internalValue === status ? "bg-accent" : ""}
          >
            <div className="flex items-center gap-2">
              {getStatusIcon(status)}
              <span>{getStatusLabel(status)}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
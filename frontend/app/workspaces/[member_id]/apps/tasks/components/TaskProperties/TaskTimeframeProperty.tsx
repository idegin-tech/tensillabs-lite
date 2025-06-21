'use client'

import React, { useState, useEffect } from 'react'
import { TbCalendar } from 'react-icons/tb'
import { TaskPropertyProps } from '.'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { DateRange } from "react-day-picker"
import { format } from "date-fns"

interface TaskTimeframe {
  start?: string
  end?: string
}

export default function TaskTimeframeProperty({ onChange, value }: TaskPropertyProps) {
  const [internalValue, setInternalValue] = useState<TaskTimeframe | undefined>(value)
  const [isOpen, setIsOpen] = useState(false)
  const [pendingValue, setPendingValue] = useState<TaskTimeframe | undefined>(value)

  useEffect(() => {
    setInternalValue(value)
    setPendingValue(value)
  }, [value])
  
  const formatTimeframe = (timeframe?: TaskTimeframe) => {
    if (!timeframe?.start && !timeframe?.end) return 'No timeframe'
    
    const startDate = timeframe.start ? new Date(timeframe.start) : null
    const endDate = timeframe.end ? new Date(timeframe.end) : null
    
    if (startDate && endDate) {
      return `${format(startDate, 'MMM d')} → ${format(endDate, 'MMM d')}`
    } else if (startDate) {
      return `From ${format(startDate, 'MMM d')}`
    } else if (endDate) {
      return `Until ${format(endDate, 'MMM d')}`
    }
      return 'No timeframe'
  }

  const handlePopoverOpenChange = (open: boolean) => {
    setIsOpen(open)
    
    if (!open && pendingValue !== internalValue) {
      setInternalValue(pendingValue)
      onChange?.(pendingValue)
    }
  }
  
  const handleDateRangeChange = (range: DateRange | undefined) => {
    let newTimeframe: TaskTimeframe | undefined
    
    if (range?.from || range?.to) {
      newTimeframe = {
        start: range?.from?.toISOString(),
        end: range?.to?.toISOString()
      }
    } else {
      newTimeframe = undefined
    }
    
    setPendingValue(newTimeframe)
  }

  const handleClearTimeframe = () => {
    setPendingValue(undefined)
    setInternalValue(undefined)
    onChange?.(undefined)
    setIsOpen(false)
  }
  const getCurrentDateRange = (): DateRange | undefined => {
    if (!pendingValue) return undefined
    
    return {
      from: pendingValue.start ? new Date(pendingValue.start) : undefined,
      to: pendingValue.end ? new Date(pendingValue.end) : undefined
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={handlePopoverOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="w-full h-8 justify-start p-1 border-none shadow-none">
          <div className="flex items-center gap-2">
            <TbCalendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{formatTimeframe(internalValue)}</span>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          selected={getCurrentDateRange()}
          onSelect={handleDateRangeChange}
          numberOfMonths={2}
          className="rounded-md border"
        />
        <div className="p-3 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearTimeframe}
            className="w-full"
          >
            Clear timeframe
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

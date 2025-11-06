'use client'

import React, { useState, useEffect } from 'react'
import { TaskPropertyProps } from '.'
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export default function TaskDueDateProperty({ onChange, value }: TaskPropertyProps) {
  const [internalValue, setInternalValue] = useState<Date | undefined>(
    value ? new Date(value) : undefined
  )

  useEffect(() => {
    setInternalValue(value ? new Date(value) : undefined)
  }, [value])

  const handleSelect = (date: Date | undefined) => {
    setInternalValue(date)
    onChange?.(date ? date.toISOString() : null)
  }

  const handleClear = () => {
    setInternalValue(undefined)
    onChange?.(null)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "w-full h-8 justify-start text-left font-normal",
            !internalValue && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {internalValue ? format(internalValue, "PPP") : "No due date"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={internalValue}
          onSelect={handleSelect}
          initialFocus
        />
        {internalValue && (
          <div className="p-3 border-t">
            <Button
              variant="ghost"
              className="w-full"
              onClick={handleClear}
            >
              Clear
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}

import * as React from "react"
import { useDebouncedCallback } from "use-debounce"
import TextareaAutosize from "react-textarea-autosize"

import { cn } from "@/lib/utils"

interface TextareaProps extends Omit<React.ComponentProps<typeof TextareaAutosize>, "onChange"> {
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  debounceMs?: number
  onDebouncedChange?: (value: string) => void
  autosize?: boolean
  minRows?: number
  maxRows?: number
}

function Textarea({ 
  className, 
  onChange, 
  debounceMs, 
  onDebouncedChange,
  autosize = false,
  minRows,
  maxRows,
  ...props 
}: TextareaProps) {
  const debouncedCallback = useDebouncedCallback(
    (value: string) => {
      onDebouncedChange?.(value)
    },
    debounceMs || 0
  )

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange?.(e)
    
    if (debounceMs && onDebouncedChange) {
      debouncedCallback(e.target.value)
    }
  }

  const baseClasses = cn(
    "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
    className
  )

  if (autosize) {
    return (
      <TextareaAutosize
        data-slot="textarea"
        className={baseClasses}
        onChange={handleChange}
        minRows={minRows}
        maxRows={maxRows}
        {...props}
      />
    )
  }

  return (
    <textarea
      data-slot="textarea"
      className={baseClasses}
      onChange={handleChange}
      {...props}
    />
  )
}

export { Textarea }

'use client'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

interface ColorSelectorProps {
  value: string
  onChange: (value: string) => void
  children?: React.ReactNode
}

const colorOptions = [
  { value: '#1F2937', name: 'Gray' },
  { value: '#7F1D1D', name: 'Red' },
  { value: '#92400E', name: 'Orange' },
  { value: '#365314', name: 'Green' },
  { value: '#064E3B', name: 'Emerald' },
  { value: '#0891B2', name: 'Cyan' },
  { value: '#2563EB', name: 'Blue' },
  { value: '#4F46E5', name: 'Indigo' },
  { value: '#7C3AED', name: 'Purple' },
  { value: '#C026D3', name: 'Fuchsia' },
  { value: '#BE185D', name: 'Pink' },
  { value: '#7C2D12', name: 'Brown' }
]

export default function ColorSelector({ value, onChange, children }: ColorSelectorProps) {
  const [open, setOpen] = useState(false)
  
  const selectedColor = colorOptions.find(color => color.value === value) || colorOptions[0]

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {children || (
          <Button variant="outline" className="w-full justify-start gap-3">
            <div 
              className="w-4 h-4 rounded-full border border-border" 
              style={{ backgroundColor: selectedColor.value }}
            />
            {selectedColor.name}
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-full min-w-20 p-4">
        <div className="grid grid-cols-8 gap-2">
          {colorOptions.map((color) => (
            <button
              key={color.value}
              onClick={() => {
                onChange(color.value)
                setOpen(false)
              }}
              className={cn(
                'w-8 h-8 rounded-lg border-2 transition-all hover:scale-105',
                value === color.value ? 'border-primary ring-2 ring-primary ring-offset-2' : 'border-border'
              )}
              style={{ backgroundColor: color.value }}
              title={color.name}
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}

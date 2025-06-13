'use client'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

interface IconSelectorProps {
  value: string
  onChange: (value: string) => void
}

const iconOptions = [
  'fas fa-folder',
  'fas fa-star',
  'fas fa-heart',
  'fas fa-lightbulb',
  'fas fa-rocket',
  'fas fa-trophy',
  'fas fa-flag',
  'fas fa-bookmark',
  'fas fa-diamond',
  'fas fa-crown',
  'fas fa-fire',
  'fas fa-bolt',
  'fas fa-shield',
  'fas fa-gear',
  'fas fa-chart-pie',
  'fas fa-globe',
  'fas fa-user-group',
  'fas fa-building',
  'fas fa-briefcase',
  'fas fa-calendar',
  'fas fa-camera',
  'fas fa-music',
  'fas fa-code',
  'fas fa-palette',
  'fas fa-wrench',
  'fas fa-graduation-cap',
  'fas fa-handshake',
  'fas fa-map',
  'fas fa-mobile',
  'fas fa-cloud',
  'fas fa-lock',
  'fas fa-signal',
  'fas fa-book',
  'fas fa-bell',
  'fas fa-envelope'
]

export default function IconSelector({ value, onChange }: IconSelectorProps) {
  const [open, setOpen] = useState(false)
  
  const getIconName = (iconClass: string) => {
    const name = iconClass.replace('fas fa-', '').replace('-', ' ')
    return name.charAt(0).toUpperCase() + name.slice(1)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-start gap-3">
          <i className={cn(value || 'fas fa-folder', 'text-lg')} />
          {getIconName(value || 'fas fa-folder')}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4">
        <div className="grid grid-cols-7 gap-2">
          {iconOptions.map((icon) => (
            <button
              key={icon}
              onClick={() => {
                onChange(icon)
                setOpen(false)
              }}
              className={cn(
                'w-8 h-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors',
                value === icon && 'bg-primary text-primary-foreground'
              )}
            >
              <i className={cn(icon, 'text-md')} />
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}

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
  'fa-folder',
  'fa-star',
  'fa-heart',
  'fa-lightbulb',
  'fa-rocket',
  'fa-trophy',
  'fa-flag',
  'fa-bookmark',
  'fa-diamond',
  'fa-crown',
  'fa-fire',
  'fa-bolt',
  'fa-shield',
  'fa-gear',
  'fa-chart-pie',
  'fa-globe',
  'fa-user-group',
  'fa-building',
  'fa-briefcase',
  'fa-calendar',
  'fa-camera',
  'fa-music',
  'fa-code',
  'fa-palette',
  'fa-wrench',
  'fa-graduation-cap',
  'fa-handshake',
  'fa-map',
  'fa-mobile',
  'fa-cloud',
  'fa-lock',
  'fa-signal',
  'fa-book',
  'fa-bell',
  'fa-envelope'
]

export default function IconSelector({ value, onChange }: IconSelectorProps) {
  const [open, setOpen] = useState(false)
  const getIconName = (iconClass: string) => {
    const name = iconClass.replace('fa-', '').replace('-', ' ')
    return name.charAt(0).toUpperCase() + name.slice(1)
  }

  const getDisplayIcon = (iconValue: string) => {
    return iconValue?.startsWith('fas ') ? iconValue : `fas ${iconValue || 'fa-folder'}`
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-start gap-3">
          <i className={cn(getDisplayIcon(value), 'text-lg')} />
          {getIconName(value || 'fa-folder')}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4">
        <div className="grid grid-cols-7 gap-2">
          {iconOptions.map((icon) => (<button
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
            <i className={cn(`fas ${icon}`, 'text-md')} />
          </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}

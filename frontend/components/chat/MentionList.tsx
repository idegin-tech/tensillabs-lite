'use client'

import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { cn } from '@/lib/utils'

export interface MentionItem {
  id: string
  label: string
  email?: string
  avatar?: string
}

export interface MentionListProps {
  items: MentionItem[]
  command: (item: MentionItem) => void
}

export interface MentionListRef {
  onKeyDown: (props: { event: KeyboardEvent }) => boolean
}

const MentionList = forwardRef<MentionListRef, MentionListProps>((props, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0)

  const selectItem = (index: number) => {
    const item = props.items[index]
    if (item) {
      props.command(item)
    }
  }

  const upHandler = () => {
    setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length)
  }

  const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % props.items.length)
  }

  const enterHandler = () => {
    selectItem(selectedIndex)
  }

  useEffect(() => setSelectedIndex(0), [props.items])

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: { event: KeyboardEvent }) => {
      if (event.key === 'ArrowUp') {
        upHandler()
        return true
      }

      if (event.key === 'ArrowDown') {
        downHandler()
        return true
      }

      if (event.key === 'Enter') {
        enterHandler()
        return true
      }

      return false
    },
  }))

  if (props.items.length === 0) {
    return (
      <div className="bg-popover text-popover-foreground rounded-lg border shadow-lg p-4 min-w-[200px]">
        <div className="text-sm text-muted-foreground text-center">No members found</div>
      </div>
    )
  }

  return (
    <div className="bg-popover text-popover-foreground rounded-lg border shadow-lg overflow-hidden min-w-[280px] max-h-[320px] overflow-y-auto">
      {props.items.map((item, index) => (
        <button
          className={cn(
            'flex items-center gap-3 w-full px-3 py-2.5 text-left transition-colors',
            'hover:bg-accent hover:text-accent-foreground',
            'focus:bg-accent focus:text-accent-foreground focus:outline-none',
            index === selectedIndex && 'bg-accent text-accent-foreground'
          )}
          key={item.id}
          onClick={() => selectItem(index)}
          type="button"
        >
          <div className="flex-shrink-0">
            {item.avatar ? (
              <div 
                className="h-8 w-8 rounded-full bg-muted bg-cover bg-center ring-2 ring-background"
                style={{ backgroundImage: `url(${item.avatar})` }}
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center ring-2 ring-background">
                <span className="text-xs font-semibold text-primary">
                  {item.label
                    .split(' ')
                    .map(n => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2)}
                </span>
              </div>
            )}
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-sm font-medium truncate">{item.label}</span>
            {item.email && (
              <span className="text-xs text-muted-foreground truncate">{item.email}</span>
            )}
          </div>
          {index === selectedIndex && (
            <div className="flex-shrink-0">
              <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            </div>
          )}
        </button>
      ))}
    </div>
  )
})

MentionList.displayName = 'MentionList'

export default MentionList

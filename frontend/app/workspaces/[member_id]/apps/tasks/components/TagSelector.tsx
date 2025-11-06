'use client'

import { useState, useEffect, useRef } from 'react'
import { Check, Plus, MoreVertical, Edit2, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { colord } from 'colord'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'
import { TaskTag } from '@/types/tasks.types'
import { cn } from '@/lib/utils'
import { useUpdateList } from '@/hooks/use-list'

const TAG_COLORS = [
  { label: 'Blue', value: '#2563EB' },
  { label: 'Purple', value: '#7C3AED' },
  { label: 'Pink', value: '#DB2777' },
  { label: 'Red', value: '#DC2626' },
  { label: 'Orange', value: '#EA580C' },
  { label: 'Yellow', value: '#CA8A04' },
  { label: 'Green', value: '#16A34A' },
  { label: 'Teal', value: '#0D9488' },
  { label: 'Cyan', value: '#0891B2' },
  { label: 'Gray', value: '#6B7280' },
]

const getTextColor = (backgroundColor: string): string => {
  const color = colord(backgroundColor)
  return color.brightness() > 0.3 ? '#000000' : '#FFFFFF'
}

interface TagSelectorProps {
  listId: string
  availableTags: TaskTag[]
  selectedTags: string[]
  onChange: (tags: string[]) => void
  disabled?: boolean
  className?: string
}

export function TagSelector({
  listId,
  availableTags,
  selectedTags,
  onChange,
  disabled,
  className
}: TagSelectorProps) {
  const [open, setOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [editingTag, setEditingTag] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const updateList = useUpdateList()

  const [localTags, setLocalTags] = useState<TaskTag[]>(availableTags)
  const [localSelectedTags, setLocalSelectedTags] = useState<string[]>(selectedTags)
  const [hasChanges, setHasChanges] = useState(false)

  const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * TAG_COLORS.length)
    return TAG_COLORS[randomIndex].value
  }

  useEffect(() => {
    setLocalTags(availableTags)
  }, [availableTags])

  useEffect(() => {
    setLocalSelectedTags(selectedTags)
  }, [selectedTags])

  useEffect(() => {
    if (editingTag && inputRef.current) {
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus()
          inputRef.current.select()
        }
      }, 400)
    }
  }, [editingTag])

  const saveChanges = async () => {
    if (!hasChanges) return

    try {
      await updateList.mutateAsync({
        listId,
        data: { tags: localTags }
      })
      
      onChange(localSelectedTags)
      setHasChanges(false)
    } catch (error: any) {
      toast.error('Failed to update tags', {
        description: error.message || 'An unexpected error occurred'
      })
      setLocalTags(availableTags)
      setLocalSelectedTags(selectedTags)
      setHasChanges(false)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      setSearchValue('')
      if (editingTag) {
        setEditingTag(null)
      }
      saveChanges()
    }
  }

  const handleSelect = (tagValue: string) => {
    const isSelected = localSelectedTags.includes(tagValue)
    
    if (isSelected) {
      setLocalSelectedTags(localSelectedTags.filter(t => t !== tagValue))
    } else {
      setLocalSelectedTags([...localSelectedTags, tagValue])
    }
  }

  const handleCreateTag = (tagName?: string) => {
    const trimmedValue = (tagName || searchValue).trim()
    if (!trimmedValue) return

    const newTag: TaskTag = {
      value: trimmedValue.toLowerCase().replace(/\s+/g, '-'),
      label: trimmedValue,
      color: getRandomColor(),
      index: localTags.length
    }

    setLocalTags([...localTags, newTag])
    setLocalSelectedTags([...localSelectedTags, newTag.value])
    setHasChanges(true)
    setSearchValue('')
  }

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchValue.trim()) {
      const trimmedValue = searchValue.trim()
      const existingTag = localTags.find(
        tag => tag.label.toLowerCase() === trimmedValue.toLowerCase()
      )
      
      if (!existingTag) {
        handleCreateTag(trimmedValue)
      } else {
        if (!localSelectedTags.includes(existingTag.value)) {
          handleSelect(existingTag.value)
        }
        setSearchValue('')
      }
    }
  }

  const handleEditTag = (tag: TaskTag, e: React.MouseEvent) => {
    e.stopPropagation()
    setEditingTag(tag.value)
    setEditingName(tag.label)
  }

  const handleColorUpdate = (tagValue: string, newColor: string) => {
    const updatedTags = localTags.map(tag =>
      tag.value === tagValue
        ? { ...tag, color: newColor }
        : tag
    )
    setLocalTags(updatedTags)
    setHasChanges(true)
  }

  const handleSaveEdit = () => {
    if (!editingTag || !editingName.trim()) {
      setEditingTag(null)
      return
    }

    const updatedTags = localTags.map(tag =>
      tag.value === editingTag
        ? { ...tag, label: editingName }
        : tag
    )

    setLocalTags(updatedTags)
    setHasChanges(true)
    setEditingTag(null)
  }

  const handleDeleteTag = (tagValue: string, e: React.MouseEvent) => {
    e.stopPropagation()

    const updatedTags = localTags.filter(tag => tag.value !== tagValue)
    setLocalTags(updatedTags)

    if (localSelectedTags.includes(tagValue)) {
      setLocalSelectedTags(localSelectedTags.filter(t => t !== tagValue))
    }

    setHasChanges(true)
  }

  const filteredTags = localTags.filter(tag =>
    tag.label.toLowerCase().includes(searchValue.toLowerCase())
  )

  const showCreateOption = searchValue.trim() && !filteredTags.some(
    tag => tag.label.toLowerCase() === searchValue.toLowerCase()
  )

  const MAX_VISIBLE_TAGS = 2
  const visibleTags = localSelectedTags.slice(0, MAX_VISIBLE_TAGS)
  const remainingCount = localSelectedTags.length - MAX_VISIBLE_TAGS

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          disabled={disabled}
          className={cn('h-8 px-2 justify-start', className)}
        >
          {localSelectedTags.length > 0 ? (
            <div className="flex gap-1 items-center max-w-full overflow-hidden">
              {visibleTags.map(tagValue => {
                const tag = localTags.find(t => t.value === tagValue)
                if (!tag) return null
                const textColor = getTextColor(tag.color)
                return (
                  <Badge
                    key={tag.value}
                    className="text-xs max-w-[80px] truncate border-0"
                    style={{
                      backgroundColor: tag.color,
                      color: textColor
                    }}
                  >
                    {tag.label}
                  </Badge>
                )
              })}
              {remainingCount > 0 && (
                <Badge
                  variant="secondary"
                  className="text-xs border-0"
                >
                  +{remainingCount}
                </Badge>
              )}
            </div>
          ) : (
            <span className="text-xs text-muted-foreground">Add tags...</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[320px] p-0" align="start">
        <Command>
          <CommandInput
            ref={searchInputRef}
            placeholder="Search or create tags..."
            value={searchValue}
            onValueChange={setSearchValue}
            onKeyDown={handleSearchKeyDown}
          />
          <CommandList>
            <CommandEmpty>
              {showCreateOption ? (
                <div className="p-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2 text-primary hover:text-primary"
                    onClick={() => handleCreateTag()}
                  >
                    <Plus className="h-4 w-4" />
                    Create tag "{searchValue.trim()}"
                  </Button>
                </div>
              ) : (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  No tags found.
                </div>
              )}
            </CommandEmpty>
            <CommandGroup>
              {filteredTags.map((tag) => (
                <CommandItem
                  key={tag.value}
                  value={tag.value}
                  onSelect={() => handleSelect(tag.value)}
                  className="flex items-center justify-between gap-2 group px-2"
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Check
                      className={cn(
                        'h-4 w-4 shrink-0',
                        localSelectedTags.includes(tag.value) ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    {editingTag === tag.value ? (
                      <div className="flex items-center gap-2 flex-1 min-w-0" onClick={(e) => e.stopPropagation()}>
                        <div 
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: tag.color }}
                        />
                        <Input
                          ref={inputRef}
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          onBlur={handleSaveEdit}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleSaveEdit()
                            } else if (e.key === 'Escape') {
                              setEditingTag(null)
                            }
                          }}
                          className="h-7 text-xs flex-1"
                        />
                      </div>
                    ) : (
                      <>
                        <div 
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: tag.color }}
                        />
                        <span className="text-xs flex-1 truncate">
                          {tag.label}
                        </span>
                      </>
                    )}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                      >
                        <MoreVertical className="h-3.5 w-3.5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[180px]">
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                          <div className="flex items-center">
                            <div 
                              className="w-3 h-3 rounded-full mr-2"
                              style={{ backgroundColor: tag.color }}
                            />
                            Color
                          </div>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent>
                          {TAG_COLORS.map((color) => (
                            <DropdownMenuItem
                              key={color.value}
                              onClick={(e) => {
                                e.stopPropagation()
                                handleColorUpdate(tag.value, color.value)
                              }}
                            >
                              <div className="flex items-center gap-2">
                                <div 
                                  className="w-4 h-4 rounded-full border border-border"
                                  style={{ backgroundColor: color.value }}
                                />
                                <span className="text-xs">{color.label}</span>
                                {tag.color === color.value && (
                                  <Check className="h-3 w-3 ml-auto" />
                                )}
                              </div>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuSubContent>
                      </DropdownMenuSub>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={(e) => handleEditTag(tag, e)}>
                        <Edit2 className="h-3.5 w-3.5 mr-2" />
                        Rename
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={(e) => handleDeleteTag(tag.value, e)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

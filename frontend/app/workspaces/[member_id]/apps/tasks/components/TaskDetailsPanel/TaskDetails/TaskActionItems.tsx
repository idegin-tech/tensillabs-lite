'use client'
import React, { useState, useEffect } from 'react'
import { TbCheck, TbDots, TbEdit, TbTrash, TbPlus } from 'react-icons/tb'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useCreateChecklist, useUpdateChecklist, useDeleteChecklist } from '../../../hooks/use-checklists'
import { toast } from 'sonner'

interface ChecklistItem {
  _id: string
  name: string
  isDone: boolean
  task: string
  workspace: string
  space?: string
  list?: string
  createdBy: string
  createdAt: string
  updatedAt: string
}

interface TaskActionItemsProps {
  taskId?: string
  checklist: ChecklistItem[]
}

export default function TaskActionItems({ taskId, checklist }: TaskActionItemsProps) {
  const [localChecklist, setLocalChecklist] = useState<ChecklistItem[]>(checklist)
  const [editingItem, setEditingItem] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')
  const [newItemText, setNewItemText] = useState('')
  const [isAddingNew, setIsAddingNew] = useState(false)

  const createMutation = useCreateChecklist()
  const updateMutation = useUpdateChecklist()
  const deleteMutation = useDeleteChecklist()

  useEffect(() => {
    setLocalChecklist(checklist)
  }, [checklist])

  const handleToggleComplete = async (item: ChecklistItem) => {
    const optimisticUpdate = localChecklist.map(checklistItem =>
      checklistItem._id === item._id ? { ...checklistItem, isDone: !checklistItem.isDone } : checklistItem
    )
    setLocalChecklist(optimisticUpdate)

    try {
      await updateMutation.mutateAsync({
        checklistId: item._id,
        data: { isDone: !item.isDone }
      })
    } catch (error) {
      setLocalChecklist(localChecklist)
      toast.error('Failed to update checklist item')
    }
  }

  const handleStartEdit = (item: ChecklistItem) => {
    setEditingItem(item._id)
    setEditValue(item.name)
  }

  const handleSaveEdit = async (item: ChecklistItem) => {
    if (editValue.trim() && editValue.trim() !== item.name) {
      const optimisticUpdate = localChecklist.map(checklistItem =>
        checklistItem._id === item._id ? { ...checklistItem, name: editValue.trim() } : checklistItem
      )
      setLocalChecklist(optimisticUpdate)

      try {
        await updateMutation.mutateAsync({
          checklistId: item._id,
          data: { name: editValue.trim() }
        })
      } catch (error) {
        setLocalChecklist(localChecklist)
        toast.error('Failed to update checklist item')
      }
    }
    setEditingItem(null)
    setEditValue('')
  }

  const handleCancelEdit = () => {
    setEditingItem(null)
    setEditValue('')
  }

  const handleDeleteItem = async (item: ChecklistItem) => {
    const optimisticUpdate = localChecklist.filter(checklistItem => checklistItem._id !== item._id)
    setLocalChecklist(optimisticUpdate)

    try {
      await deleteMutation.mutateAsync(item._id)
    } catch (error) {
      setLocalChecklist(localChecklist)
      toast.error('Failed to delete checklist item')
    }
  }

  const handleAddNew = async () => {
    if (newItemText.trim() && taskId) {
      try {
        const response = await createMutation.mutateAsync({
          name: newItemText.trim(),
          task: taskId
        })
        
        const newItem = response.payload
        setLocalChecklist([...localChecklist, newItem])
        setNewItemText('')
        setIsAddingNew(false)
      } catch (error) {
        toast.error('Failed to create checklist item')
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent, item?: ChecklistItem) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (item) {
        handleSaveEdit(item)
      } else {
        handleAddNew()
      }
    } else if (e.key === 'Escape') {
      if (item) {
        handleCancelEdit()
      } else {
        setIsAddingNew(false)
        setNewItemText('')
      }
    }
  }

  const handleDoubleClick = (item: ChecklistItem) => {
    if (!item.isDone) {
      handleStartEdit(item)
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Checklist ({localChecklist.filter(item => item.isDone).length}/{localChecklist.length})</h3>
        {taskId && !isAddingNew && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsAddingNew(true)}
            className="h-8"
          >
            <TbPlus className="h-4 w-4 mr-1" />
            Add Item
          </Button>
        )}
      </div>

      {isAddingNew && (
        <div className="flex items-center space-x-3 p-3 rounded-lg border bg-background">
          <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30" />
          <Input
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e)}
            placeholder="Enter checklist item..."
            className="text-sm border-none p-0 h-auto bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
            autoFocus
            onBlur={() => {
              if (!newItemText.trim()) {
                setIsAddingNew(false)
              }
            }}
          />
          <div className="flex gap-1">
            <Button size="sm" variant="ghost" onClick={handleAddNew} disabled={!newItemText.trim()}>
              Add
            </Button>
            <Button size="sm" variant="ghost" onClick={() => {
              setIsAddingNew(false)
              setNewItemText('')
            }}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {localChecklist.map((item) => (
        <div
          key={item._id}
          className="group flex items-center space-x-3 p-3 rounded-lg border bg-background hover:bg-accent/50 transition-colors"
        >
          <button
            onClick={() => handleToggleComplete(item)}
            className={cn(
              "flex items-center justify-center w-5 h-5 rounded-full border-2 transition-all duration-200 hover:scale-110",
              item.isDone
                ? "bg-green-500 border-green-500 text-white"
                : "border-muted-foreground/30 hover:border-green-500"
            )}
          >
            {item.isDone && <TbCheck className="h-3 w-3" />}
          </button>

          <div className="flex-1 min-w-0">
            {editingItem === item._id ? (
              <Input
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, item)}
                onBlur={() => handleSaveEdit(item)}
                className="text-sm border-none p-0 h-auto bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                autoFocus
              />
            ) : (
              <span
                className={cn(
                  "text-sm cursor-pointer transition-all duration-200",
                  item.isDone
                    ? "line-through text-muted-foreground"
                    : "text-foreground hover:text-accent-foreground"
                )}
                onDoubleClick={() => handleDoubleClick(item)}
              >
                {item.name}
              </span>
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
              >
                <TbDots className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem
                onClick={() => handleToggleComplete(item)}
                className="flex items-center gap-2"
              >
                <TbCheck className="h-4 w-4" />
                {item.isDone ? 'Mark as Undone' : 'Mark as Done'}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleStartEdit(item)}
                className="flex items-center gap-2"
                disabled={item.isDone}
              >
                <TbEdit className="h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDeleteItem(item)}
                className="flex items-center gap-2 text-destructive"
              >
                <TbTrash className="h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ))}

      {localChecklist.length === 0 && !isAddingNew && (
        <div className="text-center py-8 text-muted-foreground">
          <TbCheck className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No checklist items yet</p>
          {taskId && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsAddingNew(true)}
              className="mt-2"
            >
              <TbPlus className="h-4 w-4 mr-1" />
              Add first item
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

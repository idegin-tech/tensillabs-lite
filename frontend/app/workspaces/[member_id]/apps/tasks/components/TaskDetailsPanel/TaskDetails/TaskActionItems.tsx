'use client'
import React, { useState, useEffect } from 'react'
import { TbCheck, TbDots, TbEdit, TbTrash, TbPlus, TbX } from 'react-icons/tb'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-lg">
          Checklist ({localChecklist.filter(item => item.isDone).length}/{localChecklist.length})
        </h3>
        {taskId && !isAddingNew && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAddingNew(true)}
            className="h-8 gap-2"
          >
            <TbPlus className="h-4 w-4" />
            Add Item
          </Button>
        )}
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[50px] text-center">Done</TableHead>
              <TableHead className='max-w-[200px]'>Task</TableHead>
              <TableHead className="w-[80px] text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isAddingNew && (
              <TableRow className="bg-accent/30">
                <TableCell className="text-center">
                  <Checkbox disabled className="opacity-30" />
                </TableCell>
                <TableCell>
                  <Input
                    value={newItemText}
                    onChange={(e) => setNewItemText(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e)}
                    placeholder="Enter checklist item..."
                    className="border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 h-8"
                    autoFocus
                  />
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex gap-1 justify-center">
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={handleAddNew} 
                      disabled={!newItemText.trim()}
                      className="h-6 w-6 p-0"
                    >
                      <TbCheck className="h-3 w-3" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => {
                        setIsAddingNew(false)
                        setNewItemText('')
                      }}
                      className="h-6 w-6 p-0"
                    >
                      <TbX className="h-3 w-3" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}

            {localChecklist.map((item) => (
              <TableRow 
                key={item._id} 
                className={cn(
                  "group transition-colors hover:bg-accent/50",
                  item.isDone && "bg-muted/30"
                )}
              >
                <TableCell className="text-center">
                  <Checkbox
                    checked={item.isDone}
                    onCheckedChange={() => handleToggleComplete(item)}
                    className={cn(
                      "transition-all duration-200",
                      item.isDone && "data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                    )}
                  />
                </TableCell>
                <TableCell className='max-w-[100px]'>
                  {editingItem === item._id ? (
                    <Input
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, item)}
                      onBlur={() => handleSaveEdit(item)}
                      className="border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 h-8"
                      autoFocus
                    />
                  ) : (
                    <span
                      className={cn(
                        "cursor-pointer transition-all duration-200 block py-1 text-wrap",
                        item.isDone
                          ? "line-through text-muted-foreground"
                          : "text-foreground hover:text-accent-foreground"
                      )}
                      onDoubleClick={() => handleDoubleClick(item)}
                    >
                      {item.name}
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-60 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
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
                </TableCell>
              </TableRow>
            ))}

            {localChecklist.length === 0 && !isAddingNew && (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-12">
                  <div className="text-muted-foreground">
                    <TbCheck className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p className="text-sm mb-2">No checklist items yet</p>
                    {taskId && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsAddingNew(true)}
                        className="gap-2"
                      >
                        <TbPlus className="h-4 w-4" />
                        Add first item
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

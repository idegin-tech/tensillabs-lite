'use client'
import React, { useState } from 'react'
import { TbCheck, TbDots, TbEdit, TbTrash } from 'react-icons/tb'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface ActionItem {
    id: string
    text: string
    completed: boolean
}

interface TaskActionItemsProps {
    items?: ActionItem[]
    onItemsChange?: (items: ActionItem[]) => void
}

export default function TaskActionItems({ items = [], onItemsChange }: TaskActionItemsProps) {
    const [actionItems, setActionItems] = useState<ActionItem[]>(items.length > 0 ? items : [
        { id: '1', text: 'Set up OAuth providers (Google, GitHub)', completed: false },
        { id: '2', text: 'Create user authentication middleware', completed: false },
        { id: '3', text: 'Implement session management', completed: false }
    ])
    const [editingItem, setEditingItem] = useState<string | null>(null)
    const [editValue, setEditValue] = useState('')

    const handleToggleComplete = (itemId: string) => {
        const updatedItems = actionItems.map(item =>
            item.id === itemId ? { ...item, completed: !item.completed } : item
        )
        setActionItems(updatedItems)
        onItemsChange?.(updatedItems)
    }

    const handleStartEdit = (item: ActionItem) => {
        setEditingItem(item.id)
        setEditValue(item.text)
    }

    const handleSaveEdit = (itemId: string) => {
        if (editValue.trim()) {
            const updatedItems = actionItems.map(item =>
                item.id === itemId ? { ...item, text: editValue.trim() } : item
            )
            setActionItems(updatedItems)
            onItemsChange?.(updatedItems)
        }
        setEditingItem(null)
        setEditValue('')
    }

    const handleCancelEdit = () => {
        setEditingItem(null)
        setEditValue('')
    }

    const handleDeleteItem = (itemId: string) => {
        const updatedItems = actionItems.filter(item => item.id !== itemId)
        setActionItems(updatedItems)
        onItemsChange?.(updatedItems)
    }

    const handleKeyDown = (e: React.KeyboardEvent, itemId: string) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            handleSaveEdit(itemId)
        } else if (e.key === 'Escape') {
            handleCancelEdit()
        }
    }

    const handleDoubleClick = (item: ActionItem) => {
        if (!item.completed) {
            handleStartEdit(item)
        }
    }

    return (
        <div className="space-y-3">
            {actionItems.map((item) => (
                <div
                    key={item.id}
                    className="group flex items-center space-x-3 p-3 rounded-lg border bg-background hover:bg-accent/50 transition-colors"
                >
                    <button
                        onClick={() => handleToggleComplete(item.id)}
                        className={cn(
                            "flex items-center justify-center w-5 h-5 rounded-full border-2 transition-all duration-200 hover:scale-110",
                            item.completed
                                ? "bg-green-500 border-green-500 text-white"
                                : "border-muted-foreground/30 hover:border-green-500"
                        )}
                    >
                        {item.completed && <TbCheck className="h-3 w-3" />}
                    </button>

                    <div className="flex-1 min-w-0">
                        {editingItem === item.id ? (
                            <Input
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                onKeyDown={(e) => handleKeyDown(e, item.id)}
                                onBlur={() => handleSaveEdit(item.id)}
                                className="text-sm border-none p-0 h-auto bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                                autoFocus
                            />
                        ) : (
                            <span
                                className={cn(
                                    "text-sm cursor-pointer transition-all duration-200",
                                    item.completed
                                        ? "line-through text-muted-foreground"
                                        : "text-foreground hover:text-accent-foreground"
                                )}
                                onDoubleClick={() => handleDoubleClick(item)}
                            >
                                {item.text}
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
                                onClick={() => handleToggleComplete(item.id)}
                                className="flex items-center gap-2"
                            >
                                <TbCheck className="h-4 w-4" />
                                {item.completed ? 'Mark as Undone' : 'Mark as Done'}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => handleStartEdit(item)}
                                className="flex items-center gap-2"
                                disabled={item.completed}
                            >
                                <TbEdit className="h-4 w-4" />
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => handleDeleteItem(item.id)}
                                className="flex items-center gap-2 text-destructive"
                            >
                                <TbTrash className="h-4 w-4" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            ))}

            {actionItems.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                    <TbCheck className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No action items yet</p>
                </div>
            )}
        </div>
    )
}

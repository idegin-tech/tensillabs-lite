'use client'

import { Button } from '@/components/ui/button'
import RichTextEditor from '@/components/RichTextEditor'
import MarkdownRenderer from '@/components/MarkdownRenderer'
import React, { useState, useCallback, useEffect } from 'react'
import { TbPlus, TbEdit, TbCheck, TbX } from 'react-icons/tb'
import { useDebounce } from '@/hooks/use-common'

interface TaskDescriptionProps {
    description?: string
    taskId: string
    onUpdate?: (description: string) => void
}

export default function TaskDescription({ description, taskId, onUpdate }: TaskDescriptionProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [editValue, setEditValue] = useState(description || '')
    const [isUpdating, setIsUpdating] = useState(false)

    // Sync editValue when description changes (e.g., from external updates)
    useEffect(() => {
        if (!isEditing) {
            setEditValue(description || '')
        }
    }, [description, isEditing])

    const debouncedUpdate = useDebounce(async (value: string) => {
        if (onUpdate && value !== description) {
            setIsUpdating(true)
            try {
                await onUpdate(value)
            } catch (error) {
                console.error('Failed to update task description:', error)
                setEditValue(description || '')
            } finally {
                setIsUpdating(false)
            }
        }
    }, 500)

    const handleEditToggle = useCallback(() => {
        if (isEditing) {
            // Restore original value when canceling
            setEditValue(description || '')
        } else {
            // Ensure we start with the current description when editing
            setEditValue(description || '')
        }
        setIsEditing(!isEditing)
    }, [isEditing, description])

    const handleSave = useCallback(async () => {
        if (editValue.trim() !== (description || '')) {
            setIsUpdating(true)
            try {
                if (onUpdate) {
                    await onUpdate(editValue.trim())
                }
            } catch (error) {
                console.error('Failed to update task description:', error)
                setEditValue(description || '')
                return
            } finally {
                setIsUpdating(false)
            }
        }
        setIsEditing(false)
    }, [editValue, description, onUpdate])

    const handleContentChange = useCallback((content: string) => {
        // Extract plain text for character count validation
        const tempDiv = document.createElement('div')
        tempDiv.innerHTML = content
        const textLength = tempDiv.textContent?.length || 0
        
        // Only update if within character limit
        if (textLength <= 98000) {
            setEditValue(content)
            debouncedUpdate(content)
        }
    }, [debouncedUpdate])

    const hasDescription = description && description.trim().length > 0

    return (
        <div>
            <div className='flex items-center justify-between'>
                <label className="text-sm font-medium">Description</label>
                {!isEditing && !hasDescription && (
                    <Button 
                        variant={'ghost'} 
                        size="sm"
                        onClick={() => setIsEditing(true)}
                        className="h-8"
                    >
                        <TbPlus className="w-4 h-4 mr-1" /> Add description
                    </Button>
                )}
                {!isEditing && hasDescription && (
                    <Button 
                        variant={'ghost'} 
                        size="sm"
                        onClick={handleEditToggle}
                        className="h-8"
                    >
                        <TbEdit className="w-4 h-4 mr-1" /> Edit
                    </Button>
                )}
                {isEditing && (
                    <div className="flex items-center gap-1">
                        <Button 
                            variant={'ghost'} 
                            size="sm"
                            onClick={handleSave}
                            disabled={isUpdating}
                            className="h-8"
                        >
                            <TbCheck className="w-4 h-4 mr-1" /> Save
                        </Button>
                        <Button 
                            variant={'ghost'} 
                            size="sm"
                            onClick={handleEditToggle}
                            disabled={isUpdating}
                            className="h-8"
                        >
                            <TbX className="w-4 h-4 mr-1" /> Cancel
                        </Button>
                    </div>
                )}
            </div>
            
            {isEditing ? (
                <div className="mt-2">
                    <RichTextEditor
                        value={editValue}
                        onChange={handleContentChange}
                        placeholder="Add a description for this task..."
                        className="min-h-[120px]"
                        debounceMs={500}
                        allowHighlight={true}
                        maxLength={98000}
                    />
                        <p className="text-xs text-muted-foreground mt-1">
                            {isUpdating ? "Saving...": "Saved"}
                        </p>
                </div>
            ) : hasDescription ? (
                <div className="mt-2 p-3 bg-muted/50 rounded-lg">
                    <MarkdownRenderer 
                        content={description}
                        className="text-sm"
                        allowHtml={true}
                        collapsible={true}
                        maxLength={500}
                    />
                </div>
            ) : null}
        </div>
    )
}

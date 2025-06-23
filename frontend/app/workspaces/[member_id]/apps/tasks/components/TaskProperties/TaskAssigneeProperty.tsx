'use client'

import React, { useState, useEffect } from 'react'
import { TaskAssignee } from '@/types/tasks.types'
import { TaskPropertyProps } from '.'
import TaskParticipantsSelector from '../TaskParticipantsSelector'

export default function TaskAssigneeProperty({ onChange, value }: TaskPropertyProps) {
    const [internalValue, setInternalValue] = useState<TaskAssignee[]>(value || [])

    useEffect(() => {
        setInternalValue(value || [])
    }, [value])

    const handleAssigneeChange = (assignees: TaskAssignee[]) => {
        setInternalValue(assignees)
        onChange?.(assignees)
    }

    return (
        <TaskParticipantsSelector
            value={internalValue}
            onChange={handleAssigneeChange}
            placeholder="Unassigned"
            maxVisible={5}
            avatarSize="lg"
        />
    )
}

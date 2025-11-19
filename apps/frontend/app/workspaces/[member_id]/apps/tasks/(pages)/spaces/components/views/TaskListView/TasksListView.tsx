'use client'
import React, { useState, useEffect, useMemo } from 'react'
import EachTaskGroup from './EachTaskGroup'
import TasksListOptions from './TasksListOptions'
import { useTaskList } from '../../../../../contexts/task-list.context'
import { useTasksApp } from '../../../../../contexts/tasks-app.context'
import { taskGroupConfig, getDefaultExpandedGroup } from '../../../../../task-app.config'
import TaskDetailsPanel from '../../../../../components/TaskDetailsPanel/TaskDetailsPanel'
import { useQueryClient } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { useGetTaskDetails } from '../../../../../hooks/use-tasks'
import { useSpaceParticipants } from '@/hooks/use-space-participants'
import { useWorkspaceMember } from '@/contexts/workspace-member.context'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { TaskGrouping } from '@/types/tasks.types'
import { Loader2 } from 'lucide-react'

export default function TasksListView() {
    const { state, updateState } = useTaskList();
    const { state: tasksAppState, updateState: updateTasksAppState } = useTasksApp();
    const { state: memberState } = useWorkspaceMember();
    const params = useParams()
    const listId = params.list_id as string
    const spaceId = params.space_id as string

    const { participants, isLoading: participantsLoading } = useSpaceParticipants(
        { spaceId, limit: 100 },
        { enabled: state.groupBy === 'assignee' && !!spaceId }
    )

    const assigneeGroupConfig = useMemo(() => {
        if (state.groupBy !== 'assignee' || !participants.length) return []
        
        let filteredParticipants = participants
        
        if (state.meMode && memberState.member) {
            filteredParticipants = participants.filter(
                p => p.member._id === memberState.member?._id
            )
        }
        
        const groups: TaskGrouping[] = filteredParticipants.map((participant) => {
            const member = participant.member
            const initials = member.firstName && member.lastName
                ? `${member.firstName[0]}${member.lastName[0]}`
                : member.primaryEmail?.[0]?.toUpperCase() || 'U'
            
            const fullName = member.firstName && member.lastName
                ? `${member.firstName} ${member.lastName}`
                : member.primaryEmail
            
            const displayName = fullName.length > 20 
                ? `${fullName.substring(0, 20)}...` 
                : fullName
            
            return {
                label: displayName,
                groupKey: 'assignee',
                icon: () => (
                    <Avatar className="h-4 w-4">
                        <AvatarImage src={member.avatarURL?.sm} alt={fullName} />
                        <AvatarFallback className="text-[10px]">{initials}</AvatarFallback>
                    </Avatar>
                ),
                color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
                query: { assignee_id: member._id },
                defaultOpen: false
            }
        })
        
        const unassignedGroup: TaskGrouping = {
            label: 'Unassigned',
            groupKey: 'assignee',
            icon: () => (
                <Avatar className="h-4 w-4">
                    <AvatarFallback className="text-[10px]">?</AvatarFallback>
                </Avatar>
            ),
            color: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
            query: { assignee_id: 'unassigned' },
            defaultOpen: false
        }
        
        if (!state.meMode) {
            groups.push(unassignedGroup)
        }
        
        return groups
    }, [participants, state.groupBy, state.meMode, memberState.member])

    const currentGroupConfig = state.groupBy === 'none' 
        ? [] 
        : state.groupBy === 'assignee'
            ? assigneeGroupConfig
            : (taskGroupConfig[state.groupBy] || [])

    useEffect(() => {
        if (state.groupBy !== 'none' && !state.expandedGroup) {
            const defaultGroup = getDefaultExpandedGroup(state.groupBy)
            if (defaultGroup) {
                updateState({ expandedGroup: defaultGroup })
            }
        }
    }, [state.groupBy, state.expandedGroup, updateState])

    const handleCloseTaskDetails = () => {
        updateTasksAppState({ activeTaskID: null })
    }

    return (
        <>
            <div>
                <TasksListOptions />
                <div className='grid grid-cols-1 pb-60 h-[calc(100dvh-9.5rem)] overflow-y-auto relative'>
                    <div className="space-y-1 px-3 pt-6 pb-5">
                        <h1 className="text-2xl font-bold text-foreground">
                            {state.activeList?.name || 'Task List'}
                        </h1>
                        <p className="text-muted-foreground">
                            {state.activeList?.description || 'Manage and track your tasks organized by status'}
                        </p>
                    </div>
                    <br />
                    <div className='flex flex-col'>
                        {state.groupBy === 'assignee' && participantsLoading ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="flex flex-col items-center gap-3">
                                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                    <p className="text-sm text-muted-foreground">Loading participants...</p>
                                </div>
                            </div>
                        ) : state.groupBy === 'none' ? (
                            <EachTaskGroup
                                key="no-group"
                                title="All Tasks"
                                icon={undefined}
                                color="bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                                groupConfig={undefined}
                            />
                        ) : (
                            currentGroupConfig.map((group) => (
                                <div key={`${group.groupKey}-${group.label}`} className='pb-5'>
                                    <EachTaskGroup
                                        title={group.label}
                                        icon={group.icon}
                                        color={group.color}
                                        groupConfig={group}
                                    />
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
            {tasksAppState.activeTaskID && (
                <TaskDetailsPanel
                    taskID={tasksAppState.activeTaskID}
                    onClose={handleCloseTaskDetails}
                />
            )}
        </>
    )
}

'use client'
import React from 'react'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
    TbList,
    TbPlus,
    TbDots,
    TbAlertCircle,
    TbRefresh,
    TbCalendar
} from 'react-icons/tb'
import { useRouter } from 'next13-progressbar'
import { useTasksSpace } from '../../../../contexts/tasks-space.context'
import { useTasksApp } from '../../../../contexts/tasks-app.context'
import SectionPlaceholder from '@/components/placeholders/SectionPlaceholder'
import useCommon from '@/hooks/use-common'
import type { TaskList } from '@/types/tasks.types'

function TaskListCard({ list }: { list: TaskList }) {
    const router = useRouter()
    const { getPathToApp } = useCommon()
    const { state } = useTasksSpace()
    
    const handleClick = () => {
        if (state.space) {
            router.push(`${getPathToApp('tasks')}/spaces/${state.space.space._id}/lists/${list._id}`)
        }
    }

    return (
        <Card 
            className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-border/50 hover:border-primary/20 py-0"
            onClick={handleClick}
        >
            <CardContent className='space-y-3 p-6'>
                <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="p-2.5 rounded-lg bg-muted text-muted-foreground group-hover:scale-110 transition-transform duration-300">
                            <TbList className="h-6 w-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <CardTitle className="text-base font-semibold truncate transition-colors">
                                {list.name}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                                {list.isPrivate ? 'Private list' : 'Public list'}
                            </p>
                        </div>
                    </div>
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                            e.stopPropagation()
                        }}
                    >
                        <TbDots className="h-4 w-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

function TaskListCardSkeleton() {
    return (
        <Card className="border-border/50">
            <CardContent className="p-6 space-y-3">
                <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                        <Skeleton className="h-11 w-11 rounded-lg" />
                        <div className="space-y-2">
                            <Skeleton className="h-5 w-32" />
                            <Skeleton className="h-4 w-20" />
                        </div>
                    </div>
                    <Skeleton className="h-8 w-8 rounded" />
                </div>
            </CardContent>
        </Card>
    )
}

function OverviewSkeleton() {
    return (
        <div className='flex justify-center'>
            <div className='container max-auto'>
                <div className="p-6 space-y-8">
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-3">
                                <Skeleton className="h-8 w-40" />
                                <Skeleton className="h-4 w-80" />
                            </div>
                            <Skeleton className="h-10 w-28" />
                        </div>                        <div className="space-y-4">
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2">
                                    <Skeleton className="h-4 w-4" />
                                    <Skeleton className="h-4 w-16" />
                                </div>
                                <div className="flex items-center gap-2">
                                    <Skeleton className="h-4 w-4" />
                                    <Skeleton className="h-4 w-20" />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <TaskListCardSkeleton key={i} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function SpaceOverviewTab() {
    const { state, refetchSpace } = useTasksSpace()
    const { updateState } = useTasksApp()
    const { space, isLoading, error } = state

    if (isLoading) {
        return <OverviewSkeleton />
    }

    if (error) {
        return (
            <div className='flex justify-center'>
                <div className='container max-auto'>
                    <div className="p-6">
                        <SectionPlaceholder
                            variant="error"
                            icon={TbAlertCircle}
                            heading="Failed to load space details"
                            subHeading="We couldn't load the space information. Please check your connection and try again."
                            ctaButton={{
                                label: "Try Again",
                                onClick: () => refetchSpace(),
                                variant: "default",
                                icon: TbRefresh
                            }}
                            fullWidth
                        />
                    </div>
                </div>
            </div>
        )
    }

    if (!space) {
        return (
            <div className='flex justify-center'>
                <div className='container max-auto'>
                    <div className="p-6">
                        <SectionPlaceholder
                            variant="empty"
                            icon={TbAlertCircle}
                            heading="Space not found"
                            subHeading="The space you're looking for doesn't exist or you don't have access to it."
                            fullWidth
                        />
                    </div>
                </div>
            </div>)
    }

    return (
        <div className='flex justify-center'>
            <div className='container max-auto'>
                <div className="p-6 space-y-8">
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold">Task Lists</h2>
                                <p className="text-muted-foreground">Manage your project tasks organized by lists</p>
                            </div>
                            <Button onClick={() => updateState({ showCreateList: true })}>
                                <TbPlus className="h-4 w-4 mr-2" />
                                New List
                            </Button>
                        </div>
                       

                        {space.lists.length === 0 ? (
                            <div className="py-12">
                                <SectionPlaceholder
                                    variant="empty"
                                    icon={TbList}
                                    heading="No lists yet"
                                    subHeading="Create your first list to start organizing tasks in this space."
                                    ctaButton={{
                                        label: "Create List",
                                        onClick: () => updateState({ showCreateList: true }),
                                        variant: "default",
                                        icon: TbPlus
                                    }}
                                />
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {space.lists.map((list) => (
                                    <TaskListCard key={list._id} list={list} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

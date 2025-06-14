'use client'
import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TbAlertCircle, TbRefresh, TbUsers, TbUserPlus } from 'react-icons/tb'
import { useTasksSpace } from '../../../../contexts/tasks-space.context'
import SectionPlaceholder from '@/components/placeholders/SectionPlaceholder'
import type { SpaceDetailsParticipant } from '@/types/spaces.types'

function ParticipantCard({ participant }: { participant: SpaceDetailsParticipant }) {
    return (
        <div className="flex items-center gap-3 p-4 rounded-lg border hover:border-primary/20 transition-colors bg-card">
            <Avatar className="h-12 w-12">
                <AvatarFallback className="text-sm bg-muted">
                    {participant.firstName?.[0]}{participant.lastName?.[0]}
                </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">
                    {participant.firstName} {participant.lastName}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                    {participant.primaryEmail}
                </p>
                <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="text-xs">
                        {participant.role}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                        Joined {new Date(participant.joinedAt).toLocaleDateString()}
                    </span>
                </div>
            </div>
        </div>
    )
}

function ParticipantCardSkeleton() {
    return (
        <div className="flex items-center gap-3 p-4 rounded-lg border bg-card">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
                <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-3 w-20" />
                </div>
            </div>
        </div>
    )
}

function ParticipantsSkeleton() {
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
                            <Skeleton className="h-10 w-32" />
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-4 w-4" />
                                <Skeleton className="h-4 w-20" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <ParticipantCardSkeleton key={i} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function SpaceParticipants() {
    const { state, refetchSpace } = useTasksSpace()
    const { space, isLoading, error } = state

    if (isLoading) {
        return <ParticipantsSkeleton />
    }

    if (error) {
        return (
            <div className='flex justify-center'>
                <div className='container max-auto'>
                    <div className="p-6">
                        <SectionPlaceholder
                            variant="error"
                            icon={TbAlertCircle}
                            heading="Failed to load participants"
                            subHeading="We couldn't load the space participants. Please check your connection and try again."
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
            </div>
        )
    }

    return (
        <div className='flex justify-center'>
            <div className='container max-auto'>
                <div className="p-6 space-y-8">
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold">Participants</h2>
                                <p className="text-muted-foreground">Manage people who have access to this space</p>
                            </div>
                            <Button>
                                <TbUserPlus className="h-4 w-4 mr-2" />
                                Invite People
                            </Button>
                        </div>

                        <div className="flex items-center gap-2 text-muted-foreground">
                            <TbUsers className="h-4 w-4" />
                            <span className="text-sm">{space.recentParticipants.length} participants</span>
                        </div>

                        {space.recentParticipants.length === 0 ? (
                            <div className="py-12">
                                <SectionPlaceholder
                                    variant="empty"
                                    icon={TbUsers}
                                    heading="No participants yet"
                                    subHeading="Invite people to collaborate on this space."
                                    ctaButton={{
                                        label: "Invite People",
                                        onClick: () => {},
                                        variant: "default",
                                        icon: TbUserPlus
                                    }}
                                />
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {space.recentParticipants.map((participant) => (
                                    <ParticipantCard key={participant._id} participant={participant} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

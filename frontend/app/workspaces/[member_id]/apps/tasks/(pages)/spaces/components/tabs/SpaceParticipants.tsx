'use client'
import React, { useState, useEffect } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { TbAlertCircle, TbRefresh, TbUsers, TbUserPlus, TbSearch } from 'react-icons/tb'
import { useTasksSpace } from '../../../../contexts/tasks-space.context'
import { useWorkspaceMember } from '@/contexts/workspace-member.context'
import useSpaceParticipants, { useUpdateSpaceParticipant } from '@/hooks/use-space-participants'
import SectionPlaceholder from '@/components/placeholders/SectionPlaceholder'
import { toast } from 'sonner'
import type { SpaceParticipantWithMember } from '@/types/spaces.types'
import InviteParticipantDialog from '../InviteParticipantDialog'

interface ParticipantRowProps {
    participant: SpaceParticipantWithMember
    canUpdate: boolean
    onUpdate: (participantId: string, field: 'permissions' | 'status', value: string) => void
    isUpdating: boolean
    isSpaceOwner: boolean
}

function ParticipantRow({ participant, canUpdate, onUpdate, isUpdating, isSpaceOwner }: ParticipantRowProps) {
    const getInitials = (firstName: string, lastName: string) => {
        return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase()
    }

    const getPermissionBadge = (permission: string) => {
        switch (permission) {
            case 'admin':
                return <Badge variant="default">Admin</Badge>
            case 'regular':
                return <Badge variant="secondary">Regular</Badge>
            default:
                return <Badge variant="outline">{permission}</Badge>
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active':
                return <Badge variant="default" className="bg-green-500">Active</Badge>
            case 'inactive':
                return <Badge variant="destructive">Inactive</Badge>
            default:
                return <Badge variant="outline">{status}</Badge>
        }
    }

    return (
        <TableRow>
            <TableCell>
                <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                            {getInitials(participant.member.firstName, participant.member.lastName)}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-medium text-sm">
                            {participant.member.firstName} {participant.member.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {participant.member.primaryEmail}
                        </p>
                    </div>
                </div>
            </TableCell>            <TableCell>
                {canUpdate && !isSpaceOwner ? (
                    <Select
                        value={participant.permissions}
                        onValueChange={(value) => onUpdate(participant._id, 'permissions', value)}
                        disabled={isUpdating}
                    >
                        <SelectTrigger className="w-32">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="regular">Regular</SelectItem>
                        </SelectContent>
                    </Select>
                ) : (
                    getPermissionBadge(participant.permissions)
                )}
            </TableCell>
            <TableCell>
                {canUpdate && !isSpaceOwner ? (
                    <Select
                        value={participant.status}
                        onValueChange={(value) => onUpdate(participant._id, 'status', value)}
                        disabled={isUpdating}
                    >
                        <SelectTrigger className="w-32">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                    </Select>
                ) : (
                    getStatusBadge(participant.status)
                )}
            </TableCell>
            <TableCell className="text-xs text-muted-foreground">
                {new Date(participant.createdAt).toLocaleDateString()}
            </TableCell>
        </TableRow>
    )
}

function ParticipantsTableSkeleton() {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <Skeleton className="h-8 w-40" />
                <Skeleton className="h-10 w-32" />
            </div>

            <div className="flex items-center gap-4">
                <Skeleton className="h-10 w-80" />
                <Skeleton className="h-4 w-20" />
            </div>

            <div className="border rounded-lg">
                <div className="border-b">
                    <div className="grid grid-cols-5 gap-4 p-4">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Skeleton key={i} className="h-4 w-20" />
                        ))}
                    </div>
                </div>
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="grid grid-cols-5 gap-4 p-4 border-b last:border-b-0">
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-8 w-8 rounded-full" />
                            <div className="space-y-1">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-3 w-48" />
                            </div>
                        </div>
                        <Skeleton className="h-6 w-16" />
                        <Skeleton className="h-6 w-20" />
                        <Skeleton className="h-6 w-16" />
                        <Skeleton className="h-4 w-20" />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default function SpaceParticipants() {
    const { state } = useTasksSpace()
    const { space } = state
    const { state: memberState } = useWorkspaceMember()
    const { member } = memberState

    const [searchQuery, setSearchQuery] = useState('')
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [updatingParticipant, setUpdatingParticipant] = useState<string | null>(null)
    const [showInviteDialog, setShowInviteDialog] = useState(false)
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery)
        }, 400)

        return () => clearTimeout(timer)
    }, [searchQuery])

    const {
        participants,
        pagination,
        isLoading,
        error,
        refetch,
    } = useSpaceParticipants({
        spaceId: space?.space._id || '',
        page: currentPage,
        limit: 10,
        search: debouncedSearchQuery,
    }, {
        enabled: !!space?.space._id,
    })

    const updateParticipant = useUpdateSpaceParticipant()

    const canUpdateParticipants = member?.permission === 'manager' ||
        member?.permission === 'admin' ||
        member?.permission === 'super_admin'

    const handleUpdateParticipant = async (
        participantId: string,
        field: 'permissions' | 'status',
        value: string
    ) => {
        setUpdatingParticipant(participantId)

        try {
            await updateParticipant.mutateAsync({
                participantId,
                spaceId: space?.space._id || '',
                [field]: value,
            })

            toast.success('Participant updated successfully')
        } catch (error: any) {
            toast.error('Failed to update participant', {
                description: error.message || 'An unexpected error occurred',
            })
        } finally {
            setUpdatingParticipant(null)
        }
    }

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    const handleOpenInviteDialog = () => {
        setShowInviteDialog(true)
    }

    const handleCloseInviteDialog = () => {
        setShowInviteDialog(false)
    }

    if (isLoading && !participants.length) {
        return (
            <div className='flex justify-center'>
                <div className='container max-w-6xl'>
                    <div className="p-6">
                        <ParticipantsTableSkeleton />
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className='flex justify-center'>
                <div className='container max-w-6xl'>
                    <div className="p-6">
                        <SectionPlaceholder
                            variant="error"
                            icon={TbAlertCircle}
                            heading="Failed to load participants"
                            subHeading="We couldn't load the space participants. Please check your connection and try again."
                            ctaButton={{
                                label: "Try Again",
                                onClick: () => refetch(),
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

    return (
        <div className='flex justify-center'>
            <div className='container max-w-6xl'>
                <div className="p-6 space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold">Participants</h2>
                            <p className="text-muted-foreground">Manage people who have access to this space</p>
                        </div>
                        <Button onClick={handleOpenInviteDialog}>
                            <TbUserPlus className="h-4 w-4 mr-2" />
                            Invite People
                        </Button>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative flex-1 max-w-80">
                            <TbSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search participants..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <TbUsers className="h-4 w-4" />
                            <span className="text-sm">{pagination?.totalDocs || 0} participants</span>
                        </div>
                    </div>

                    {participants.length === 0 && !isLoading ? (
                        <div className="py-12">
                            <SectionPlaceholder
                                variant="empty"
                                icon={TbUsers}
                                heading={searchQuery ? "No participants found" : "No participants yet"}
                                subHeading={searchQuery ? "Try adjusting your search terms." : "Invite people to collaborate on this space."}                                ctaButton={!searchQuery ? {
                                    label: "Invite People",
                                    onClick: handleOpenInviteDialog,
                                    variant: "default",
                                    icon: TbUserPlus
                                } : undefined}
                            />
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="border rounded-lg">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Member</TableHead>
                                            <TableHead>Space Permissions</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Joined</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>                                        {participants.map((participant) => (
                                            <ParticipantRow
                                                key={participant._id}
                                                participant={participant}
                                                canUpdate={canUpdateParticipants}
                                                onUpdate={handleUpdateParticipant}
                                                isUpdating={updatingParticipant === participant._id}
                                                isSpaceOwner={participant.member._id === space?.space.createdBy}
                                            />
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                            {pagination && pagination.totalPages > 1 && (
                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-muted-foreground">
                                        Showing {pagination.pagingCounter} to {Math.min(pagination.pagingCounter + pagination.limit - 1, pagination.totalDocs)} of {pagination.totalDocs} participants
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={!pagination.hasPrevPage}
                                        >
                                            Previous
                                        </Button>
                                        <span className="text-sm">
                                            Page {pagination.page} of {pagination.totalPages}
                                        </span>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={!pagination.hasNextPage}
                                        >
                                            Next
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <InviteParticipantDialog
                isOpen={showInviteDialog}
                onClose={handleCloseInviteDialog}
                spaceId={space?.space._id || ''}
            />
        </div>
    )
}

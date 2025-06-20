'use client'

import { useWorkspaceMember } from '@/hooks/use-workspace-member'
import { useAcceptInvitation } from '@/hooks/use-workspace-members'
import AppLogo from '@/components/AppLogo'
import SectionPlaceholder from '@/components/placeholders/SectionPlaceholder'
import WorkspaceInvitationDialog from '@/components/WorkspaceInvitationDialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import React, { useState, useEffect } from 'react'
import { TbBuilding, TbClock, TbUsers, TbPlus, TbAlertTriangle, TbRefresh, TbSearch, TbX, TbMail } from 'react-icons/tb'
import { format } from 'date-fns'
import { toast } from 'sonner'
import type { WorkspaceMember, Workspace } from '@/types/workspace.types'
import { useRouter } from 'next13-progressbar'

export default function WorkspacesPage() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('')
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
    const [pendingInvitation, setPendingInvitation] = useState<WorkspaceMember | null>(null)
    const [isAccepting, setIsAccepting] = useState(false)

    const acceptInvitation = useAcceptInvitation()

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm)
        }, 500)

        return () => clearTimeout(timer)
    }, [searchTerm])

    const {
        data: memberships,
        workspaces,
        isLoading,
        error,
        refetch,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage
    } = useWorkspaceMember({ search: debouncedSearchTerm })

    console.log('INCOMING::', {
        data: memberships,
        // workspaces,
        isLoading,
    })

    const handleRetry = () => {
        refetch()
    }

    const handleLoadMore = () => {
        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage()
        }
    }

    const handleClearSearch = () => {
        setSearchTerm('')
    }

    const handleWorkspaceClick = (member: WorkspaceMember) => {
        if (member.status === 'pending') {
            setPendingInvitation(member)
        } else {
            router.push(`/workspaces/${member._id}/apps/tasks`)
        }
    }

    const handleAcceptInvitation = async () => {
        if (!pendingInvitation) return

        setIsAccepting(true)

        try {
            await acceptInvitation.mutateAsync({ memberId: pendingInvitation._id })
            toast.success('Invitation accepted successfully!')
            setPendingInvitation(null)
            router.push(`/workspaces/${pendingInvitation._id}/apps/tasks`);
        } catch (error: any) {
            console.error('Failed to accept invitation:', error)
            const errorMessage = error?.response?.data?.message || error?.message || 'Failed to accept invitation'
            toast.error(errorMessage)
        } finally {
            setIsAccepting(false)
        }
    }

    const handleCloseInvitationDialog = () => {
        setPendingInvitation(null)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
            <div className="container mx-auto px-4 py-8">                <div className="flex flex-col items-center space-y-8">
                <div className="flex flex-col items-center space-y-6 w-full mb-20">
                    <AppLogo size={180} />

                    <div className="w-full max-w-md relative">
                        <div className="relative">
                            <TbSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Search workspaces..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-10 h-12 text-center bg-background/50 backdrop-blur-sm border-border/50 shadow-lg focus:shadow-xl transition-all duration-200 rounded-full"
                            />
                            {searchTerm && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleClearSearch}
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 rounded-full hover:bg-muted"
                                >
                                    <TbX className="h-4 w-4" />
                                </Button>
                            )}
                        </div>

                        {searchTerm && (
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 text-sm text-muted-foreground">
                                {isLoading ? (
                                    <span className="flex items-center gap-2">
                                        <div className="animate-spin rounded-full h-3 w-3 border-b border-primary"></div>
                                        Searching...
                                    </span>
                                ) : (
                                    <span>
                                        {memberships.length === 0
                                            ? `No workspaces found for "${searchTerm}"`
                                            : `Found ${memberships.length} workspace${memberships.length === 1 ? '' : 's'}`
                                        }
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="w-full max-w-6xl">                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl font-bold text-foreground">Your Workspaces</h1>
                        <Button className="h-10" onClick={() => router.push('/workspaces/create')}>
                            <TbPlus className="h-4 w-4 mr-2" />
                            Create Workspace
                        </Button>
                    </div>
                    {error ? (
                        <SectionPlaceholder
                            variant="error"
                            icon={TbAlertTriangle}
                            heading="Failed to load workspaces"
                            subHeading="We couldn't load your workspaces. Please check your connection and try again."
                            ctaButton={{
                                label: "Try Again",
                                onClick: handleRetry,
                                variant: "outline",
                                icon: TbRefresh
                            }}
                            fullWidth
                        />) : (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {isLoading ? (
                                    Array.from({ length: 4 }).map((_, index) => (
                                        <Card key={index} className='py-0'>
                                            <CardContent className="p-6">
                                                <div className="flex items-center space-x-4">
                                                    <Skeleton className="h-20 w-20 rounded-lg" />
                                                    <div className="flex-1 space-y-2">
                                                        <Skeleton className="h-5 w-32" />
                                                        <Skeleton className="h-4 w-48" />
                                                        <div className="flex space-x-4">
                                                            <Skeleton className="h-3 w-20" />
                                                            <Skeleton className="h-3 w-16" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))) : memberships.length > 0 ? (
                                        memberships.map((member) => {
                                            const isPending = member.status === 'pending'

                                            return (
                                                <div key={member._id} onClick={() => handleWorkspaceClick(member)}>
                                                    <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group hover:border-primary py-0">
                                                        <CardContent className="p-6">
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center space-x-4">
                                                                    <div 
                                                                    className="bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors h-20 w-20 bg-center bg-cover"
                                                                    style={{ backgroundImage: `url(${member.workspace.logoURL})`}}
                                                                    >
                                                                    </div>

                                                                    <div className="flex-1 min-w-0">
                                                                        <h3 className="font-semibold text-foreground text-lg truncate">
                                                                            {member.workspace.name}
                                                                        </h3>
                                                                        <p className="text-muted-foreground text-sm truncate">
                                                                            {member.workspace.description || 'No description'}
                                                                        </p>
                                                                        <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                                                                            <div className="flex items-center space-x-1">
                                                                                <TbClock className="h-3 w-3" />
                                                                                <span>{format(new Date(member.workspace.updatedAt), 'MMM d, yyyy')}</span>
                                                                            </div>
                                                                            <div className="flex items-center space-x-1">
                                                                                <TbUsers className="h-3 w-3" />
                                                                                <span>{member.permission}</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                {isPending && (
                                                                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                                                                        <TbMail className="h-3 w-3 mr-1" />
                                                                        Pending
                                                                    </Badge>
                                                                )}
                                                            </div>

                                                            {isPending && (
                                                                <div className="text-xs text-muted-foreground bg-muted/50 rounded-md p-2">
                                                                    Click to accept your invitation to this workspace
                                                                </div>
                                                            )}
                                                        </CardContent>
                                                    </Card>
                                                </div>
                                            )
                                        })
                                    ) : (
                                    <div className="col-span-2">
                                        <SectionPlaceholder
                                            variant="empty"
                                            icon={TbBuilding}
                                            heading="No workspaces yet"
                                            subHeading="Get started by creating your first workspace. Organize your projects and collaborate with your team." 
                                            fullWidth
                                        />
                                    </div>
                                )}
                            </div>

                            {hasNextPage && (
                                <div className="flex justify-center">
                                    <Button
                                        onClick={handleLoadMore}
                                        disabled={isFetchingNextPage}
                                        variant="outline"
                                    >
                                        {isFetchingNextPage ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                                                Loading...
                                            </>
                                        ) : (
                                            'Load More'
                                        )}
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}                    </div>
            </div>            </div>

            <WorkspaceInvitationDialog
                member={pendingInvitation}
                workspace={pendingInvitation ? pendingInvitation.workspace : null}
                isOpen={!!pendingInvitation}
                isAccepting={isAccepting}
                onAccept={handleAcceptInvitation}
                onClose={handleCloseInvitationDialog}
            />
        </div>
    )
}

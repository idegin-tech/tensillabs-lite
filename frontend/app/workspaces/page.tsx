'use client'

import { useWorkspaceMemberships } from '@/hooks/use-workspace-memberships'
import AppLogo from '@/components/AppLogo'
import SectionPlaceholder from '@/components/placeholders/SectionPlaceholder'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import React, { useMemo } from 'react'
import { TbBuilding, TbClock, TbUsers, TbPlus, TbAlertTriangle, TbRefresh } from 'react-icons/tb'
import Link from 'next/link'
import { format } from 'date-fns'

interface WorkspaceListItem {
    memberId: string
    id: string
    name: string
    logoUrl?: string
    lastAccessed: string
    memberCount: number
    description?: string
}

export default function WorkspacesPage() {
    const {
        data: memberships,
        workspaces,
        isLoading,
        error,
        refetch,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage
    } = useWorkspaceMemberships()

    const displayWorkspaces: WorkspaceListItem[] = useMemo(() => {
        return memberships.map((member) => ({
            memberId: member._id,
            id: member.workspace._id,
            name: member.workspace.name,
            description: member.workspace.description,
            logoUrl: member.workspace.logoURL?.original,
            lastAccessed: format(new Date(member.workspace.updatedAt), 'MMM d, yyyy'),
            memberCount: 0 
        }))
    }, [memberships])

    const handleRetry = () => {
        refetch()
    }

    const handleLoadMore = () => {
        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage()
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col items-center space-y-8">                    <div className="flex flex-col items-center space-y-6 w-full">
                        <AppLogo size={180} />
                    </div>

                    <div className="w-full max-w-6xl">
                        <div className="flex items-center justify-between mb-6">
                            <h1 className="text-2xl font-bold text-foreground">Your Workspaces</h1>
                            <Button className="h-10">
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
                            />                        ) : (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {isLoading ? (
                                        Array.from({ length: 4 }).map((_, index) => (
                                            <Card key={index}>
                                                <CardContent className="p-6">
                                                    <div className="flex items-center space-x-4">
                                                        <Skeleton className="h-12 w-12 rounded-lg" />
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
                                        ))) : displayWorkspaces.length > 0 ? (
                                        displayWorkspaces.map((workspace) => (
                                            <Link key={workspace.memberId} href={`/workspaces/${workspace.memberId}/apps/tasks`}>
                                                <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group hover:border-primary py-0">
                                                    <CardContent className="p-6">
                                                        <div className="flex items-center space-x-4">
                                                            <div className="bg-primary/10 rounded-lg p-3 group-hover:bg-primary/20 transition-colors">
                                                                {workspace.logoUrl ? (
                                                                    <img 
                                                                        src={workspace.logoUrl} 
                                                                        alt={workspace.name}
                                                                        className="h-6 w-6 object-cover rounded"
                                                                    />
                                                                ) : (
                                                                    <TbBuilding className="h-6 w-6 text-primary" />
                                                                )}
                                                            </div>

                                                            <div className="flex-1 min-w-0">
                                                                <h3 className="font-semibold text-foreground text-lg truncate">
                                                                    {workspace.name}
                                                                </h3>
                                                                <p className="text-muted-foreground text-sm truncate">
                                                                    {workspace.description || 'No description'}
                                                                </p>
                                                                <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                                                                    <div className="flex items-center space-x-1">
                                                                        <TbClock className="h-3 w-3" />
                                                                        <span>{workspace.lastAccessed}</span>
                                                                    </div>
                                                                    {workspace.memberCount > 0 && (
                                                                        <div className="flex items-center space-x-1">
                                                                            <TbUsers className="h-3 w-3" />
                                                                            <span>{workspace.memberCount} members</span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </Link>
                                        ))                                    ) : (
                                        <div className="col-span-2">
                                            <SectionPlaceholder
                                                variant="empty"
                                                icon={TbBuilding}
                                                heading="No workspaces yet"
                                                subHeading="Get started by creating your first workspace. Organize your projects and collaborate with your team."
                                                ctaButton={{
                                                    label: "Create Your First Workspace",
                                                    onClick: () => {},
                                                    variant: "default",
                                                    icon: TbPlus
                                                }}
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
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

'use client'

import { useAuthActions } from '@/hooks/use-next-auth'
import AppLogo from '@/components/AppLogo'
import SectionPlaceholder from '@/components/placeholders/SectionPlaceholder'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import React, { useState, useEffect } from 'react'
import { TbSearch, TbBuilding, TbClock, TbUsers, TbPlus, TbAlertTriangle, TbRefresh } from 'react-icons/tb'
import Link from 'next/link'

interface Workspace {
    id: string
    name: string
    logoUrl?: string
    lastAccessed: string
    memberCount: number
    description?: string
}

export default function WorkspacesPage() {
    const { logout } = useAuthActions()
    const [workspaces, setWorkspaces] = useState<Workspace[]>([])
    const [filteredWorkspaces, setFilteredWorkspaces] = useState<Workspace[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState('')

    const mockWorkspaces: Workspace[] = [
        {
            id: '1',
            name: 'Design Team',
            lastAccessed: '2 hours ago',
            memberCount: 12,
            description: 'Creative design projects and brand assets'
        },
        {
            id: '2',
            name: 'Development Team',
            lastAccessed: '1 day ago',
            memberCount: 8,
            description: 'Software development and technical projects'
        },
        {
            id: '3',
            name: 'Marketing Hub',
            lastAccessed: '3 days ago',
            memberCount: 15,
            description: 'Marketing campaigns and growth initiatives'
        },
        {
            id: '4',
            name: 'Product Strategy',
            lastAccessed: '1 week ago',
            memberCount: 6,
            description: 'Product roadmap and strategic planning'
        }
    ]

    const fetchWorkspaces = React.useCallback(async () => {
        setIsLoading(true)
        setError(null)

        try {
            await new Promise(resolve => setTimeout(resolve, 1000))
            setWorkspaces(mockWorkspaces)
            setFilteredWorkspaces(mockWorkspaces)
        } catch (err) {
            setError('Failed to load workspaces')
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchWorkspaces()
    }, [fetchWorkspaces])

    useEffect(() => {
        const filtered = workspaces.filter(workspace =>
            workspace.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            workspace.description?.toLowerCase().includes(searchQuery.toLowerCase())
        )
        setFilteredWorkspaces(filtered)
    }, [searchQuery, workspaces])

    const handleRetry = () => {
        fetchWorkspaces()
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col items-center space-y-8">
                    <div className="flex flex-col items-center space-y-6 w-full">
                        <AppLogo size={180} />

                        <div className="relative w-full max-w-md">
                            <TbSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search workspaces..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 h-11 w-full border-border/50 focus:border-primary transition-colors"
                            />
                        </div>
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
                            />
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {isLoading ? (
                                    Array.from({ length: 4 }).map((_, index) => (
                                        <Card key={index}>
                                            <CardContent>
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
                                                    <Skeleton className="h-8 w-8 rounded" />
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))
                                ) : filteredWorkspaces.length > 0 ? (
                                    filteredWorkspaces.map((workspace) => (
                                        <Link key={workspace.id} href={`/workspaces/${workspace.id}/apps/tasks`}>
                                            <Card  className="hover:shadow-lg transition-all duration-200 cursor-pointer group hover:border-primary">
                                                <CardContent>
                                                    <div className="flex items-center space-x-4">
                                                        <div className="bg-primary/10 rounded-lg p-3 group-hover:bg-primary/20 transition-colors">
                                                            <TbBuilding className="h-6 w-6 text-primary" />
                                                        </div>

                                                        <div className="flex-1 min-w-0">
                                                            <h3 className="font-semibold text-foreground text-lg truncate">
                                                                {workspace.name}
                                                            </h3>
                                                            <p className="text-muted-foreground text-sm truncate">
                                                                {workspace.description}
                                                            </p>
                                                            <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                                                                <div className="flex items-center space-x-1">
                                                                    <TbClock className="h-3 w-3" />
                                                                    <span>{workspace.lastAccessed}</span>
                                                                </div>
                                                                <div className="flex items-center space-x-1">
                                                                    <TbUsers className="h-3 w-3" />
                                                                    <span>{workspace.memberCount} members</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </Link>
                                    ))) : (
                                    <div className="col-span-2">
                                        <SectionPlaceholder
                                            variant={searchQuery ? "default" : "empty"}
                                            icon={searchQuery ? TbSearch : TbBuilding}
                                            heading={searchQuery ? "No workspaces found" : "No workspaces yet"}
                                            subHeading={
                                                searchQuery
                                                    ? `No workspaces match "${searchQuery}". Try adjusting your search terms.`
                                                    : "Get started by creating your first workspace. Organize your projects and collaborate with your team."
                                            }
                                            ctaButton={!searchQuery ? {
                                                label: "Create Your First Workspace",
                                                onClick: () => console.log('Create workspace'),
                                                variant: "default",
                                                icon: TbPlus
                                            } : undefined}
                                            fullWidth
                                        />
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

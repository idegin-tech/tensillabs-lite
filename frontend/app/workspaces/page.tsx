'use client'

import { useWorkspaceMember } from '@/hooks/use-workspace-member'
import AppLogo from '@/components/AppLogo'
import SectionPlaceholder from '@/components/placeholders/SectionPlaceholder'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import React, { useState, useEffect, useMemo } from 'react'
import { TbBuilding, TbClock, TbUsers, TbPlus, TbAlertTriangle, TbRefresh, TbSearch, TbX } from 'react-icons/tb'
import Link from 'next/link'
import { format } from 'date-fns'

export default function WorkspacesPage() {
    const [searchTerm, setSearchTerm] = useState('')
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')

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
                                            <Card key={index} className='py-0'>
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
                                        ))) : memberships.length > 0 ? (
                                        memberships.map((member) => (
                                            <Link key={member._id} href={`/workspaces/${member._id}/apps/tasks`}>
                                                <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group hover:border-primary py-0">
                                                    <CardContent className="p-6">
                                                        <div className="flex items-center space-x-4">
                                                            <div className="bg-primary/10 rounded-lg p-3 group-hover:bg-primary/20 transition-colors">
                                                                {member.workspace.logoURL?.original ? (
                                                                    <img 
                                                                        src={member.workspace.logoURL.original} 
                                                                        alt={member.workspace.name}
                                                                        className="h-6 w-6 object-cover rounded"
                                                                    />
                                                                ) : (
                                                                    <TbBuilding className="h-6 w-6 text-primary" />
                                                                )}
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
                                                    </CardContent>
                                                </Card>
                                            </Link>
                                        ))
                                    ) : (
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

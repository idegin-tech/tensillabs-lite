'use client'
import AppBody from '@/components/layout/app-layout/AppBody'
import SectionPlaceholder from '@/components/placeholders/SectionPlaceholder'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import React, { useEffect } from 'react'
import {
  TbUsers,
  TbList,
  TbPlus,
  TbAlertCircle,
  TbRefresh,
  TbFolderX
} from 'react-icons/tb'
import { useTasksApp } from '../contexts/tasks-app.context'
import { useInView } from 'react-intersection-observer'
import { useRouter } from 'next/navigation'
import useCommon from '@/hooks/use-common'
import type { Space } from '@/types/spaces.types'

function SpaceCard({ space }: { space: Space }) {
  const router = useRouter()
  const { getPathToApp } = useCommon()
  const colorClass = space.color || '#3B82F6'

  const handleClick = () => {
    router.push(`${getPathToApp('tasks')}/spaces/${space._id}`)
  }
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-border/50 hover:border-primary/20 bg-card/50 backdrop-blur-sm py-0" onClick={handleClick}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div
              className="h-12 w-12 rounded-lg text-white shadow-sm flex items-center justify-center"
              style={{ backgroundColor: colorClass }}
            >
              {/* <IconComponent className="h-7 w-7" /> */}
              <i className={`fas ${space.icon} text-xl`}></i>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-foreground transition-colors">
                {space.name}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {space.description || 'No description provided'}
              </p>
            </div>
          </div>
        </div>        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1 text-muted-foreground">
                <TbList className="h-4 w-4" />
                <span>{space.listCount} lists</span>
              </div>
              <div className="flex items-center space-x-1 text-muted-foreground">
                <TbUsers className="h-4 w-4" />
                <span>{space.participantCount} members</span>
              </div>
            </div>
          </div>

          {space.recentParticipants.length > 0 && (
            <div className="flex items-center justify-between">
              <div className="flex -space-x-2">
                {space.recentParticipants.slice(0, 3).map((participant) => (
                  <Avatar key={participant._id} className="h-8 w-8 border-2 border-background">
                    <AvatarFallback className="text-xs bg-muted">
                      {participant.firstName?.[0]}{participant.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {space.participantCount > 3 && (
                  <Avatar className="h-8 w-8 border-2 border-background">
                    <AvatarFallback className="text-xs bg-muted">
                      +{space.participantCount - 3}
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
              <Badge variant="secondary" className="text-xs">
                {new Date(space.createdAt).toLocaleDateString()}
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function SpaceCardSkeleton() {
  return (
    <div className="border-border/50 rounded-xl border backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Skeleton className="h-11 w-11 rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex -space-x-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-8 rounded-full border-2 border-background" />
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </div>
  )
}

export default function TaskHomePage() {
  const { state, updateState, refetchSpaces, fetchNextPage, hasNextPage, isFetchingNextPage } = useTasksApp()
  const { spaces, isLoading, error } = state

  const { ref, inView } = useInView({
    threshold: 0,
  })

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

  if (isLoading) {
    return (
      <AppBody>
        <div className='container mx-auto'>
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <Skeleton className="h-9 w-32 mb-2" />
                <Skeleton className="h-5 w-80" />
              </div>
              <Skeleton className="h-10 w-32" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <SpaceCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </AppBody>
    )
  }

  if (error) {
    return (
      <AppBody>
        <div className='container mx-auto'>
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Spaces</h1>
                <p className="text-muted-foreground mt-1">
                  Organize your work into focused spaces for better collaboration
                </p>
              </div>
            </div>

            <div className="py-12">
              <SectionPlaceholder
                variant="error"
                icon={TbAlertCircle}
                heading="Failed to load spaces"
                subHeading="We couldn't load your spaces. Please try again."
                ctaButton={{
                  label: "Try Again",
                  onClick: () => refetchSpaces(),
                  variant: "default",
                  icon: TbRefresh
                }}
                fullWidth
              />
            </div>
          </div>
        </div>
      </AppBody>
    )
  }

  return (
    <AppBody>
      <div className='container mx-auto'>
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Spaces</h1>
              <p className="text-muted-foreground mt-1">
                Organize your work into focused spaces for better collaboration
              </p>
            </div>
            <Button className="shadow-sm" onClick={() => updateState({ showCreateSpace: true })}>
              <TbPlus className="h-4 w-4 mr-2" />
              Create Space
            </Button>
          </div>

          {spaces.length > 0 ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {spaces.map((space) => (
                  <SpaceCard key={space._id} space={space} />
                ))}
              </div>

              {hasNextPage && (
                <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {isFetchingNextPage && Array.from({ length: 2 }).map((_, i) => (
                    <SpaceCardSkeleton key={`loading-${i}`} />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="py-12">
              <SectionPlaceholder
                variant="empty"
                icon={TbFolderX}
                heading="No spaces yet"
                subHeading="Get started by creating your first space. Organize your tasks and collaborate with your team more effectively."
                ctaButton={{
                  label: "Create Your First Space",
                  onClick: () => updateState({ showCreateSpace: true }),
                  variant: "default",
                  icon: TbPlus
                }}
                fullWidth
              />
            </div>
          )}
        </div>
      </div>
    </AppBody>
  )
}

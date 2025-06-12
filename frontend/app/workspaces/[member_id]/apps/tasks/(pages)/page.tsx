'use client'
import AppBody from '@/components/layout/app-layout/AppBody'
import SectionPlaceholder from '@/components/placeholders/SectionPlaceholder'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import React, { useState } from 'react'
import { 
  TbFolder, 
  TbUsers, 
  TbList, 
  TbPlus, 
  TbDots,
  TbPalette,
  TbCalendar,
  TbTarget,
  TbBulb
} from 'react-icons/tb'
import { cn } from '@/lib/utils'

interface Space {
  id: string
  name: string
  color: string
  icon: string
  description: string
  listsCount: number
  participantsCount: number
  completionProgress: number
  participants: Array<{
    id: string
    name: string
    avatar?: string
  }>
  lastActivity: string
}

const mockSpaces: Space[] = [
  {
    id: '1',
    name: 'Marketing Campaign',
    color: 'bg-blue-500',
    icon: 'TbTarget',
    description: 'Q1 2024 product launch campaigns and initiatives',
    listsCount: 12,
    participantsCount: 8,
    completionProgress: 75,
    participants: [
      { id: '1', name: 'John Doe' },
      { id: '2', name: 'Jane Smith' },
      { id: '3', name: 'Mike Johnson' },
    ],
    lastActivity: '2 hours ago'
  },
  {
    id: '2',
    name: 'Product Development',
    color: 'bg-emerald-500',
    icon: 'TbBulb',
    description: 'Feature development and bug fixes for the next release',
    listsCount: 18,
    participantsCount: 12,
    completionProgress: 45,
    participants: [
      { id: '4', name: 'Sarah Wilson' },
      { id: '5', name: 'Tom Brown' },
      { id: '6', name: 'Lisa Davis' },
    ],
    lastActivity: '1 hour ago'
  },
  {
    id: '3',
    name: 'Design System',
    color: 'bg-purple-500',
    icon: 'TbPalette',
    description: 'Building and maintaining our design system components',
    listsCount: 6,
    participantsCount: 4,
    completionProgress: 90,
    participants: [
      { id: '7', name: 'Alex Chen' },
      { id: '8', name: 'Emma Taylor' },
    ],
    lastActivity: '30 minutes ago'
  },
  {
    id: '4',
    name: 'Event Planning',
    color: 'bg-orange-500',
    icon: 'TbCalendar',
    description: 'Annual conference planning and coordination',
    listsCount: 8,
    participantsCount: 6,
    completionProgress: 60,
    participants: [
      { id: '9', name: 'David Lee' },
      { id: '10', name: 'Rachel Green' },
      { id: '11', name: 'Kevin White' },
    ],
    lastActivity: '4 hours ago'
  }
]

function SpaceCard({ space }: { space: Space }) {
  const IconComponent = space.icon === 'TbTarget' ? TbTarget : 
                      space.icon === 'TbBulb' ? TbBulb :
                      space.icon === 'TbPalette' ? TbPalette :
                      TbCalendar

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-border/50 hover:border-primary/20 bg-card/50 backdrop-blur-sm py-0">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={cn(
              "p-3 rounded-xl text-white shadow-sm group-hover:scale-110 transition-transform duration-300",
              space.color
            )}>
              <IconComponent className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                {space.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {space.description}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1 text-muted-foreground">
                <TbList className="h-4 w-4" />
                <span>{space.listsCount} lists</span>
              </div>
              <div className="flex items-center space-x-1 text-muted-foreground">
                <TbUsers className="h-4 w-4" />
                <span>{space.participantsCount} members</span>
              </div>
            </div>
           <div className="flex items-center justify-between">
            <div className="flex -space-x-2">
              {space.participants.slice(0, 3).map((participant, index) => (
                <Avatar key={participant.id} className="h-8 w-8 border-2 border-background">
                  <AvatarFallback className="text-xs bg-muted">
                    {participant.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              ))}
              {space.participantsCount > 3 && (
                <Avatar className="h-8 w-8 border-2 border-background">
                  <AvatarFallback className="text-xs bg-muted">
                    +{space.participantsCount - 3}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium text-foreground">{space.completionProgress}%</span>
            </div>
            <Progress 
              value={space.completionProgress} 
              className="h-2"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function SpaceCardSkeleton() {
  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Skeleton className="h-11 w-11 rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
          <Skeleton className="h-8 w-8 rounded" />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
            </div>
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-8" />
            </div>
            <Skeleton className="h-2 w-full rounded-full" />
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
    </Card>
  )
}

export default function TaskHomePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [spaces] = useState<Space[]>(mockSpaces)

  return (
    <AppBody>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Spaces</h1>
            <p className="text-muted-foreground mt-1">
              Organize your work into focused spaces for better collaboration
            </p>
          </div>
          <Button className="shadow-sm">
            <TbPlus className="h-4 w-4 mr-2" />
            Create Space
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <SpaceCardSkeleton key={i} />
            ))}
          </div>
        ) : spaces.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {spaces.map((space) => (
              <SpaceCard key={space.id} space={space} />
            ))}
          </div>
        ) : (
          <div className="py-12">
            <SectionPlaceholder
              variant="empty"
              icon={TbFolder}
              heading="No spaces yet"
              subHeading="Get started by creating your first space. Organize your tasks and collaborate with your team more effectively."
              ctaButton={{
                label: "Create Your First Space",
                onClick: () => {},
                variant: "default",
                icon: TbPlus
              }}
              fullWidth
            />
          </div>
        )}
      </div>
    </AppBody>
  )
}

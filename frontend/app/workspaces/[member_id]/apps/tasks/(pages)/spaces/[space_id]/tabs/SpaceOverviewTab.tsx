'use client'
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    TbClock,
    TbCircleCheck,
    TbCircle,
    TbList,
    TbPlus,
    TbTarget,
    TbPalette,
    TbBulb,
    TbCalendar,
    TbUsers,
    TbDots
} from 'react-icons/tb'
import { cn } from '@/lib/utils'

interface TaskList {
    id: string
    name: string
    description: string
    icon: string
    color: string
    totalTasks: number
    completedTasks: number
    priority: 'low' | 'medium' | 'high'
    dueDate?: string
}

const mockTaskLists: TaskList[] = [
    {
        id: '1',
        name: 'Brand Guidelines',
        description: 'Comprehensive brand identity and visual guidelines',
        icon: 'TbPalette',
        color: 'bg-purple-500',
        totalTasks: 24,
        completedTasks: 18,
        priority: 'high',
        dueDate: '2025-06-20'
    },
    {
        id: '2',
        name: 'Marketing Campaign',
        description: 'Q2 product launch marketing initiatives',
        icon: 'TbTarget',
        color: 'bg-blue-500',
        totalTasks: 32,
        completedTasks: 12,
        priority: 'high'
    },
    {
        id: '3',
        name: 'Website Redesign',
        description: 'Complete website overhaul and optimization',
        icon: 'TbBulb',
        color: 'bg-emerald-500',
        totalTasks: 18,
        completedTasks: 8,
        priority: 'medium',
        dueDate: '2025-07-15'
    },
    {
        id: '4',
        name: 'Event Planning',
        description: 'Annual conference organization and logistics',
        icon: 'TbCalendar',
        color: 'bg-orange-500',
        totalTasks: 15,
        completedTasks: 15,
        priority: 'low'
    },
    {
        id: '5',
        name: 'Product Features',
        description: 'New feature development and testing',
        icon: 'TbBulb',
        color: 'bg-indigo-500',
        totalTasks: 28,
        completedTasks: 14,
        priority: 'medium'
    },
    {
        id: '6',
        name: 'User Research',
        description: 'Customer interviews and usability testing',
        icon: 'TbUsers',
        color: 'bg-pink-500',
        totalTasks: 12,
        completedTasks: 9,
        priority: 'medium'
    }
]

function TaskListCard({ list }: { list: TaskList }) {
    const completionPercentage = Math.round((list.completedTasks / list.totalTasks) * 100)

    const IconComponent = list.icon === 'TbTarget' ? TbTarget :
        list.icon === 'TbBulb' ? TbBulb :
            list.icon === 'TbPalette' ? TbPalette :
                list.icon === 'TbCalendar' ? TbCalendar :
                    list.icon === 'TbUsers' ? TbUsers :
                        TbList

    return (
        <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-border/50 hover:border-primary/20">
            <CardContent className='space-y-3'>
                <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                        <div className={cn(
                            "p-2.5 rounded-lg text-white shadow-sm group-hover:scale-110 transition-transform duration-300",
                            list.color
                        )}>
                            <IconComponent className="h-6 w-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <CardTitle className="text-base font-semibold truncate group-hover:text-primary transition-colors">
                                {list.name}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                {list.description}
                            </p>
                        </div>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <TbDots className="h-4 w-4" />
                    </Button>
                </div>
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{completionPercentage}%</span>
                    </div>
                    <Progress value={completionPercentage} className="h-2" />
                </div>
            </CardContent>
        </Card>
    )
}

export default function SpaceOverviewTab() {
    const totalTasks = mockTaskLists.reduce((sum, list) => sum + list.totalTasks, 0)
    const completedTasks = mockTaskLists.reduce((sum, list) => sum + list.completedTasks, 0)
    const inProgressTasks = totalTasks - completedTasks
    const pendingTasks = mockTaskLists.filter(list => list.completedTasks === 0).reduce((sum, list) => sum + list.totalTasks, 0)

    return (
        <div className='flex justify-center'>
            <div className='container max-auto'>
                <div className="p-6 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="border-border py-0">
                            <CardContent className="p-6">
                                <div className="flex items-center space-x-4">
                                    <div className="p-3 bg-muted rounded-lg">
                                        <TbCircle className="h-6 w-6 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Pending Tasks</p>
                                        <p className="text-3xl font-bold text-foreground">{pendingTasks}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-border py-0">
                            <CardContent className="p-6">
                                <div className="flex items-center space-x-4">
                                    <div className="p-3 bg-muted rounded-lg">
                                        <TbClock className="h-6 w-6 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                                        <p className="text-3xl font-bold text-foreground">{inProgressTasks}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-border py-0">
                            <CardContent className="p-6">
                                <div className="flex items-center space-x-4">
                                    <div className="p-3 bg-muted rounded-lg">
                                        <TbCircleCheck className="h-6 w-6 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Completed</p>
                                        <p className="text-3xl font-bold text-foreground">{completedTasks}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold">Task Lists</h2>
                                <p className="text-muted-foreground">Manage your project tasks organized by lists</p>
                            </div>
                            <Button>
                                <TbPlus className="h-4 w-4 mr-2" />
                                New List
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {mockTaskLists.map((list) => (
                                <TaskListCard key={list.id} list={list} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

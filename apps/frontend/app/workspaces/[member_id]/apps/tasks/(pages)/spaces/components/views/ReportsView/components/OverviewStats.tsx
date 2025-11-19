'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TbCircleCheck, TbProgress, TbAlertCircle, TbListCheck } from 'react-icons/tb'

interface OverviewStatsProps {
    data: {
        total: number
        completed: number
        completionRate: number
        inProgress: number
        overdue: number
    } | null
}

export default function OverviewStats({ data }: OverviewStatsProps) {
    if (!data) return null

    const stats = [
        {
            title: 'Total Tasks',
            value: data.total,
            icon: TbListCheck,
            color: 'text-primary',
            bgColor: 'bg-primary/10',
        },
        {
            title: 'Completed',
            value: data.completed,
            percentage: data.completionRate,
            icon: TbCircleCheck,
            color: 'text-success',
            bgColor: 'bg-success/10',
        },
        {
            title: 'In Progress',
            value: data.inProgress,
            percentage: data.total > 0 ? Math.round((data.inProgress / data.total) * 100) : 0,
            icon: TbProgress,
            color: 'text-info',
            bgColor: 'bg-info/10',
        },
        {
            title: 'Overdue',
            value: data.overdue,
            percentage: data.total > 0 ? Math.round((data.overdue / data.total) * 100) : 0,
            icon: TbAlertCircle,
            color: 'text-destructive',
            bgColor: 'bg-destructive/10',
        },
    ]

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
                <Card key={stat.title} className="border-border/50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            {stat.title}
                        </CardTitle>
                        <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                            <stat.icon className={`h-4 w-4 ${stat.color}`} />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stat.value}</div>
                        {stat.percentage !== undefined && (
                            <p className="text-xs text-muted-foreground mt-1">
                                {stat.percentage}% of total tasks
                            </p>
                        )}
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Label, Pie, PieChart } from 'recharts'
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart'
import { useMemo } from 'react'
import { TbCircleCheck, TbProgress, TbEye, TbListCheck, TbX, TbChartPie } from 'react-icons/tb'
import SectionPlaceholder from '@/components/placeholders/SectionPlaceholder'

interface StatusDistributionProps {
    data: {
        todo: number
        in_progress: number
        in_review: number
        completed: number
        canceled: number
    } | null
}

const chartConfig = {
    tasks: {
        label: 'Tasks',
    },
    completed: {
        label: 'Completed',
        color: 'var(--success)',
    },
    in_progress: {
        label: 'In Progress',
        color: 'var(--info)',
    },
    in_review: {
        label: 'In Review',
        color: 'var(--warning)',
    },
    todo: {
        label: 'To Do',
        color: 'var(--chart-1)',
    },
    canceled: {
        label: 'Canceled',
        color: 'var(--destructive)',
    },
} satisfies ChartConfig

export default function StatusDistribution({ data }: StatusDistributionProps) {
    const chartData = useMemo(() => {
        if (!data) return []
        return [
            { status: 'completed', tasks: data.completed, fill: 'var(--success)' },
            { status: 'in_progress', tasks: data.in_progress, fill: 'var(--info)' },
            { status: 'in_review', tasks: data.in_review, fill: 'var(--warning)' },
            { status: 'todo', tasks: data.todo, fill: 'var(--chart-1)' },
            { status: 'canceled', tasks: data.canceled, fill: 'var(--destructive)' },
        ].filter(item => item.tasks > 0)
    }, [data])

    const totalTasks = useMemo(() => {
        return chartData.reduce((acc, curr) => acc + curr.tasks, 0)
    }, [chartData])

    if (!data || totalTasks === 0) {
        return (
            <Card className="border-border/50">
                <CardHeader>
                    <CardTitle>Task Status Distribution</CardTitle>
                    <CardDescription>Breakdown of tasks by current status</CardDescription>
                </CardHeader>
                <CardContent>
                    <SectionPlaceholder
                        icon={TbChartPie}
                        heading="No Status Data"
                        subHeading="Task status information will appear here once tasks are created."
                        variant="empty"
                    />
                </CardContent>
            </Card>
        )
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed':
                return TbCircleCheck
            case 'in_progress':
                return TbProgress
            case 'in_review':
                return TbEye
            case 'canceled':
                return TbX
            default:
                return TbListCheck
        }
    }

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'completed':
                return 'Completed'
            case 'in_progress':
                return 'In Progress'
            case 'in_review':
                return 'In Review'
            case 'todo':
                return 'To Do'
            case 'canceled':
                return 'Canceled'
            default:
                return status
        }
    }

    return (
        <Card className="border-border/50">
            <CardHeader>
                <CardTitle>Task Status Distribution</CardTitle>
                <CardDescription>Breakdown of tasks by current status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 flex">
                <div className="flex justify-center pb-6">
                    <ChartContainer
                        config={chartConfig}
                        className="mx-auto aspect-square h-[350px] w-full"
                    >
                        <PieChart>
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent hideLabel />}
                            />
                            <Pie
                                data={chartData}
                                dataKey="tasks"
                                nameKey="status"
                                innerRadius={80}
                                outerRadius={120}
                                strokeWidth={5}
                            >
                                <Label
                                    content={({ viewBox }) => {
                                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                            return (
                                                <text
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    textAnchor="middle"
                                                    dominantBaseline="middle"
                                                >
                                                    <tspan
                                                        x={viewBox.cx}
                                                        y={viewBox.cy}
                                                        className="fill-foreground text-3xl font-bold"
                                                    >
                                                        {totalTasks}
                                                    </tspan>
                                                    <tspan
                                                        x={viewBox.cx}
                                                        y={(viewBox.cy || 0) + 24}
                                                        className="fill-muted-foreground"
                                                    >
                                                        Total Tasks
                                                    </tspan>
                                                </text>
                                            )
                                        }
                                    }}
                                />
                            </Pie>
                        </PieChart>
                    </ChartContainer>
                </div>

                <div className="grid grid-cols-1 gap-4 flex-1">
                    {chartData.map((item) => {
                        const Icon = getStatusIcon(item.status)
                        const percentage = ((item.tasks / totalTasks) * 100).toFixed(1)
                        
                        return (
                            <div
                                key={item.status}
                                className="flex items-center gap-3 rounded-lg border border-border/50 p-3 hover:bg-muted/50 transition-colors"
                            >
                                <div
                                    className="h-3 w-3 rounded-full shrink-0"
                                    style={{ backgroundColor: item.fill }}
                                />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1.5">
                                        <Icon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                                        <p className="text-sm font-medium truncate">
                                            {getStatusLabel(item.status)}
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-between mt-0.5">
                                        <p className="text-lg font-bold">{item.tasks}</p>
                                        <p className="text-xs text-muted-foreground">{percentage}%</p>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    )
}

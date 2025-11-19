'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart'
import { useMemo } from 'react'
import { TbFlag2Filled } from 'react-icons/tb'
import SectionPlaceholder from '@/components/placeholders/SectionPlaceholder'

interface PriorityBreakdownProps {
    data: {
        urgent: number
        high: number
        normal: number
        low: number
        none: number
    } | null
}

const chartConfig = {
    tasks: {
        label: 'Tasks',
    },
    urgent: {
        label: 'Urgent',
        color: 'var(--destructive)',
    },
    high: {
        label: 'High',
        color: 'var(--warning)',
    },
    normal: {
        label: 'Normal',
        color: 'var(--info)',
    },
    low: {
        label: 'Low',
        color: 'var(--chart-2)',
    },
    none: {
        label: 'None',
        color: 'var(--muted-foreground)',
    },
} satisfies ChartConfig

export default function PriorityBreakdown({ data }: PriorityBreakdownProps) {
    const chartData = useMemo(() => {
        if (!data) return []
        return [
            { priority: 'Urgent', tasks: data.urgent, fill: 'var(--destructive)' },
            { priority: 'High', tasks: data.high, fill: 'var(--warning)' },
            { priority: 'Normal', tasks: data.normal, fill: 'var(--info)' },
            { priority: 'Low', tasks: data.low, fill: 'var(--chart-2)' },
            { priority: 'None', tasks: data.none, fill: 'var(--muted-foreground)' },
        ]
    }, [data])

    const totalTasks = useMemo(() => {
        return chartData.reduce((acc, curr) => acc + curr.tasks, 0)
    }, [chartData])

    if (!data || totalTasks === 0) {
        return (
            <Card className="border-border/50">
                <CardHeader>
                    <CardTitle>Priority Distribution</CardTitle>
                    <CardDescription>Task breakdown by priority level</CardDescription>
                </CardHeader>
                <CardContent>
                    <SectionPlaceholder
                        icon={TbFlag2Filled}
                        heading="No Priority Data"
                        subHeading="Priority distribution will appear here once tasks are created."
                        variant="empty"
                    />
                </CardContent>
            </Card>
        )
    }
    return (
        <Card className="border-border/50">
            <CardHeader>
                <CardTitle>Priority Distribution</CardTitle>
                <CardDescription>Task breakdown by priority level</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px] w-full">
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                        <XAxis
                            dataKey="priority"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            className="text-xs"
                        />
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            tickMargin={10}
                            className="text-xs"
                        />
                        <ChartTooltip
                            cursor={{ fill: 'var(--muted)', opacity: 0.3 }}
                            content={<ChartTooltipContent />}
                        />
                        <Bar
                            dataKey="tasks"
                            radius={[8, 8, 0, 0]}
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}

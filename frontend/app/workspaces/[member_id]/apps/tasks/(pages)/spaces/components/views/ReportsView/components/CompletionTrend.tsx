'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent,
} from '@/components/ui/chart'
import { useMemo } from 'react'
import { TbChartLine } from 'react-icons/tb'
import SectionPlaceholder from '@/components/placeholders/SectionPlaceholder'

interface CompletionTrendProps {
    data: Array<{
        date: string
        created: number
        completed: number
    }> | null
}

const chartConfig = {
    completed: {
        label: 'Completed Tasks',
        color: 'var(--success)',
    },
    created: {
        label: 'Created Tasks',
        color: 'var(--info)',
    },
} satisfies ChartConfig

export default function CompletionTrend({ data }: CompletionTrendProps) {
    const chartData = useMemo(() => {
        if (!data || data.length === 0) return []
        return data.map(item => ({
            date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            completed: item.completed,
            created: item.created,
        }))
    }, [data])

    const completionRate = useMemo(() => {
        if (!data || data.length === 0) return 0
        const lastEntry = data[data.length - 1]
        if (lastEntry.created === 0) return 0
        return Math.round((lastEntry.completed / lastEntry.created) * 100)
    }, [data])

    if (!data || data.length === 0) {
        return (
            <Card className="border-border/50">
                <CardHeader>
                    <CardTitle>Task Completion Trend</CardTitle>
                    <CardDescription>Track task creation and completion over time</CardDescription>
                </CardHeader>
                <CardContent>
                    <SectionPlaceholder
                        icon={TbChartLine}
                        heading="No Trend Data"
                        subHeading="Completion trend will appear here once tasks are created and completed."
                        variant="empty"
                    />
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="border-border/50">
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div>
                        <CardTitle>Task Completion Trend</CardTitle>
                        <CardDescription>
                            Track task creation and completion over time
                        </CardDescription>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-bold text-success">{completionRate}%</div>
                        <p className="text-xs text-muted-foreground">Completion Rate</p>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px] w-full">
                    <AreaChart
                        data={chartData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--success)" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="var(--success)" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorCreated" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--info)" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="var(--info)" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={10}
                            className="text-xs"
                        />
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            tickMargin={10}
                            className="text-xs"
                        />
                        <ChartTooltip
                            content={<ChartTooltipContent />}
                        />
                        <ChartLegend content={<ChartLegendContent />} />
                        <Area
                            type="monotone"
                            dataKey="created"
                            stroke="var(--info)"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorCreated)"
                        />
                        <Area
                            type="monotone"
                            dataKey="completed"
                            stroke="var(--success)"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorCompleted)"
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}

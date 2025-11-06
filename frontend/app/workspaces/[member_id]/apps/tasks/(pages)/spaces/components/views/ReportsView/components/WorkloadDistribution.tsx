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
import { TbUsers } from 'react-icons/tb'
import SectionPlaceholder from '@/components/placeholders/SectionPlaceholder'

interface WorkloadDistributionProps {
    data: Array<{
        memberId: string
        name: string
        avatar: string | null
        taskCount: number
    }> | null
}

const chartConfig = {
    tasks: {
        label: 'Tasks',
    },
} satisfies ChartConfig

const colors = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)', 'var(--chart-5)']

export default function WorkloadDistribution({ data }: WorkloadDistributionProps) {
    const chartData = useMemo(() => {
        if (!data) return []
        return data.map((item, index) => ({
            name: item.name,
            tasks: item.taskCount,
            fill: item.memberId === 'unassigned' ? 'var(--muted-foreground)' : colors[index % colors.length],
        }))
    }, [data])

    if (!data || data.length === 0) {
        return (
            <Card className="border-border/50">
                <CardHeader>
                    <CardTitle>Workload Distribution</CardTitle>
                    <CardDescription>Task count per team member</CardDescription>
                </CardHeader>
                <CardContent>
                    <SectionPlaceholder
                        icon={TbUsers}
                        heading="No Workload Data"
                        subHeading="Workload distribution will appear here once tasks are assigned."
                        variant="empty"
                    />
                </CardContent>
            </Card>
        )
    }
    return (
        <Card className="border-border/50">
            <CardHeader>
                <CardTitle>Workload Distribution</CardTitle>
                <CardDescription>Task count per team member</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px] w-full">
                    <BarChart
                        data={chartData}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                        <XAxis
                            type="number"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={10}
                            className="text-xs"
                        />
                        <YAxis
                            dataKey="name"
                            type="category"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            className="text-xs"
                            width={100}
                        />
                        <ChartTooltip
                            cursor={{ fill: 'var(--muted)', opacity: 0.3 }}
                            content={<ChartTooltipContent />}
                        />
                        <Bar
                            dataKey="tasks"
                            radius={[0, 8, 8, 0]}
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}

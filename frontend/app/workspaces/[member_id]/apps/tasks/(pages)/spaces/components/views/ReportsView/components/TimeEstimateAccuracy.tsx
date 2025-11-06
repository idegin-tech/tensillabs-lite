'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Legend } from 'recharts'
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent,
} from '@/components/ui/chart'
import { TbClock } from 'react-icons/tb'
import SectionPlaceholder from '@/components/placeholders/SectionPlaceholder'

interface TimeEstimateAccuracyProps {
    data: {
        accuracy: number
        totalEstimated: number
        totalActual: number
        tasksWithEstimates: number
    } | null
}

const chartConfig = {
    estimated: {
        label: 'Estimated Hours',
        color: 'var(--chart-2)',
    },
    actual: {
        label: 'Actual Hours',
        color: 'var(--chart-1)',
    },
} satisfies ChartConfig

export default function TimeEstimateAccuracy({ data }: TimeEstimateAccuracyProps) {
    if (!data || data.tasksWithEstimates === 0) {
        return (
            <Card className="border-border/50">
                <CardHeader>
                    <CardTitle>Time Estimate Accuracy</CardTitle>
                    <CardDescription>Comparison of estimated vs actual hours spent</CardDescription>
                </CardHeader>
                <CardContent>
                    <SectionPlaceholder
                        icon={TbClock}
                        heading="No Time Estimate Data"
                        subHeading="Time tracking data will appear here once tasks have time estimates."
                        variant="empty"
                    />
                </CardContent>
            </Card>
        )
    }

    const chartData = [
        {
            category: 'Total',
            estimated: data.totalEstimated,
            actual: data.totalActual,
        },
    ]

    return (
        <Card className="border-border/50">
            <CardHeader>
                <CardTitle>Time Estimate Accuracy</CardTitle>
                <CardDescription>
                    Comparison of estimated vs actual hours spent
                    <span className="ml-2 text-xs font-medium">
                        ({data.accuracy}% accuracy)
                    </span>
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px] w-full">
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                        <XAxis
                            dataKey="category"
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
                            label={{ value: 'Hours', angle: -90, position: 'insideLeft' }}
                        />
                        <ChartTooltip
                            cursor={{ fill: 'var(--muted)', opacity: 0.3 }}
                            content={<ChartTooltipContent />}
                        />
                        <ChartLegend content={<ChartLegendContent />} />
                        <Bar
                            dataKey="estimated"
                            fill="var(--chart-2)"
                            radius={[8, 8, 0, 0]}
                        />
                        <Bar
                            dataKey="actual"
                            fill="var(--chart-1)"
                            radius={[8, 8, 0, 0]}
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}

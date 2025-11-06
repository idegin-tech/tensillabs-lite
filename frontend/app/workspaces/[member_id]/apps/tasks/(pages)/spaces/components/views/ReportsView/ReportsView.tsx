'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { TbCalendar, TbRefresh } from 'react-icons/tb'
import OverviewStats from './components/OverviewStats'
import StatusDistribution from './components/StatusDistribution'
import PriorityBreakdown from './components/PriorityBreakdown'
import WorkloadDistribution from './components/WorkloadDistribution'
import TimeEstimateAccuracy from './components/TimeEstimateAccuracy'
import CompletionTrend from './components/CompletionTrend'
import ReportsLoading from './ReportsLoading'
import { useTaskReports } from '../../../../../hooks/use-tasks'

export default function ReportsView() {
    const params = useParams()
    const listId = params.list_id as string
    const [timeRange, setTimeRange] = useState<'7' | '30' | '90' | '365' | 'all'>('30')

    const { data: reportsData, isLoading, error, refetch } = useTaskReports(
        listId,
        { timeRange },
        { enabled: !!listId }
    )

    const handleRefresh = () => {
        refetch()
    }

    if (isLoading) {
        return <ReportsLoading />
    }

    const reports = reportsData?.payload

    return (
        <ScrollArea className="h-full">
            <div className="p-6 space-y-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Project Reports</h2>
                        <p className="text-muted-foreground">
                            Comprehensive insights and analytics for your project
                        </p>
                    </div>
                    
                    <div className="flex items-center gap-2 flex-wrap">
                        <Select value={timeRange} onValueChange={(value) => setTimeRange(value as typeof timeRange)}>
                            <SelectTrigger className="w-[140px]">
                                <TbCalendar className="mr-2 h-4 w-4" />
                                <SelectValue placeholder="Time range" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="7">Last 7 days</SelectItem>
                                <SelectItem value="30">Last 30 days</SelectItem>
                                <SelectItem value="90">Last 90 days</SelectItem>
                                <SelectItem value="365">Last year</SelectItem>
                                <SelectItem value="all">All time</SelectItem>
                            </SelectContent>
                        </Select>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleRefresh}
                            className="gap-2"
                        >
                            <TbRefresh className="h-4 w-4" />
                            Refresh
                        </Button>
                    </div>
                </div>

                <OverviewStats data={reports?.overview || null} />

                <CompletionTrend data={reports?.completionTrend || null} />

                <div className="grid gap-6 md:grid-cols-2">
                    <StatusDistribution data={reports?.statusDistribution || null} />
                    <PriorityBreakdown data={reports?.priorityBreakdown || null} />
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <WorkloadDistribution data={reports?.workloadDistribution || null} />
                    <TimeEstimateAccuracy data={reports?.timeEstimateAccuracy || null} />
                </div>
            </div>
        </ScrollArea>
    )
}
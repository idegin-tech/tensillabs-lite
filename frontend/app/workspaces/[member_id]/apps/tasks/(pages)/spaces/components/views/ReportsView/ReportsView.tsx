'use client'
import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
    TrendingUp, 
    TrendingDown, 
    Clock, 
    AlertCircle, 
    CheckCircle2, 
    Users,
    Calendar,
    BarChart3
} from 'lucide-react'
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts'
import ReportsLoading from './ReportsLoading'

const teamColors = [
    { bg: 'bg-blue-500/10', text: 'text-blue-600', bar: '#3B82F6' },
    { bg: 'bg-emerald-500/10', text: 'text-emerald-600', bar: '#10B981' },
    { bg: 'bg-violet-500/10', text: 'text-violet-600', bar: '#8B5CF6' },
    { bg: 'bg-amber-500/10', text: 'text-amber-600', bar: '#F59E0B' },
    { bg: 'bg-rose-500/10', text: 'text-rose-600', bar: '#F43F5E' },
]

const mockTeamPerformance = [
    { name: 'John Doe', completed: 24, overdue: 2, avgTime: '3.2 days', avatar: '', initials: 'JD', color: teamColors[0] },
    { name: 'Jane Smith', completed: 31, overdue: 1, avgTime: '2.8 days', avatar: '', initials: 'JS', color: teamColors[1] },
    { name: 'Mike Johnson', completed: 18, overdue: 4, avgTime: '4.1 days', avatar: '', initials: 'MJ', color: teamColors[2] },
    { name: 'Sarah Williams', completed: 27, overdue: 0, avgTime: '2.5 days', avatar: '', initials: 'SW', color: teamColors[3] },
    { name: 'David Brown', completed: 15, overdue: 3, avgTime: '5.2 days', avatar: '', initials: 'DB', color: teamColors[4] },
]

const mockOverdueTasks = [
    { id: 1, name: 'Update API documentation', assignee: 'John Doe', dueDate: '2025-10-28', daysOverdue: 6, priority: 'high' },
    { id: 2, name: 'Fix login bug', assignee: 'Mike Johnson', dueDate: '2025-10-30', daysOverdue: 4, priority: 'urgent' },
    { id: 3, name: 'Design new dashboard', assignee: 'Jane Smith', dueDate: '2025-11-01', daysOverdue: 2, priority: 'normal' },
    { id: 4, name: 'Code review PR #234', assignee: 'David Brown', dueDate: '2025-10-29', daysOverdue: 5, priority: 'high' },
    { id: 5, name: 'Update dependencies', assignee: 'Sarah Williams', dueDate: '2025-11-02', daysOverdue: 1, priority: 'low' },
]

const mockCycleTimeData = [
    { period: 'Week 1', avgTime: 3.2, completed: 12 },
    { period: 'Week 2', avgTime: 4.1, completed: 15 },
    { period: 'Week 3', avgTime: 2.8, completed: 18 },
    { period: 'Week 4', avgTime: 3.5, completed: 14 },
    { period: 'Week 5', avgTime: 2.9, completed: 20 },
    { period: 'Week 6', avgTime: 3.7, completed: 16 },
]

const mockCompletionTrend = [
    { month: 'Jul', created: 45, completed: 42 },
    { month: 'Aug', created: 52, completed: 48 },
    { month: 'Sep', created: 48, completed: 51 },
    { month: 'Oct', created: 55, completed: 52 },
    { month: 'Nov', created: 38, completed: 40 },
]

export default function ReportsView() {
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false)
        }, 2000)

        return () => clearTimeout(timer)
    }, [])

    if (isLoading) {
        return <ReportsLoading />
    }

    const totalCompleted = mockTeamPerformance.reduce((acc, curr) => acc + curr.completed, 0)
    const totalOverdue = mockOverdueTasks.length
    const avgCycleTime = (mockCycleTimeData.reduce((acc, curr) => acc + curr.avgTime, 0) / mockCycleTimeData.length).toFixed(1)

    return (
        <div className="p-6 space-y-6 max-w-[1400px] mx-auto">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
                <p className="text-muted-foreground">
                    Track team performance, identify bottlenecks, and optimize your workflow
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Completed</CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalCompleted}</div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                            <TrendingUp className="h-3 w-3 text-green-600" />
                            <span className="text-green-600">+12%</span> from last month
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Overdue Tasks</CardTitle>
                        <AlertCircle className="h-4 w-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalOverdue}</div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                            <TrendingDown className="h-3 w-3 text-red-600" />
                            <span className="text-red-600">+2</span> from last week
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg Cycle Time</CardTitle>
                        <Clock className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{avgCycleTime} days</div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                            <TrendingDown className="h-3 w-3 text-green-600" />
                            <span className="text-green-600">-0.3 days</span> improvement
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="team" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="team" className="gap-2">
                        <Users className="h-4 w-4" />
                        Team Performance
                    </TabsTrigger>
                    <TabsTrigger value="overdue" className="gap-2">
                        <AlertCircle className="h-4 w-4" />
                        Overdue Tasks
                    </TabsTrigger>
                    <TabsTrigger value="cycle" className="gap-2">
                        <Clock className="h-4 w-4" />
                        Cycle Time
                    </TabsTrigger>
                    <TabsTrigger value="trends" className="gap-2">
                        <BarChart3 className="h-4 w-4" />
                        Trends
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="team" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Team Member Performance</CardTitle>
                            <CardDescription>
                                Tasks completed per assignee with completion rates and average times
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {mockTeamPerformance.map((member, index) => (
                                    <div key={index} className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <Avatar className={`${member.color.bg} border-2`} style={{ borderColor: member.color.bar }}>
                                                    <AvatarImage src={member.avatar} alt={member.name} />
                                                    <AvatarFallback className={`${member.color.text} font-semibold`}>{member.initials}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="text-sm font-semibold">{member.name}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        Avg: {member.avgTime}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="text-right">
                                                    <p className={`text-sm font-semibold ${member.color.text}`}>{member.completed} completed</p>
                                                    {member.overdue > 0 && (
                                                        <p className="text-xs text-red-600">{member.overdue} overdue</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="relative h-3 bg-secondary/30 rounded-full overflow-hidden">
                                            <div 
                                                className="absolute inset-y-0 left-0 rounded-full transition-all duration-300"
                                                style={{ 
                                                    width: `${(member.completed / (member.completed + member.overdue)) * 100}%`,
                                                    backgroundColor: member.color.bar
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Completion by Team Member</CardTitle>
                            <CardDescription>Visualize task completion across the team</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={mockTeamPerformance}>
                                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                                    <XAxis 
                                        dataKey="name" 
                                        tick={{ fontSize: 12, fill: '(var(--muted-foreground)' }}
                                        stroke="var(--muted-foreground)"
                                    />
                                    <YAxis 
                                        tick={{ fontSize: 12, fill: '(var(--muted-foreground)' }}
                                        stroke="var(--muted-foreground)"
                                    />
                                    <Tooltip 
                                        contentStyle={{
                                            backgroundColor: 'var(--card)',
                                            border: '1px solid var(--border)',
                                            borderRadius: '8px',
                                            padding: '12px'
                                        }}
                                        labelStyle={{ 
                                            color: 'var(--foreground)',
                                            fontWeight: 600,
                                            marginBottom: '4px'
                                        }}
                                        itemStyle={{
                                            color: 'var(--foreground)',
                                            fontSize: '13px'
                                        }}
                                    />
                                    <Legend 
                                        wrapperStyle={{ 
                                            paddingTop: '16px',
                                            fontSize: '13px'
                                        }}
                                    />
                                    <Bar 
                                        dataKey="completed" 
                                        fill="#10B981" 
                                        name="Completed"
                                        radius={[6, 6, 0, 0]}
                                    />
                                    <Bar 
                                        dataKey="overdue" 
                                        fill="#F43F5E" 
                                        name="Overdue"
                                        radius={[6, 6, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="overdue" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Overdue Tasks</CardTitle>
                            <CardDescription>
                                Tasks that have passed their due date and are not yet completed
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {mockOverdueTasks.map((task) => (
                                    <div 
                                        key={task.id} 
                                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                                    >
                                        <div className="space-y-1 flex-1">
                                            <div className="flex items-center gap-2">
                                                <p className="font-medium">{task.name}</p>
                                                <Badge 
                                                    variant={
                                                        task.priority === 'urgent' ? 'destructive' : 
                                                        task.priority === 'high' ? 'default' : 
                                                        'secondary'
                                                    }
                                                    className="text-xs"
                                                >
                                                    {task.priority}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                    <Users className="h-3 w-3" />
                                                    {task.assignee}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    Due: {task.dueDate}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <Badge variant="destructive" className="gap-1">
                                                <AlertCircle className="h-3 w-3" />
                                                {task.daysOverdue} days overdue
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="cycle" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Task Cycle Time Analysis</CardTitle>
                            <CardDescription>
                                Average time from task creation to completion over the past 6 weeks
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={350}>
                                <LineChart data={mockCycleTimeData}>
                                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                                    <XAxis 
                                        dataKey="period" 
                                        tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
                                        stroke="var(--muted-foreground)"
                                    />
                                    <YAxis 
                                        yAxisId="left" 
                                        label={{ value: 'Days', angle: -90, position: 'insideLeft', style: { fontSize: 12, fill: 'var(--muted-foreground)' } }}
                                        tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
                                        stroke="var(--muted-foreground)"
                                    />
                                    <YAxis 
                                        yAxisId="right" 
                                        orientation="right" 
                                        label={{ value: 'Tasks', angle: 90, position: 'insideRight', style: { fontSize: 12, fill: 'var(--muted-foreground)' } }}
                                        tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
                                        stroke="var(--muted-foreground)"
                                    />
                                    <Tooltip 
                                        contentStyle={{
                                            backgroundColor: 'var(--card)',
                                            border: '1px solid var(--border)',
                                            borderRadius: '8px',
                                            padding: '12px'
                                        }}
                                        labelStyle={{ 
                                            color: 'var(--foreground)',
                                            fontWeight: 600,
                                            marginBottom: '4px'
                                        }}
                                    />
                                    <Legend 
                                        wrapperStyle={{ 
                                            paddingTop: '16px',
                                            fontSize: '13px'
                                        }}
                                    />
                                    <Line 
                                        yAxisId="left"
                                        type="monotone" 
                                        dataKey="avgTime" 
                                        stroke="#8B5CF6" 
                                        strokeWidth={3}
                                        dot={{ fill: '#8B5CF6', r: 4 }}
                                        activeDot={{ r: 6 }}
                                        name="Avg Cycle Time (days)"
                                    />
                                    <Line 
                                        yAxisId="right"
                                        type="monotone" 
                                        dataKey="completed" 
                                        stroke="#10B981" 
                                        strokeWidth={3}
                                        dot={{ fill: '#10B981', r: 4 }}
                                        activeDot={{ r: 6 }}
                                        name="Tasks Completed"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="border-emerald-200 dark:border-emerald-900 bg-gradient-to-br from-emerald-50 to-transparent dark:from-emerald-950/20">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Fastest Completion</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-500">2.5 days</div>
                                <p className="text-xs text-muted-foreground mt-1">Week 5 - Best performance</p>
                            </CardContent>
                        </Card>
                        <Card className="border-rose-200 dark:border-rose-900 bg-gradient-to-br from-rose-50 to-transparent dark:from-rose-950/20">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Slowest Completion</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-rose-600 dark:text-rose-500">5.2 days</div>
                                <p className="text-xs text-muted-foreground mt-1">Last week - Needs attention</p>
                            </CardContent>
                        </Card>
                        <Card className="border-violet-200 dark:border-violet-900 bg-gradient-to-br from-violet-50 to-transparent dark:from-violet-950/20">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Median Time</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-violet-600 dark:text-violet-500">3.4 days</div>
                                <p className="text-xs text-muted-foreground mt-1">Overall median baseline</p>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="trends" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Created vs Completed Tasks</CardTitle>
                            <CardDescription>
                                Track task creation and completion trends to identify growing backlogs
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={350}>
                                <BarChart data={mockCompletionTrend}>
                                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                                    <XAxis 
                                        dataKey="month" 
                                        tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
                                        stroke="var(--muted-foreground)"
                                    />
                                    <YAxis 
                                        tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
                                        stroke="var(--muted-foreground)"
                                    />
                                    <Tooltip 
                                        contentStyle={{
                                            backgroundColor: 'var(--card)',
                                            border: '1px solid var(--border)',
                                            borderRadius: '8px',
                                            padding: '12px'
                                        }}
                                        labelStyle={{ 
                                            color: 'var(--foreground)',
                                            fontWeight: 600,
                                            marginBottom: '4px'
                                        }}
                                    />
                                    <Legend 
                                        wrapperStyle={{ 
                                            paddingTop: '16px',
                                            fontSize: '13px'
                                        }}
                                    />
                                    <Bar 
                                        dataKey="created" 
                                        fill="#3B82F6" 
                                        name="Created"
                                        radius={[6, 6, 0, 0]}
                                    />
                                    <Bar 
                                        dataKey="completed" 
                                        fill="#10B981" 
                                        name="Completed"
                                        radius={[6, 6, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

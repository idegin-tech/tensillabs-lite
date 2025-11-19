'use client'

import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ScrollArea } from '@/components/ui/scroll-area'

export default function ReportsLoading() {
    return (
        <ScrollArea className="h-full">
            <div className="p-6 space-y-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <Skeleton className="h-8 w-48 mb-2" />
                        <Skeleton className="h-4 w-96" />
                    </div>
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-9 w-[140px]" />
                        <Skeleton className="h-9 w-[130px]" />
                        <Skeleton className="h-9 w-[100px]" />
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {[1, 2, 3, 4].map((i) => (
                        <Card key={i} className="border-border/50">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-8 w-8 rounded-lg" />
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-8 w-16 mb-2" />
                                <Skeleton className="h-3 w-32" />
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <Card className="border-border/50">
                    <CardHeader className="flex flex-row items-start justify-between space-y-0">
                        <div className="space-y-2">
                            <Skeleton className="h-6 w-48" />
                            <Skeleton className="h-4 w-64" />
                        </div>
                        <div className="space-y-1">
                            <Skeleton className="h-8 w-16" />
                            <Skeleton className="h-3 w-24" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-[300px] w-full rounded-lg" />
                    </CardContent>
                </Card>

                <div className="grid gap-6 md:grid-cols-2">
                    {[1, 2].map((i) => (
                        <Card key={i} className="border-border/50">
                            <CardHeader>
                                <Skeleton className="h-6 w-48 mb-2" />
                                <Skeleton className="h-4 w-64" />
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex justify-center">
                                    <Skeleton className="h-[350px] w-[350px] rounded-full" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    {[1, 2, 3, 4].map((j) => (
                                        <Skeleton key={j} className="h-20 w-full rounded-lg" />
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {[1, 2].map((i) => (
                        <Card key={i} className="border-border/50">
                            <CardHeader>
                                <Skeleton className="h-6 w-48 mb-2" />
                                <Skeleton className="h-4 w-64" />
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-[300px] w-full rounded-lg" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </ScrollArea>
    )
}

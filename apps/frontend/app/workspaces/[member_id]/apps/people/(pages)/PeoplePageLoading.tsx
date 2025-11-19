'use client'

import AppBody from '@/components/layout/app-layout/AppBody'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function PeoplePageLoading() {
    return (
        <AppBody>
            <div className="space-y-8 container mx-auto py-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-2">
                        <Skeleton className="h-9 w-80" />
                        <Skeleton className="h-5 w-64" />
                    </div>
                    <Skeleton className="h-10 w-24 rounded-lg" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <div className="lg:col-span-2">
                        <Card className="border-0 shadow-md h-full">
                            <CardHeader className="pb-6">
                                <div className="flex items-center gap-3">
                                    <Skeleton className="h-9 w-9 rounded-lg" />
                                    <Skeleton className="h-6 w-32" />
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-8">
                                <div className="text-center px-8 py-4 bg-muted/30 rounded-lg border space-y-6">
                                    <Skeleton className="h-6 w-32 mx-auto rounded-full" />
                                    <Skeleton className="h-16 w-64 mx-auto" />
                                    <Skeleton className="h-4 w-40 mx-auto" />
                                    <div className="max-w-sm mx-auto space-y-2">
                                        <div className="flex justify-between">
                                            <Skeleton className="h-3 w-16" />
                                            <Skeleton className="h-3 w-16" />
                                        </div>
                                        <Skeleton className="h-2 w-full" />
                                    </div>
                                </div>
                                <div className="flex justify-center">
                                    <Skeleton className="h-12 w-40 rounded-lg" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:col-span-2 space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[1, 2].map((i) => (
                                <Card key={i} className="border-0 shadow-md">
                                    <CardContent className="p-6 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <Skeleton className="h-9 w-9 rounded-lg" />
                                            <Skeleton className="h-5 w-20 rounded-full" />
                                        </div>
                                        <div className="space-y-2">
                                            <Skeleton className="h-8 w-16" />
                                            <Skeleton className="h-4 w-24" />
                                            <Skeleton className="h-3 w-32" />
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        <Card className="border-0 shadow-md">
                            <CardHeader className="pb-4">
                                <Skeleton className="h-6 w-40" />
                            </CardHeader>
                            <CardContent className="grid grid-cols-2 gap-3">
                                <Skeleton className="h-24 w-full rounded-lg" />
                                <Skeleton className="h-24 w-full rounded-lg" />
                                <Skeleton className="h-24 w-full rounded-lg col-span-2" />
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-1 2xl:grid-cols-2 gap-8">
                    {[1, 2].map((section) => (
                        <Card key={section} className="border-0 shadow-md">
                            <CardHeader className="pb-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Skeleton className="h-5 w-5 rounded" />
                                        <Skeleton className="h-6 w-40" />
                                    </div>
                                    <Skeleton className="h-9 w-24 rounded-md" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {[1, 2, 3, 4, 5].map((row) => (
                                        <div key={row} className="flex items-center gap-4 p-3 rounded-lg border">
                                            <Skeleton className="h-4 w-24" />
                                            <Skeleton className="h-4 w-20" />
                                            <Skeleton className="h-4 w-20" />
                                            <Skeleton className="h-4 w-16 ml-auto" />
                                            <Skeleton className="h-6 w-16 rounded-full" />
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </AppBody>
    )
}

'use client'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function ListFilesLoading() {
    return (
        <div className="p-4 space-y-4">
            <div className="flex items-center justify-between gap-4 mb-6">
                <Skeleton className="h-10 w-full max-w-md" />
                <div className="flex gap-2">
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-10 w-32" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 9 }).map((_, index) => (
                    <Card key={index} className="p-3">
                        <div className="flex items-center gap-3">
                            <Skeleton className="w-12 h-12 flex-shrink-0 rounded" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-3 w-1/2" />
                            </div>
                            <div className="flex gap-1">
                                <Skeleton className="h-8 w-8 rounded" />
                                <Skeleton className="h-8 w-8 rounded" />
                                <Skeleton className="h-8 w-8 rounded" />
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="flex justify-center gap-2 mt-6">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-10" />
                <Skeleton className="h-10 w-10" />
                <Skeleton className="h-10 w-10" />
                <Skeleton className="h-10 w-24" />
            </div>
        </div>
    )
}

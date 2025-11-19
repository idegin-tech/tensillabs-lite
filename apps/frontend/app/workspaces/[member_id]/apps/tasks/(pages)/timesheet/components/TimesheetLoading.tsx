'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function TimesheetLoading() {
    return (
        <Card>
            <CardHeader className='pb-4'>
                <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
                    <div className='space-y-2'>
                        <Skeleton className='h-6 w-32' />
                        <Skeleton className='h-4 w-48' />
                    </div>

                    <div className='flex flex-col sm:flex-row gap-3'>
                        <Skeleton className='h-10 w-full sm:w-[250px]' />
                        <Skeleton className='h-10 w-full sm:w-[180px]' />
                    </div>
                </div>
            </CardHeader>

            <CardContent>
                <div className='rounded-lg border overflow-hidden'>
                    <div className='bg-muted/50 p-4 border-b'>
                        <div className='flex gap-4'>
                            <Skeleton className='h-4 w-[40%]' />
                            <Skeleton className='h-4 w-[15%]' />
                            <Skeleton className='h-4 w-[15%]' />
                            <Skeleton className='h-4 w-[15%]' />
                            <Skeleton className='h-4 w-[15%] ml-auto' />
                        </div>
                    </div>

                    <div className='divide-y'>
                        {[...Array(6)].map((_, index) => (
                            <div key={index} className='p-4'>
                                <div className='flex items-center gap-4'>
                                    <div className='flex-1 space-y-2'>
                                        <Skeleton className='h-4 w-3/4' />
                                        <Skeleton className='h-3 w-24' />
                                    </div>

                                    <div className='w-[15%]'>
                                        <Skeleton className='h-6 w-20' />
                                    </div>

                                    <div className='w-[15%] space-y-1'>
                                        <Skeleton className='h-3 w-16' />
                                        <Skeleton className='h-3 w-16' />
                                    </div>

                                    <div className='w-[15%]'>
                                        <Skeleton className='h-4 w-12' />
                                    </div>

                                    <div className='w-[15%] flex justify-end gap-1'>
                                        <Skeleton className='h-8 w-8 rounded' />
                                        <Skeleton className='h-8 w-8 rounded' />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

'use client'
import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'

export default function TaskDetailsPanelLoading() {
    return (
        <div className='bg-popover/95 backdrop-blur-sm select-none shadow-2xl md:w-[700px] w-screen border-l z-50 fixed right-0 bottom-0 md:h-app-body h-screen grid grid-cols-1 md:mb-[8px] transition-all duration-300 ease-in-out'>
            <div className="flex flex-col h-full">
                <header className='border-b h-app-header-sm bg-background/50 backdrop-blur-sm flex items-center justify-between px-4'>
                    <div className="flex items-center gap-3">
                        <Skeleton className="w-2 h-2 rounded-full" />
                        <Skeleton className="h-5 w-32" />
                    </div>
                    <div className="flex items-center gap-2">
                        <Skeleton className="w-1 h-1 rounded-full" />
                        <Skeleton className="w-1 h-1 rounded-full" />
                        <Skeleton className="w-1 h-1 rounded-full" />
                    </div>
                </header>
                
                <div className='grid grid-cols-12 flex-1 overflow-hidden'>
                    <div className='col-span-10 md:col-span-11 overflow-hidden'>
                        <div className="p-4 space-y-6 h-full overflow-y-auto">
                            <div className='space-y-6'>
                                <div className='p-2 rounded-lg'>
                                    <Skeleton className='h-8 w-3/4 mb-2' />
                                    <Skeleton className='h-8 w-1/2' />
                                </div>

                                <div className='grid grid-cols-1 gap-y-6 gap-x-4'>
                                    {Array.from({ length: 4 }).map((_, index) => (
                                        <div key={index} className='grid grid-cols-4 items-center gap-x-8 gap-y-10'>
                                            <div className='flex gap-2 items-center'>
                                                <Skeleton className="h-4 w-16" />
                                            </div>
                                            <div className='col-span-3'>
                                                <Skeleton className="h-8 w-full" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className='px-4'>
                                <div className='flex items-center justify-between mb-4'>
                                    <Skeleton className="h-4 w-20" />
                                    <Skeleton className="h-8 w-32" />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="w-full">
                                    <div className="grid w-full grid-cols-2 h-10 bg-muted rounded-lg p-1">
                                        <Skeleton className="h-8 rounded-md" />
                                        <Skeleton className="h-8 rounded-md" />
                                    </div>
                                    <div className="mt-4 space-y-3">
                                        {Array.from({ length: 3 }).map((_, index) => (
                                            <div key={index} className="flex items-center space-x-2 p-3 rounded-lg border bg-background">
                                                <Skeleton className="h-4 w-4 rounded-full" />
                                                <Skeleton className="h-4 flex-1" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className='border-l col-span-2 md:col-span-1 h-full flex flex-col bg-muted/20'>
                        {Array.from({ length: 3 }).map((_, index) => (
                            <div key={index} className='p-3 flex flex-col items-center min-h-16 justify-center gap-1.5'>
                                <Skeleton className="h-4 w-4" />
                                <Skeleton className="h-3 w-8" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

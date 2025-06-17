'use client'
import AppBody from '@/components/layout/app-layout/AppBody'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TbChartPie, TbLayoutList, TbMenu3 } from 'react-icons/tb'

export default function ListDetailsPageLoading() {
  const contentClassName = 'p-0 min-h-[calc(100dvh-6.5rem)] overflow-y-auto'
  
  return (
    <AppBody withoutPadding>
      <div className='flex flex-col h-full'>
        <Tabs defaultValue="list" className='h-[calc(100dvh-var(--app-body)-4rem)]'>
          <TabsList className='h-10 min-h-10 border-b md:px-4 flex justify-start w-full max-w-screen overflow-x-auto'>
            <TabsTrigger value="list" className='max-w-[150px]'>
              <TbLayoutList /> List
            </TabsTrigger>
            <TabsTrigger value="timeline" className='max-w-[150px]'>
              <TbMenu3 /> Timeline
            </TabsTrigger>
            <TabsTrigger value="report" className='max-w-[150px]'>
              <TbChartPie /> Report
            </TabsTrigger>
          </TabsList>
          <TabsContent
            value="list"
            className={contentClassName}
          >
            <div className='h-12 border-b flex items-center gap-2 px-4'>
              <div className='flex items-center gap-2'>
                <Skeleton className="h-8 w-40" />
                <Skeleton className="h-8 w-32" />
              </div>
            </div>
            <div className='grid grid-cols-1 gap-6 pb-60 h-[calc(100dvh-9.5rem)] overflow-y-auto relative'>
              <div className="space-y-3 px-3 pt-6">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-96" />
              </div>
              <div className='grid grid-cols-1 gap-1'>
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="space-y-4">
                    <div className='px-3 sticky top-0 z-50 bg-background h-16 flex items-center'>
                      <div className='border border-border flex justify-between items-center gap-2 p-4 bg-card rounded-lg w-full shadow-sm'>
                        <div className='flex items-center gap-3'>
                          <Skeleton className="h-8 w-8 rounded-lg" />
                          <div className="space-y-1">
                            <Skeleton className="h-5 w-20" />
                          </div>
                        </div>
                        <div className='flex items-center gap-2'>
                          <Skeleton className="h-6 w-8 rounded-full" />
                          <Skeleton className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                    <div className='px-3 space-y-2'>
                      <div className="rounded-lg border bg-background overflow-hidden">
                        <div className="h-10 bg-muted border-b flex items-center px-4 gap-4">
                          <Skeleton className="h-4 w-4" />
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-4 w-16" />
                          <Skeleton className="h-4 w-20" />
                          <Skeleton className="h-4 w-28" />
                          <Skeleton className="h-4 w-16" />
                        </div>
                        {Array.from({ length: 3 }).map((_, rowIndex) => (
                          <div key={rowIndex} className="h-12 border-b border-border/50 flex items-center px-4 gap-4">
                            <Skeleton className="h-4 w-4" />
                            <Skeleton className="h-4 w-40" />
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-4 w-28" />
                            <Skeleton className="h-4 w-16" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          <TabsContent
            value="timeline"
            className={contentClassName}
          >
            <div className="flex items-center justify-center h-full">
              <div className="space-y-4 text-center">
                <Skeleton className="h-12 w-12 rounded-full mx-auto" />
                <Skeleton className="h-6 w-48 mx-auto" />
                <Skeleton className="h-4 w-64 mx-auto" />
              </div>
            </div>
          </TabsContent>
          <TabsContent
            value="report"
            className={contentClassName}
          >
            <div className="flex items-center justify-center h-full">
              <div className="space-y-4 text-center">
                <Skeleton className="h-12 w-12 rounded-full mx-auto" />
                <Skeleton className="h-6 w-48 mx-auto" />
                <Skeleton className="h-4 w-64 mx-auto" />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppBody>
  )
}

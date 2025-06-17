'use client'
import AppBody from '@/components/layout/app-layout/AppBody'
import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TbChartPie, TbLayoutList, TbMenu3 } from 'react-icons/tb'
import TasksListView from '../../../components/views/TaskListView/TasksListView'
import { TaskListProvider, useTaskList } from '../../../../../contexts/task-list.context'
import ListDetailsPageLoading from './ListDetailsPageLoading'

function ListDetailsContent() {
  const { state } = useTaskList()
  
  if (state.isLoading) {
    return <ListDetailsPageLoading />
  }

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
            <TasksListView/>
          </TabsContent>
          <TabsContent
            value="timeline"
            className={contentClassName}
          >
            Let them know who is part of this space, and what their roles are. Add or remove participants as needed.
          </TabsContent>
          <TabsContent
            value="report"
            className={contentClassName}
          >
            Here you can generate reports based on the tasks and activities within this space. Analyze performance, track progress, and gain insights.
          </TabsContent>
        </Tabs>
      </div>
    </AppBody>
  )
}

export default function ListDetailsPage() {
  return (
    <TaskListProvider>
      <ListDetailsContent />
    </TaskListProvider>
  )
}

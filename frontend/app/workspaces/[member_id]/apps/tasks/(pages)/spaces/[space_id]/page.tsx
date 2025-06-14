"use client"
import AppBody from '@/components/layout/app-layout/AppBody'
import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TbLayoutDashboard, TbSettings, TbTagFilled, TbTrash, TbUsers } from 'react-icons/tb'
import { Skeleton } from '@/components/ui/skeleton'
import SpaceParticipants from '../components/tabs/SpaceParticipants';
import SpaceTrash from '../components/tabs/SpaceTrash';
import SpaceSettings from '../components/tabs/SpaceSettings';
import SpaceOverviewTab from './tabs/SpaceOverviewTab';
import { TasksSpaceProvider, useTasksSpace } from '../../../contexts/tasks-space.context';
import CreateListPopup from '../../../components/CreateListPopup';

function SpaceHeader() {
    const { state } = useTasksSpace()
    const { space, isLoading } = state

    if (isLoading) {
        return (
            <div className='h-16 min-h-16 border-b flex items-center md:px-4 px-3'>
                <div className='flex items-center gap-4'>
                    <Skeleton className='h-10 w-10 rounded-lg' />
                    <div className='flex flex-col gap-2'>
                        <Skeleton className='h-5 w-48' />
                        <Skeleton className='h-3 w-64' />
                    </div>
                </div>
            </div>
        )
    }

    if (!space) {
        return (
            <div className='h-16 min-h-16 border-b flex items-center md:px-4 px-3'>
                <div className='flex items-center gap-4'>
                    <div className='h-10 w-10 min-w-10 bg-secondary text-secondary-foreground rounded-lg flex items-center justify-center text-xl'>
                        <TbTagFilled />
                    </div>
                    <div className='flex flex-col'>
                        <h1 className='md:text-lg font-bold text-muted-foreground'>Space not found</h1>
                        <small className='text-muted-foreground'>
                            This space doesn't exist or you don't have access to it.
                        </small>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className='h-16 min-h-16 border-b flex items-center md:px-4 px-3'>
            <div className='flex items-center gap-4'>
                <div 
                    className='h-10 w-10 min-w-10 rounded-lg flex items-center justify-center text-xl text-white'
                    style={{ backgroundColor: space.space.color }}
                >
                    <i className={`fas ${space.space.icon}`}></i>
                </div>
                <div className='flex flex-col'>
                    <h1 className='md:text-lg font-bold text-foreground'>{space.space.name}</h1>
                    <small className='text-muted-foreground truncate max-w-[300px]'>
                        {space.space.description || 'No description provided'}
                    </small>
                </div>
            </div>
        </div>
    )
}

export default function SpaceDetailsPage() {
    const contentClassName = 'p-0 min-h-[calc(100dvh-6.5rem-4rem)] overflow-y-auto';    return (
        <TasksSpaceProvider>
            <CreateListPopup />
            <AppBody withoutPadding>
                <div className='flex flex-col h-full'>
                    <SpaceHeader />
                    <Tabs defaultValue="overview" className='h-[calc(100dvh-var(--app-body)-4rem)]'>
                        <TabsList className='h-10 min-h-10 border-b md:px-4 flex justify-start w-full max-w-screen overflow-x-auto'>
                            <TabsTrigger value="overview" className='max-w-[150px]'>
                                <TbLayoutDashboard /> Overview
                            </TabsTrigger>
                            <TabsTrigger value="participants" className='max-w-[150px]'>
                                <TbUsers /> Participants
                            </TabsTrigger>
                            <TabsTrigger value="trash" className='max-w-[150px]'>
                                <TbTrash /> Trash
                            </TabsTrigger>
                            <TabsTrigger value="settings" className='max-w-[150px]'>
                                <TbSettings /> Settings
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent
                            value="overview"
                            className={contentClassName}
                        >
                            <SpaceOverviewTab />
                        </TabsContent>
                        <TabsContent
                            value="participants"
                            className={contentClassName}
                        >
                            <SpaceParticipants />
                        </TabsContent>
                        <TabsContent
                            value="trash"
                            className={contentClassName}
                        >
                            <SpaceTrash />
                        </TabsContent>
                        <TabsContent
                            value="settings"
                            className={contentClassName}
                        >
                            <SpaceSettings />
                        </TabsContent>
                    </Tabs>
                </div>
            </AppBody>
        </TasksSpaceProvider>
    )
}

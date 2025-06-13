import AppBody from '@/components/layout/app-layout/AppBody'
import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TbLayoutDashboard, TbSettings, TbTagFilled, TbTrash, TbUsers } from 'react-icons/tb'
import SpaceParticipants from '../components/tabs/SpaceParticipants';
import SpaceTrash from '../components/tabs/SpaceTrash';
import SpaceSettings from '../components/tabs/SpaceSettings';
import SpaceOverviewTab from './tabs/SpaceOverviewTab';


export default function page() {
    const contentClassName = 'p-0 min-h-[calc(100dvh-6.5rem-4rem)] overflow-y-auto';
    return (
        <AppBody withoutPadding>
            <div className='flex flex-col h-full'>
                <div className='h-16 min-h-16 border-b flex items-center md:px-4 px-3'>
                    <div className='flex items-center gap-4'>
                        <div className='h-10 w-10 min-w-10 bg-secondary text-secondary-foreground rounded-lg flex items-center justify-center text-xl'>
                            <TbTagFilled />
                        </div>
                        <div className='flex flex-col'>
                            <h1 className='md:text-lg font-bold text-muted-foreground'>The name of the space</h1>
                            <small className='text-muted-foreground truncate max-w-[300px]'>
                                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Distinctio, commodi illum perferendis quidem earum illo magnam ipsam ullam ipsa laboriosam alias quas minima consequuntur ut iste et? Consequatur, inventore minus.
                            </small>
                        </div>
                    </div>
                </div>
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
    )
}

'use client'
import React from 'react'
import TaskDetailsTabs from './TaskDetailsTabs'
import TaskDetails from './TaskDetails/TaskDetails'
import TaskChat from './TaskChat/TaskChat'
import TaskActivities from './TaskActivities/TaskActivities'
import TaskDetailsPanelLoading from './TaskDetailsPanelLoading'
import { ScrollArea } from '@radix-ui/react-scroll-area'
import { Button } from '@/components/ui/button'
import { TbX, TbRefresh, TbAlertCircle } from 'react-icons/tb'
import { useGetTaskDetails } from '../../hooks/use-tasks'
import { useParams } from 'next/navigation'
import SectionPlaceholder from '@/components/placeholders/SectionPlaceholder'

interface TaskDetailsPanelProps {
    taskID: string
    onClose: () => void
}

export default function TaskDetailsPanel({ taskID, onClose }: TaskDetailsPanelProps) {
    const [activeTab, setActiveTab] = React.useState<'details' | 'chat' | 'activities'>('details')
    const params = useParams()
    const listId = params.list_id as string
    
    const { data: taskDetailsData, isLoading, error, refetch } = useGetTaskDetails(listId, taskID)

    const renderTabContent = () => {
        if (!taskDetailsData?.payload) {
            return <TaskDetails />
        }

        const { task, checklist } = taskDetailsData.payload

        switch (activeTab) {
            case 'details':
                return <TaskDetails task={task} checklist={checklist} />
            case 'chat':
                return <TaskChat />
            case 'activities':
                return <TaskActivities />
            default:
                return <TaskDetails task={task} checklist={checklist} />
        }
    }

    if (isLoading) {
        return <TaskDetailsPanelLoading />
    }    if (error) {
        return (
            <div className='bg-popover/95 backdrop-blur-sm select-none shadow-2xl md:w-[700px] w-screen border-l z-50 fixed right-0 bottom-0 md:h-app-body h-screen grid grid-cols-1 md:mb-[8px]'>
                <div className="flex flex-col h-full">
                    <header className='border-b h-app-header-sm bg-background/50 backdrop-blur-sm flex items-center justify-between px-4'>
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-red-500"></div> 
                            <h2 className="font-semibold text-lg">Task Details</h2>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onClose}
                            className="h-8 w-8 p-0"
                        >
                            <TbX className="h-4 w-4" />
                        </Button>
                    </header>
                    <div className="flex-1 flex items-center justify-center p-4">
                        <SectionPlaceholder
                            icon={TbAlertCircle}
                            heading="Failed to load task details"
                            subHeading="Something went wrong while loading the task details. Please try again."
                            variant="error"
                            ctaButton={{
                                label: "Try Again",
                                onClick: () => refetch(),
                                variant: "default",
                                icon: TbRefresh
                            }}
                        />
                    </div>
                </div>
            </div>
        )
    }


    return (
        <div className='bg-popover/95 backdrop-blur-sm select-none shadow-2xl md:w-[700px] w-screen border-l z-50 fixed right-0 bottom-0 md:h-app-body h-screen grid grid-cols-1 md:mb-[8px] transition-all duration-300 ease-in-out'>
            <div className="flex flex-col h-full">                
                <header className='border-b h-app-header-sm bg-background/50 backdrop-blur-sm flex items-center justify-between px-4'>
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        <h2 className="font-semibold text-lg">Task Details</h2>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        className="h-8 w-8 p-0"
                    >
                        <TbX className="h-4 w-4" />
                    </Button>
                </header>
                <div className='grid grid-cols-12 flex-1 overflow-hidden'>
                    <ScrollArea className='col-span-10 md:col-span-11 overflow-y-auto overflow-x-hidden h-[calc(100vh-10vh)]'>
                        <div className='grid grid-cols-1'>
                            {renderTabContent()}
                            <div className='h-20' />
                        </div>
                    </ScrollArea>
                    <TaskDetailsTabs
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                    />
                </div>
            </div>
        </div>
    )
}


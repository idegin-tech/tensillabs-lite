'use client'
import React from 'react'
import TaskDetailsTabs from './TaskDetailsTabs'
import TaskDetails from './TaskDetails/TaskDetails'
import TaskChat from './TaskChat/TaskChat'
import TaskActivities from './TaskActivities/TaskActivities'
import TaskDetailsPanelLoading from './TaskDetailsPanelLoading'
import { ScrollArea } from '@radix-ui/react-scroll-area'
import { Button } from '@/components/ui/button'
import { TbX } from 'react-icons/tb'

interface TaskDetailsPanelProps {
    taskID: string
    onClose: () => void
}

export default function TaskDetailsPanel({ taskID, onClose }: TaskDetailsPanelProps) {
    const [activeTab, setActiveTab] = React.useState<'details' | 'chat' | 'activities'>('details')
    const [isLoading, setIsLoading] = React.useState(true)

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false)
        }, 3000)

        return () => clearTimeout(timer)
    }, [])

    const renderTabContent = () => {
        switch (activeTab) {
            case 'details':
                return <TaskDetails />
            case 'chat':
                return <TaskChat />
            case 'activities':
                return <TaskActivities />
            default:
                return <TaskDetails />
        }
    }

    if (isLoading) {
        return <TaskDetailsPanelLoading />
    }


    return (
        <div className='bg-popover/95 backdrop-blur-sm select-none shadow-2xl md:w-[700px] w-screen border-l z-50 fixed right-0 bottom-0 md:h-app-body h-screen grid grid-cols-1 md:mb-[8px] transition-all duration-300 ease-in-out'>
            <div className="flex flex-col h-full">                <header className='border-b h-app-header-sm bg-background/50 backdrop-blur-sm flex items-center justify-between px-4'>
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
                    <ScrollArea className='col-span-10 md:col-span-11 overflow-y-auto overflow-x-hidden md:h-[90dvh] h-[95dvh]'>
                        <div className='grid grid-cols-1'>
                            {renderTabContent()}
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


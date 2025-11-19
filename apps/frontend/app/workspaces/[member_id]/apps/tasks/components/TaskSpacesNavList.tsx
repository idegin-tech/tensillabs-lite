import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar'
import React from 'react';
import {
    TbTarget,
    TbBulb,
    TbPalette,
    TbCalendar,
    TbCode,
    TbPlus,
} from "react-icons/tb"
import EachTasksSpace from './EachTasksSpace';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Skeleton } from '@/components/ui/skeleton'
import { useTasksApp } from '../contexts/tasks-app.context';

function SpaceSkeleton() {
    return (
        <SidebarMenuItem>
            <SidebarMenuButton className="flex items-center w-full">
                <Skeleton className="h-6 w-6 rounded-sm mr-1" />
                <Skeleton className="h-4 flex-1" />
            </SidebarMenuButton>
        </SidebarMenuItem>
    )
}

export default function TaskSpacesNavList() {
    const { state, updateState } = useTasksApp();
    const { spaces, isLoading } = state;

    return (
        <>
            <SidebarGroup>
                <SidebarGroupLabel className='flex items-center justify-between'>
                    <span>Spaces</span>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button className='text-muted-foreground hover:text-foreground transition-colors cursor-pointer' onClick={() => updateState({ showCreateSpace: true })}>
                                <TbPlus className="h-4 w-4" />
                                <span className="sr-only">Add space</span>
                            </button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Add new space</p>
                        </TooltipContent>
                    </Tooltip>
                </SidebarGroupLabel>
                <SidebarMenu>
                    {isLoading ? (
                        Array.from({ length: 3 }).map((_, i) => (
                            <SpaceSkeleton key={i} />
                        ))
                    ) : (
                        spaces.map((space) => (
                            <EachTasksSpace
                                key={space._id}
                                _id={space._id}
                                color={space.color}
                                Icon={space.icon}
                                name={space.name}
                            />
                        ))
                    )}
                </SidebarMenu>
            </SidebarGroup>
        </>
    )
}
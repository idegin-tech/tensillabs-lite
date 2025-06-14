import { SidebarGroup, SidebarGroupLabel, SidebarMenu } from '@/components/ui/sidebar'
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
import { useTasksApp } from '../contexts/tasks-app.context';

export default function TaskSpacesNavList() {
    const { state, updateState } = useTasksApp();
    const { spaces } = state;

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
                    {spaces.map((space) => (
                        <EachTasksSpace
                            key={space._id}
                            _id={space._id}
                            color={space.color}
                            Icon={space.icon}
                            name={space.name}
                        />
                    ))}
                </SidebarMenu>
            </SidebarGroup>
        </>
    )
}
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

export default function TaskSpacesNavList() {
    const mockSpaces = [
        {
            _id: 'marketing-campaign',
            name: 'Marketing Campaign',
            color: '#3b82f6',
            Icon: <TbTarget className="h-3 w-3" />
        },
        {
            _id: 'product-development',
            name: 'Product Development',
            color: '#10b981',
            Icon: <TbBulb className="h-3 w-3" />
        },
        {
            _id: 'design-system',
            name: 'Design System',
            color: '#8b5cf6',
            Icon: <TbPalette className="h-3 w-3" />
        },
        {
            _id: 'event-planning',
            name: 'Event Planning',
            color: '#f59e0b',
            Icon: <TbCalendar className="h-3 w-3" />
        },
        {
            _id: 'engineering',
            name: 'Engineering',
            color: '#ef4444',
            Icon: <TbCode className="h-3 w-3" />
        }
    ]
    return (
        <>
            <SidebarGroup>
                <SidebarGroupLabel className='flex items-center justify-between'>
                    <span>Spaces</span>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button className='text-muted-foreground hover:text-foreground transition-colors cursor-pointer'>
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
                    {mockSpaces.map((space, index) => (
                        <EachTasksSpace
                            key={space._id}
                            _id={space._id}
                            color={space.color}
                            Icon={space.Icon}
                            name={space.name}
                        />
                    ))}
                </SidebarMenu>
            </SidebarGroup>
        </>
    )
}

import { SidebarMenuAction, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'
import useCommon from '@/hooks/use-common'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import React from 'react'
import { TbChevronDown, TbChevronUp, TbList, TbPlus } from 'react-icons/tb'
import { usePathname } from 'next/navigation'

type Props = {
    _id: string;
    isActive?: boolean;
    name: string;
    color: string;
    Icon: React.ReactNode;
}

export default function EachSpace({ isActive, color, Icon, name, _id }: Props) {
    const [isHovered, setIsHovered] = React.useState(false);
    const [showList, setShowList] = React.useState(false);
    const { getPathToApp } = useCommon();
    const pathname = usePathname();

    const spaceUrl = `${getPathToApp('tasks')}/spaces/${_id}`;
    const isSpaceActive = pathname === spaceUrl || pathname.startsWith(`${spaceUrl}/`);

    return (
        <div className={cn('grid grid-cols-1 gap-1', { "mb-4": showList })}>
            <SidebarMenuItem
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <SidebarMenuButton asChild isActive={isSpaceActive}>
                    <div className='flex items-center w-full'>
                        <div
                            onClick={(e) => {
                                e.preventDefault();
                                setShowList(!showList);
                            }}
                            className={cn("h-5 w-5 rounded-sm flex items-center justify-center cursor-pointer transition-colors mr-1", {
                                "bg-accent text-accent-foreground": isHovered,
                                "text-white": !isHovered
                            })}
                            style={{ backgroundColor: !isHovered ? color : undefined }}
                        >
                            {!isHovered ? Icon : (showList ? <TbChevronDown className="h-3 w-3" /> : <TbChevronUp className="h-3 w-3" />)}
                        </div>
                        <Link href={spaceUrl} className='flex-1 min-w-0'>
                            <span className="truncate">{name}</span>
                        </Link>
                    </div>
                </SidebarMenuButton>
                <SidebarMenuAction className='cursor-pointer' showOnHover>
                    <TbPlus className="h-4 w-4" />
                    <span className="sr-only">Add list</span>
                </SidebarMenuAction>
            </SidebarMenuItem>
            <div className={cn('pl-2 border-l border-border ml-2 overflow-hidden transition-all duration-300 ease-in-out space-y-1', {
                'max-h-0': !showList,
                'max-h-[500px]': showList
            })}>
                {new Array(6).fill(null).map((_, i) => {
                    const listUrl = `${getPathToApp('tasks')}/spaces/${_id}/lists/${i + 1}`;
                    const isListActive = pathname === listUrl;
                    
                    return (
                        <SidebarMenuItem key={i}>
                            <SidebarMenuButton asChild isActive={isListActive} size="sm">
                                <Link href={listUrl}>
                                    <TbList className="h-4 w-4" />
                                    <span>List {i + 1}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
            </div>
        </div>
    )
}
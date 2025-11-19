import { SidebarMenuAction, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'
import { Skeleton } from '@/components/ui/skeleton'
import useCommon from '@/hooks/use-common'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import React from 'react'
import { TbChevronDown, TbChevronUp, TbList, TbPlus } from 'react-icons/tb'
import { usePathname } from 'next/navigation'
import { useGetListsBySpace } from '../hooks/use-list'

type Props = {
    _id: string;
    name: string;
    color: string;
    Icon: React.ReactNode;
}

function ListSkeleton() {
    return (
        <SidebarMenuItem>
            <SidebarMenuButton size="sm" className="flex items-center w-full">
                <Skeleton className="h-4 w-4 rounded-sm" />
                <Skeleton className="h-3 flex-1" />
            </SidebarMenuButton>
        </SidebarMenuItem>
    )
}

export default function EachTasksSpace({ color, Icon, name, _id }: Props) {
    const [isHovered, setIsHovered] = React.useState(false);
    const [showList, setShowList] = React.useState(false);
    const { getPathToApp } = useCommon();
    const pathname = usePathname();

    const { data: listsData, isLoading: listsLoading } = useGetListsBySpace(_id, showList);
    const lists = listsData?.payload || [];

    const spaceUrl = `${getPathToApp('tasks')}/spaces/${_id}`;
    const isSpaceActive = pathname === spaceUrl || pathname.startsWith(`${spaceUrl}/`);

    const handleToggleList = (e: React.MouseEvent) => {
        e.preventDefault();
        setShowList(!showList);
    };

    return (
        <div className={cn('grid grid-cols-1 gap-1', { "mb-4": showList })}>
            <SidebarMenuItem
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <SidebarMenuButton asChild isActive={isSpaceActive}>
                    <div className='flex items-center w-full'>
                        <div
                            onClick={handleToggleList}
                            className={cn("h-6 w-6 rounded-sm flex items-center justify-center cursor-pointer transition-colors mr-1", {
                                "bg-accent text-accent-foreground": isHovered,
                                "text-white": !isHovered
                            })}
                            style={{ backgroundColor: !isHovered ? color : undefined }}
                        >
                            {!isHovered ? <i className={`fas ${Icon} text-xs`}></i> : (showList ? <TbChevronDown className="h-3 w-3" /> : <TbChevronUp className="h-3 w-3" />)}
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
            
            <div
                className={cn('pl-2 border-l border-border ml-2 overflow-hidden transition-all duration-300 ease-in-out space-y-1', {
                    'max-h-0': !showList,
                    'max-h-[500px]': showList
                })}
            >
                {listsLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                        <ListSkeleton key={i} />
                    ))
                ) : lists.length > 0 ? (
                    lists.map((list) => {
                        const listUrl = `${getPathToApp('tasks')}/spaces/${_id}/lists/${list._id}`;
                        const isListActive = pathname === listUrl;

                        return (
                            <SidebarMenuItem key={list._id}>
                                <SidebarMenuButton asChild isActive={isListActive} size="sm">
                                    <Link href={listUrl}>
                                        <TbList className="h-4 w-4" />
                                        <span className="truncate">{list.name}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        );
                    })
                ) : (
                    <SidebarMenuItem>
                        <SidebarMenuButton size="sm" disabled className="text-muted-foreground">
                            <TbList className="h-4 w-4" />
                            <span>No lists</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                )}
            </div>
        </div>
    )
}
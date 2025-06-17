import React from 'react'
import {
    PiHouseLineDuotone,
    PiCheckCircleDuotone,
    PiChatCircleDuotone,
    PiCalendarDuotone,
    PiKeyDuotone,
    PiFolderSimpleDuotone,
    PiUserDuotone,
    PiSparkleDuotone
} from "react-icons/pi";
import { cn } from '@/lib/utils';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator"
import Link from 'next/link';
import useCommon from '@/hooks/use-common';
import { usePathname } from 'next/navigation';

export default function AppToggler() {
    const { getPathToApp } = useCommon();
    const pathname = usePathname();

    return (
        <>
            <div className="h-screen bg-popover border-r w-14 z-50">
                <Link href={'/workspaces'}>
                    <EachAppToggler tooltipText="Home">
                        <PiHouseLineDuotone />
                    </EachAppToggler>
                </Link>
                <Separator />
                <Link href={`${getPathToApp('tasks')}`}>
                    <EachAppToggler tooltipText="Tasks" isActive={pathname.includes('/apps/tasks')}>
                        <PiCheckCircleDuotone />
                    </EachAppToggler>
                </Link>
                <Link href={`${getPathToApp('people')}`}>
                    <EachAppToggler tooltipText="People" isActive={pathname.includes('/apps/people')}>
                        <PiUserDuotone />
                    </EachAppToggler>
                </Link>
                <Link href={`${getPathToApp('admin')}`}>
                    <EachAppToggler tooltipText="Admin" isActive={pathname.includes('/apps/admin')}>
                        <PiKeyDuotone />
                    </EachAppToggler>
                </Link>
                {
                    process.env.NODE_ENV !== 'production' && <>
                        <Separator />
                        <EachAppToggler tooltipText="Chat" hasNotification>
                            <PiChatCircleDuotone />
                        </EachAppToggler>
                        <EachAppToggler tooltipText="Calendar">
                            <PiCalendarDuotone />
                        </EachAppToggler>
                        <EachAppToggler tooltipText="Files">
                            <PiFolderSimpleDuotone />
                        </EachAppToggler>
                        <Link href={`${getPathToApp('ai')}`}>
                            <EachAppToggler tooltipText="AI" isActive={pathname.includes('/apps/ai')}>
                                <PiSparkleDuotone />
                            </EachAppToggler>
                        </Link>
                    </>
                }
            </div>
        </>
    )
}

const EachAppToggler = (
    {
        children,
        hasNotification,
        isActive = false,
        isDisabled = false,
        onClick,
        tooltipText
    }: {
        children: React.ReactNode;
        isActive?: boolean;
        isDisabled?: boolean;
        onClick?: () => void;
        hasNotification?: boolean;
        tooltipText?: string;
    }
) => {
    return <>
        <Tooltip>
            <TooltipTrigger asChild>
                <button
                    onClick={onClick}
                    disabled={isDisabled}
                    className={cn('w-full h-12 flex justify-center relative items-center transition-colors text-xl', {
                        "bg-background": isActive,
                        "text-muted-foreground hover:bg-accent hover:text-accent-foreground": !isActive
                    })}
                >
                    {hasNotification && <div className='h-2.5 w-2.5 bg-destructive rounded-full absolute top-3 right-3' />}
                    {children}
                </button>
            </TooltipTrigger>
            <TooltipContent side='right'>
                <p>{tooltipText}</p>
            </TooltipContent>
        </Tooltip>

    </>
}

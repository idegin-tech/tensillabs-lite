import { cn } from '@/lib/utils'
import React from 'react'
import { TbMessageCircle, TbAlignLeft2, TbList } from 'react-icons/tb'


export default function TaskDetailsTabs() {
    return (
        <>
            <div className='border-l w-14 h-[calc(var(--app-body)-var(--app-header-sm))] flex flex-col '>
                <EachTab
                    label='Details'
                    Icon={<TbAlignLeft2 />}
                />
                <EachTab
                    label='Chat'
                    Icon={<TbMessageCircle />}
                    isActive
                />
                <EachTab
                    label='Activities'
                    Icon={<TbList />}
                />
            </div>
        </>
    )
}

const EachTab = (
    {
        label,
        isActive,
        Icon
    }: {
        label: string;
        isActive?: boolean;
        Icon: React.ReactNode;
    }
) => {
    return <>
        <button
            className={cn('p-2 cursor-pointer flex flex-col items-center min-h-14 justify-center hover:bg-accent hover:text-accent-foreground gap-1', {
                "bg-accent text-accent-foreground": isActive,
                "text-muted-foreground": !isActive
            })}
        >
            <div>
                {Icon}
            </div>
            <small className='text-xs'>{label}</small>
        </button>
    </>
}

import { cn } from '@/lib/utils'
import React from 'react'
import { TbMessageCircle, TbAlignLeft2, TbList } from 'react-icons/tb'

interface TaskDetailsTabsProps {
  activeTab: 'details' | 'chat' | 'activities'
  onTabChange: (tab: 'details' | 'chat' | 'activities') => void
}

export default function TaskDetailsTabs({ activeTab, onTabChange }: TaskDetailsTabsProps) {    return (
        <>
            <div className='border-l col-span-2 md:col-span-1 h-full flex flex-col bg-muted/20'>
                <EachTab
                    label='Details'
                    Icon={<TbAlignLeft2 />}
                    isActive={activeTab === 'details'}
                    onClick={() => onTabChange('details')}
                />
                <EachTab
                    label='Chat'
                    Icon={<TbMessageCircle />}
                    isActive={activeTab === 'chat'}
                    onClick={() => onTabChange('chat')}
                />
                <EachTab
                    label='Activities'
                    Icon={<TbList />}
                    isActive={activeTab === 'activities'}
                    onClick={() => onTabChange('activities')}
                />
            </div>
        </>
    )
}

const EachTab = (
    {
        label,
        isActive,
        Icon,
        onClick
    }: {
        label: string;
        isActive?: boolean;
        Icon: React.ReactNode;
        onClick?: () => void;
    }
) => {
    return (
        <button
            className={cn('p-3 cursor-pointer flex flex-col items-center min-h-16 justify-center hover:bg-accent hover:text-accent-foreground gap-1.5 transition-all duration-200 relative group', {
                "bg-accent text-accent-foreground shadow-sm": isActive,
                "text-muted-foreground hover:text-foreground": !isActive
            })}
            onClick={onClick}
        >
            {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-8 bg-primary rounded-r-full" />
            )}
            <div className={cn('transition-transform duration-200', {
                'scale-110': isActive,
                'group-hover:scale-105': !isActive
            })}>
                {Icon}
            </div>
            <small className={cn('text-xs font-medium transition-all duration-200', {
                'text-accent-foreground': isActive,
                'text-muted-foreground group-hover:text-foreground': !isActive
            })}>{label}</small>
        </button>
    )
}

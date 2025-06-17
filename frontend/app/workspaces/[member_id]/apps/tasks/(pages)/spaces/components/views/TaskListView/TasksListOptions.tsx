import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuTrigger, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuLabel } from '@/components/ui/dropdown-menu'
import { TbEye, TbStack, TbUser, TbBan, TbCircleCheck, TbExclamationCircle, TbCalendarEvent, TbFlag2Filled } from 'react-icons/tb'
import React from 'react'
import { useTaskList } from '../../../../../contexts/task-list.context'
import { cn } from '@/lib/utils'

export default function TasksListOptions() {
    const { state, updateState } = useTaskList()

    const columnOptions = [
        { id: 'status', label: 'Status' },
        { id: 'priority', label: 'Priority' },
        { id: 'timeframe', label: 'Timeframe' },
        { id: 'all', label: 'All' }
    ]

    const groupByOptions = [
        { value: 'none', label: 'None', icon: TbBan },
        { value: 'status', label: 'Status', icon: TbCircleCheck },
        { value: 'priority', label: 'Priority', icon: TbFlag2Filled },
        { value: 'due_date', label: 'Due Date', icon: TbCalendarEvent }
    ]

    const currentGroupOption = groupByOptions.find(opt => opt.value === state.groupBy) || groupByOptions[0]

    const handleColumnVisibilityChange = (columnId: string, visible: boolean) => {
        if (columnId === 'all') {
            if (visible) {
                updateState({
                    visibleColumns: {
                        ...state.visibleColumns,
                        status: true,
                        priority: true,
                        timeframe: true
                    }
                })
            } else {
                updateState({
                    visibleColumns: {
                        ...state.visibleColumns,
                        status: false,
                        priority: false,
                        timeframe: false
                    }
                })
            }        } else {
            updateState({
                visibleColumns: {
                    ...state.visibleColumns,
                    [columnId]: visible
                }
            })
        }
    }

    return (
        <div className='h-12 border-b flex items-center gap-2 px-2 overflow-x-auto md:overflow-x-hidden'>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button size='sm' variant={'outline'}>
                        <TbEye className="h-4 w-4 mr-1" />
                        Show / Hide Columns
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                    {columnOptions.map((column) => (
                        <DropdownMenuCheckboxItem
                            key={column.id}
                            checked={column.id === 'all' 
                                ? state.visibleColumns.status && state.visibleColumns.priority && state.visibleColumns.timeframe
                                : state.visibleColumns[column.id] !== false
                            }
                            onCheckedChange={(checked) => handleColumnVisibilityChange(column.id, checked)}
                            className="capitalize"
                        >
                            {column.label}
                        </DropdownMenuCheckboxItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button size='sm' variant={'outline'}>
                        <currentGroupOption.icon className="h-4 w-4 mr-1" />
                        Group by: {currentGroupOption.label}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                    <DropdownMenuLabel>Group By</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup 
                        value={state.groupBy} 
                        onValueChange={(value) => updateState({ groupBy: value as any })}
                    >
                        {groupByOptions.map((option) => {
                            const IconComponent = option.icon
                            return (
                                <DropdownMenuRadioItem key={option.value} value={option.value}>
                                    <div className="flex items-center">
                                        {option.label}
                                    </div>
                                </DropdownMenuRadioItem>
                            )
                        })}
                    </DropdownMenuRadioGroup>
                </DropdownMenuContent>
            </DropdownMenu>

            <Button 
                size='sm' 
                variant={state.meMode ? 'ghost': 'outline'}
                onClick={() => updateState({ meMode: !state.meMode })}
                className={cn({
                    "bg-primary/20 hover:bg-primary/20 border-primary border text-primary hover:text-primary": state.meMode,
                    "": !state.meMode
                })}
            >
                <TbUser className="h-4 w-4 mr-1" />
                Me Mode
            </Button>
        </div>
    )
}

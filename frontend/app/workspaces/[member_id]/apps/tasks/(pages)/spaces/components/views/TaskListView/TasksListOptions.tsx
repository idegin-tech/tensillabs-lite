import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { TbEye } from 'react-icons/tb'
import React from 'react'
import { useTaskList } from '../../../../../contexts/task-list.context'


export default function TasksListOptions() {
    const { state, updateState } = useTaskList()

    const columnOptions = [
        { id: 'status', label: 'Status' },
        { id: 'priority', label: 'Priority' },
        { id: 'timeframe', label: 'Timeframe' },
        { id: 'all', label: 'All' }
    ]

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
            }
        } else {
            updateState({
                visibleColumns: {
                    ...state.visibleColumns,
                    [columnId]: visible
                }
            })
        }
    }

    return (
        <div className='h-12 border-b flex items-center gap-2 px-4'>
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
        </div>
    )
}

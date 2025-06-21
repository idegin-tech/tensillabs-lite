'use client'
import React, { useState, useMemo, CSSProperties } from 'react'
import {
    flexRender,
    getCoreRowModel,
    useReactTable,
    Column,
    getPaginationRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    SortingState,
    ColumnFiltersState,
    VisibilityState,
    RowSelectionState,
} from "@tanstack/react-table"
import { TbArrowLeft, TbArrowRight, TbX, TbDots } from 'react-icons/tb'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Task } from '@/types/tasks.types'
import { createColumns } from './TasksTableColumns'
import { useTaskList } from '../../../../../contexts/task-list.context'


const getCommonPinningStyles = (column: Column<Task>): CSSProperties => {
    const isPinned = column.getIsPinned()
    const isLastLeftPinnedColumn = isPinned === 'left' && column.getIsLastColumn('left')
    const isFirstRightPinnedColumn = isPinned === 'right' && column.getIsFirstColumn('right')

    return {
        boxShadow: isLastLeftPinnedColumn
            ? '-4px 0 4px -4px hsl(var(--border)) inset'
            : isFirstRightPinnedColumn
                ? '4px 0 4px -4px hsl(var(--border)) inset'
                : undefined,
        left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
        right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
        position: isPinned ? 'sticky' : 'relative',
        width: column.getSize(),
        zIndex: isPinned ? 1 : 0,
        backgroundColor: isPinned ? 'hsl(var(--muted))' : undefined,
        backdropFilter: isPinned ? 'blur(8px)' : undefined,
        borderRight: isLastLeftPinnedColumn ? '1px solid hsl(var(--border))' : undefined,
        borderLeft: isFirstRightPinnedColumn ? '1px solid hsl(var(--border))' : undefined,
    }
}

interface TasksTableProps {
    tasks: Task[]
    onTaskUpdate?: (taskId: string, updates: Partial<Task>) => void
}

export default function TasksTable({ tasks, onTaskUpdate }: TasksTableProps) {
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

    const { state, updateState } = useTaskList();
    const columns = useMemo(() => createColumns({ 
        onLocalUpdate: onTaskUpdate 
    }), [onTaskUpdate])
    const table = useReactTable({
        data: tasks,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: (updater) => {
            const newVisibility = typeof updater === 'function' ? updater(state.visibleColumns) : updater
            updateState({ visibleColumns: newVisibility })
        },
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility: state.visibleColumns,
            rowSelection,
        },
        defaultColumn: {
            minSize: 0,
            maxSize: Number.MAX_SAFE_INTEGER,
        },
        columnResizeMode: 'onChange',
        initialState: {
            columnPinning: {
                left: ['select', 'name'],
            },
        },
        enableColumnPinning: true,
        enableColumnResizing: true,
        enableRowSelection: true,
        debugTable: false,
        debugHeaders: false,
        debugColumns: false,
    });

    return (
        <div className="space-y-4">
            <div className="rounded-md overflow-x-auto bg-background">
                <Table
                    style={{
                        width: table.getTotalSize(),
                    }}
                >
                    <TableHeader className='bg-background'>
                        {table.getHeaderGroups().map(headerGroup => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map(header => {
                                    const { column } = header
                                    return (
                                        <TableHead
                                            key={header.id}
                                            colSpan={header.colSpan}
                                            className="relative"
                                            style={{ ...getCommonPinningStyles(column) }}
                                        >
                                            <div className="whitespace-nowrap flex items-center gap-2">
                                                <div className="flex-1">
                                                    {header.isPlaceholder
                                                        ? null
                                                        : flexRender(
                                                            header.column.columnDef.header,
                                                            header.getContext()
                                                        )}
                                                </div>
                                                {!header.isPlaceholder && header.column.getCanPin() && (
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                                                <TbDots className="h-3 w-3" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            {header.column.getIsPinned() !== 'left' && (
                                                                <DropdownMenuItem onClick={() => header.column.pin('left')}>
                                                                    <TbArrowLeft className="h-3 w-3 mr-2" />
                                                                    Pin Left
                                                                </DropdownMenuItem>
                                                            )}
                                                            {header.column.getIsPinned() && (
                                                                <DropdownMenuItem onClick={() => header.column.pin(false)}>
                                                                    <TbX className="h-3 w-3 mr-2" />
                                                                    Unpin
                                                                </DropdownMenuItem>
                                                            )}
                                                            {header.column.getIsPinned() !== 'right' && (
                                                                <DropdownMenuItem onClick={() => header.column.pin('right')}>
                                                                    <TbArrowRight className="h-3 w-3 mr-2" />
                                                                    Pin Right
                                                                </DropdownMenuItem>
                                                            )}
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                )}
                                            </div>

                                            <div
                                                onDoubleClick={() => header.column.resetSize()}
                                                onMouseDown={header.getResizeHandler()}
                                                onTouchStart={header.getResizeHandler()}
                                                className={cn(
                                                    "absolute right-0 top-0 h-full w-1 cursor-col-resize select-none touch-none bg-transparent hover:bg-primary/20",
                                                    header.column.getIsResizing() ? "bg-primary" : ""
                                                )}
                                            />
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map(row => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map(cell => {
                                        const { column } = cell
                                        return (
                                            <TableCell
                                                key={cell.id}
                                                style={{ ...getCommonPinningStyles(column) }}
                                            >
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </TableCell>
                                        )
                                    })}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {table.getFilteredSelectedRowModel().rows.length > 0 && (
                <div className="text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
            )}
        </div>
    )
}

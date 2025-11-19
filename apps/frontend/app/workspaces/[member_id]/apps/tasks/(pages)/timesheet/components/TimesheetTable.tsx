'use client'

import { useState } from 'react'
import { TbSearch, TbPlayerPlayFilled, TbTrash, TbClock, TbFolder } from 'react-icons/tb'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface TimeEntry {
    id: string
    description: string
    project?: string
    startTime: string
    endTime?: string
    duration: string
    date: string
}

const mockTimeEntries: TimeEntry[] = [
    {
        id: '1',
        description: 'Fixed authentication bug in login flow',
        project: 'Website Redesign',
        startTime: '09:00 AM',
        endTime: '11:30 AM',
        duration: '2h 30m',
        date: 'Today',
    },
    {
        id: '2',
        description: 'Code review for PR #234',
        project: 'API Integration',
        startTime: '11:45 AM',
        endTime: '12:30 PM',
        duration: '45m',
        date: 'Today',
    },
    {
        id: '3',
        description: 'Team standup meeting',
        startTime: '02:00 PM',
        endTime: '02:15 PM',
        duration: '15m',
        date: 'Today',
    },
    {
        id: '4',
        description: 'Implemented user profile page',
        project: 'Mobile App Development',
        startTime: '09:30 AM',
        endTime: '01:00 PM',
        duration: '3h 30m',
        date: 'Yesterday',
    },
    {
        id: '5',
        description: 'Database optimization',
        project: 'API Integration',
        startTime: '02:00 PM',
        endTime: '05:00 PM',
        duration: '3h',
        date: 'Yesterday',
    },
    {
        id: '6',
        description: 'Updated documentation',
        startTime: '10:00 AM',
        endTime: '11:00 AM',
        duration: '1h',
        date: '2 days ago',
    },
]

export default function TimesheetTable() {
    const [searchQuery, setSearchQuery] = useState('')
    const [filterDate, setFilterDate] = useState('all')
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [entryToDelete, setEntryToDelete] = useState<string | null>(null)

    const filteredEntries = mockTimeEntries.filter((entry) => {
        const matchesSearch = entry.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase())

        if (filterDate === 'all') return matchesSearch
        if (filterDate === 'today') return matchesSearch && entry.date === 'Today'
        if (filterDate === 'yesterday') return matchesSearch && entry.date === 'Yesterday'

        return matchesSearch
    })

    const totalHours = filteredEntries.reduce((acc, entry) => {
        const hours = parseFloat(entry.duration.replace('h', '').replace('m', '') || '0')
        return acc + hours
    }, 0)

    const handleDeleteClick = (entryId: string) => {
        setEntryToDelete(entryId)
        setDeleteDialogOpen(true)
    }

    const handleDeleteConfirm = () => {
        if (entryToDelete) {
            console.log('Deleting entry:', entryToDelete)
        }
        setDeleteDialogOpen(false)
        setEntryToDelete(null)
    }

    const handleResumeEntry = (entryId: string) => {
        console.log('Resuming entry:', entryId)
    }

    return (
        <div className='space-y-8'>

            <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
                <div>
                    <h2 className='text-xl font-semibold'>Time Entries</h2>
                    <p className='text-sm text-muted-foreground mt-1'>
                        {filteredEntries.length} entries
                        {filteredEntries.length > 0 && (
                            <span className='ml-2'>
                                · Total: <span className='font-medium'>{totalHours.toFixed(1)}h</span>
                            </span>
                        )}
                    </p>
                </div>

                <div className='flex flex-col sm:flex-row gap-3'>
                    <div className='relative'>
                        <TbSearch className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                        <Input
                            placeholder='Search entries...'
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className='pl-9 w-full sm:w-[250px]'
                        />
                    </div>

                    <Select value={filterDate} onValueChange={setFilterDate}>
                        <SelectTrigger className='w-full sm:w-[180px]'>
                            <SelectValue placeholder='Filter by date' />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value='all'>All Time</SelectItem>
                            <SelectItem value='today'>Today</SelectItem>
                            <SelectItem value='yesterday'>Yesterday</SelectItem>
                            <SelectItem value='this-week'>This Week</SelectItem>
                            <SelectItem value='last-week'>Last Week</SelectItem>
                            <SelectItem value='this-month'>This Month</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <Card>
                <CardContent>
                    <div className='rounded-lg'>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className='w-[40%]'>Description</TableHead>
                                    <TableHead>Project</TableHead>
                                    <TableHead>Start Time</TableHead>
                                    <TableHead>End Time</TableHead>
                                    <TableHead>Duration</TableHead>
                                    <TableHead className='text-right'>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredEntries.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={6}
                                            className='text-center py-12 text-muted-foreground'
                                        >
                                            <div className='flex flex-col items-center gap-2'>
                                                <TbClock className='h-12 w-12 opacity-20' />
                                                <p>No time entries found</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredEntries.map((entry) => (
                                        <TableRow key={entry.id}>
                                            <TableCell>
                                                <span className='font-medium'>
                                                    {entry.description}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                {entry.project ? (
                                                    <Badge
                                                        variant='outline'
                                                        className='font-normal gap-1.5 bg-popover'
                                                    >
                                                        <TbFolder className='h-3 w-3' />
                                                        {entry.project}
                                                    </Badge>
                                                ) : (
                                                    <span className='text-muted-foreground text-sm'>
                                                        —
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <span className='text-sm'>{entry.startTime}</span>
                                            </TableCell>
                                            <TableCell>
                                                {entry.endTime ? (
                                                    <span className='text-sm'>{entry.endTime}</span>
                                                ) : (
                                                    <span className='text-muted-foreground text-sm'>
                                                        —
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <span className='font-medium tabular-nums'>
                                                    {entry.duration}
                                                </span>
                                            </TableCell>
                                            <TableCell className='text-right'>
                                                <div className='flex justify-end gap-1'>
                                                    <Button
                                                        variant='ghost'
                                                        size='sm'
                                                        className='h-8 w-8 p-0'
                                                        onClick={() => handleResumeEntry(entry.id)}
                                                    >
                                                        <TbPlayerPlayFilled className='h-4 w-4' /> Resume
                                                    </Button>
                                                    <Button
                                                        variant='ghost'
                                                        size='sm'
                                                        className='h-8 w-8 p-0 text-destructive hover:text-destructive'
                                                        onClick={() => handleDeleteClick(entry.id)}
                                                    >
                                                        <TbTrash className='h-4 w-4' />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Move to trash?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This time entry will be moved to trash. You can restore it later from the trash section.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteConfirm}>
                            Move to Trash
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

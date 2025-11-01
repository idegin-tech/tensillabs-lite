'use client'
import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle 
} from '@/components/ui/dialog'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { Controller } from 'react-hook-form'
import { DateRange } from 'react-day-picker'
import { cn } from '@/lib/utils'
import { TaskStatus, TaskPriority } from '@/types/tasks.types'
import { useCreateTasks } from '../hooks/use-tasks'
import { useParams } from 'next/navigation'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'

const taskFormSchema = z.object({
    name: z
        .string()
        .min(1, 'Task name is required')
        .max(200, 'Task name must not exceed 200 characters')
        .trim(),
    description: z
        .string()
        .max(98000, 'Description must not exceed 1000 characters')
        .trim()
        .optional()
        .or(z.literal('')),
    status: z.nativeEnum(TaskStatus),
    priority: z.nativeEnum(TaskPriority).optional(),
    timeframe: z.object({
        start: z.date().optional(),
        end: z.date().optional()
    }).optional()
})

type TaskFormData = z.infer<typeof taskFormSchema>

interface GroupInfo {
    title: string
    status?: TaskStatus
    priority?: TaskPriority
    icon: React.ComponentType<{ className?: string }>
    color: string
}

interface Props {
    isOpen: boolean
    onClose: () => void
    groupInfo?: GroupInfo
    onTaskCreated?: (task: any) => void
}

export default function CreateTaskPopup({ isOpen, onClose, groupInfo, onTaskCreated }: Props) {
    const params = useParams()
    const listId = params.list_id as string
    const queryClient = useQueryClient()
    const createTasks = useCreateTasks(listId)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<TaskFormData>({
        resolver: zodResolver(taskFormSchema),
        defaultValues: {
            name: '',
            description: '',
            status: groupInfo?.status || TaskStatus.TODO,
            priority: groupInfo?.priority,
            timeframe: {
                start: undefined,
                end: undefined
            }
        },
        mode: 'onChange',
    })

    const handleSubmit = async (data: TaskFormData) => {
        setIsSubmitting(true)
        try {
            // Format dates to ISO strings for the API
            const formattedData = {
                ...data,
                timeframe: data.timeframe ? {
                    start: data.timeframe.start?.toISOString(),
                    end: data.timeframe.end?.toISOString()
                } : undefined
            }
            const response = await createTasks.mutateAsync({
                tasks: [formattedData]
            })
            
            if (response.payload && response.payload.length > 0) {
                const createdTask = response.payload[0]
                onTaskCreated?.(createdTask)
            }

            await queryClient.invalidateQueries({
                queryKey: ['tasks-by-group', listId]
            })

            toast.success('Task created successfully!')
            handleClose()
        } catch (error) {
            console.error('Failed to create task:', error)
            toast.error('Failed to create task')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleClose = () => {
        form.reset()
        onClose()
    }

    useEffect(() => {
        if (isOpen) {
            form.reset({
                name: '',
                description: '',
                status: groupInfo?.status || TaskStatus.TODO,
                priority: groupInfo?.priority,
                timeframe: {
                    start: undefined,
                    end: undefined
                }
            })
        }
    }, [isOpen, groupInfo, form])

    const Icon = groupInfo?.icon

    const statusOptions = [
        { value: TaskStatus.TODO, label: 'To Do' },
        { value: TaskStatus.IN_PROGRESS, label: 'In Progress' },
        { value: TaskStatus.IN_REVIEW, label: 'In Review' },
        { value: TaskStatus.COMPLETED, label: 'Completed' },
        { value: TaskStatus.CANCELED, label: 'Canceled' }
    ]

    const priorityOptions = [
        { value: TaskPriority.URGENT, label: 'Urgent' },
        { value: TaskPriority.HIGH, label: 'High' },
        { value: TaskPriority.NORMAL, label: 'Normal' },
        { value: TaskPriority.LOW, label: 'Low' }
    ]

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <div className="flex items-center justify-between">
                        <DialogTitle className="flex items-center gap-3">
                            {groupInfo && Icon && (
                                <div className={cn('h-8 w-8 rounded-lg flex items-center justify-center', groupInfo.color)}>
                                    <Icon className="h-4 w-4" />
                                </div>
                            )}                            <div>
                                <span>Create Task{groupInfo ? ` in ${groupInfo.title}` : ''}</span>
                            </div>
                        </DialogTitle>
                    </div>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 gap-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Task Name *</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter task name"
                                                disabled={isSubmitting}
                                                maxLength={200}
                                                {...field}
                                            />
                                        </FormControl>
                                        <div className="flex justify-between items-center">
                                            <FormMessage />
                                            <span className="text-xs text-muted-foreground">
                                                {field.value?.length || 0}/200
                                            </span>
                                        </div>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Describe the task..."
                                                className="resize-none"
                                                rows={3}
                                                maxLength={1000}
                                                disabled={isSubmitting}
                                                {...field}
                                            />
                                        </FormControl>
                                        <div className="flex justify-between items-center">
                                            <FormMessage />
                                            <span className="text-xs text-muted-foreground">
                                                {field.value?.length || 0}/1000
                                            </span>
                                        </div>
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="status"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Status</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value} disabled={isSubmitting}>
                                                <FormControl>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select status" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {statusOptions.map((option) => (
                                                        <SelectItem key={option.value} value={option.value}>
                                                            {option.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="priority"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Priority</FormLabel>
                                            <Select 
                                                onValueChange={(value) => {
                                                    field.onChange(value === 'none' ? undefined : value)
                                                }} 
                                                value={field.value || 'none'} 
                                                disabled={isSubmitting}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select priority" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="none">No Priority</SelectItem>
                                                    {priorityOptions.map((option) => (
                                                        <SelectItem key={option.value} value={option.value}>
                                                            {option.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                <FormItem>
                                    <FormLabel>Timeline</FormLabel>
                                    <Controller
                                        control={form.control}
                                        name="timeframe"
                                        render={({ field }) => {
                                            const selectedRange: DateRange | undefined = field.value
                                                ? {
                                                    from: field.value.start ?? undefined,
                                                    to: field.value.end ?? undefined,
                                                }
                                                : undefined

                                            const formatTimeframe = (range?: DateRange | undefined) => {
                                                if (!range || (!range.from && !range.to)) return 'No timeframe'
                                                if (range.from && range.to) return `${format(range.from, 'MMM d')} → ${format(range.to, 'MMM d')}`
                                                if (range.from) return `From ${format(range.from, 'MMM d')}`
                                                if (range.to) return `Until ${format(range.to, 'MMM d')}`
                                                return 'No timeframe'
                                            }

                                            return (
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button
                                                                variant="outline"
                                                                className={cn(
                                                                    'w-full pl-3 text-left font-normal',
                                                                    !(selectedRange && (selectedRange.from || selectedRange.to)) && 'text-muted-foreground'
                                                                )}
                                                                disabled={isSubmitting}
                                                            >
                                                                {formatTimeframe(selectedRange)}
                                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align="start">
                                                        <Calendar
                                                            mode="range"
                                                            selected={selectedRange}
                                                            onSelect={(range) => {
                                                                // range may be undefined or have from/to
                                                                const newVal = range
                                                                    ? {
                                                                        start: range.from ?? undefined,
                                                                        end: range.to ?? undefined,
                                                                    }
                                                                    : undefined

                                                                field.onChange(newVal)
                                                            }}
                                                            numberOfMonths={2}
                                                            className="rounded-md border"
                                                        />
                                                        <div className="p-3 border-t">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => field.onChange(undefined)}
                                                                className="w-full"
                                                            >
                                                                Clear timeframe
                                                            </Button>
                                                        </div>
                                                    </PopoverContent>
                                                </Popover>
                                            )
                                        }}
                                    />
                                    <FormMessage />
                                </FormItem>
                            </div>
                        </div>
                        
                        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4 border-t">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleClose}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                            
                            <Button
                                type="submit"
                                disabled={isSubmitting || !form.formState.isValid}
                                className="min-w-[100px]"
                            >
                                {isSubmitting ? 'Creating...' : 'Create Task'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

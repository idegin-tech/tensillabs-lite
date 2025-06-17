'use client'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
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
import { Badge } from '@/components/ui/badge'
import { 
    TbChevronLeft, 
    TbChevronRight, 
    TbX, 
    TbPlus,
    TbCheck
} from 'react-icons/tb'
import { cn } from '@/lib/utils'
import { TaskStatus, TaskPriority } from '@/types/tasks.types'

const taskFormSchema = z.object({
    name: z
        .string()
        .min(1, 'Task name is required')
        .max(200, 'Task name must not exceed 200 characters')
        .trim(),
    description: z
        .string()
        .max(1000, 'Description must not exceed 1000 characters')
        .trim()
        .optional()
        .or(z.literal('')),
    status: z.nativeEnum(TaskStatus),
    priority: z.nativeEnum(TaskPriority).optional(),
    timeframe: z.object({
        start: z.string().optional(),
        end: z.string().optional()
    }).optional()
})

type TaskFormData = z.infer<typeof taskFormSchema>

interface GroupInfo {
    title: string
    status?: TaskStatus
    icon: React.ComponentType<{ className?: string }>
    color: string
}

interface Props {
    isOpen: boolean
    onClose: () => void
    groupInfo: GroupInfo
}

interface CreatedTask extends TaskFormData {
    id: string
    created: boolean
}

export default function CreateTaskPopup({ isOpen, onClose, groupInfo }: Props) {
    const [createdTasks, setCreatedTasks] = useState<CreatedTask[]>([])
    const [currentTaskIndex, setCurrentTaskIndex] = useState(0)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<TaskFormData>({
        resolver: zodResolver(taskFormSchema),
        defaultValues: {
            name: '',
            description: '',
            status: groupInfo.status || TaskStatus.TODO,
            priority: undefined,
            timeframe: {
                start: '',
                end: ''
            }
        },
        mode: 'onChange',
    })

    const handleSubmit = async (data: TaskFormData) => {
        setIsSubmitting(true)
        try {
            await new Promise(resolve => setTimeout(resolve, 500))
            
            const newTask: CreatedTask = {
                ...data,
                id: Date.now().toString(),
                created: true
            }

            if (currentTaskIndex < createdTasks.length) {
                const updatedTasks = [...createdTasks]
                updatedTasks[currentTaskIndex] = newTask
                setCreatedTasks(updatedTasks)
            } else {
                setCreatedTasks(prev => [...prev, newTask])
            }

            form.reset({
                name: '',
                description: '',
                status: groupInfo.status || TaskStatus.TODO,
                priority: undefined,
                timeframe: {
                    start: '',
                    end: ''
                }
            })
        } catch (error) {
            console.error('Failed to create task:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleAddMore = () => {
        const nextIndex = Math.max(currentTaskIndex + 1, createdTasks.length)
        setCurrentTaskIndex(nextIndex)
        form.reset({
            name: '',
            description: '',
            status: groupInfo.status || TaskStatus.TODO,
            priority: undefined,
            timeframe: {
                start: '',
                end: ''
            }
        })
    }

    const handleNavigation = (index: number) => {
        setCurrentTaskIndex(index)
        
        if (index < createdTasks.length) {
            const task = createdTasks[index]
            form.reset({
                name: task.name,
                description: task.description || '',
                status: task.status,
                priority: task.priority,
                timeframe: task.timeframe || { start: '', end: '' }
            })
        } else {
            form.reset({
                name: '',
                description: '',
                status: groupInfo.status || TaskStatus.TODO,
                priority: undefined,
                timeframe: {
                    start: '',
                    end: ''
                }
            })
        }
    }

    const handleClose = () => {
        form.reset()
        setCreatedTasks([])
        setCurrentTaskIndex(0)
        onClose()
    }

    const Icon = groupInfo.icon
    const isCurrentTaskCreated = currentTaskIndex < createdTasks.length && createdTasks[currentTaskIndex]?.created
    const totalTasks = Math.max(createdTasks.length, currentTaskIndex + 1)

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
                            <div className={cn('h-8 w-8 rounded-lg flex items-center justify-center', groupInfo.color)}>
                                <Icon className="h-4 w-4" />
                            </div>
                            <div>
                                <span>Create Task in {groupInfo.title}</span>
                                {createdTasks.length > 0 && (
                                    <div className="text-sm text-muted-foreground font-normal">
                                        {createdTasks.length} task{createdTasks.length !== 1 ? 's' : ''} created
                                    </div>
                                )}
                            </div>
                        </DialogTitle>
                    </div>
                </DialogHeader>

                {totalTasks > 1 && (
                    <div className="flex items-center justify-between border-b pb-4">
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleNavigation(Math.max(0, currentTaskIndex - 1))}
                                disabled={currentTaskIndex === 0}
                                className="h-8 w-8 p-0"
                            >
                                <TbChevronLeft className="h-4 w-4" />
                            </Button>
                            
                            <div className="flex items-center gap-1">
                                {Array.from({ length: totalTasks }).map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleNavigation(index)}
                                        className={cn(
                                            "h-2 w-2 rounded-full transition-all",
                                            index === currentTaskIndex
                                                ? "bg-primary w-4"
                                                : index < createdTasks.length && createdTasks[index]?.created
                                                ? "bg-green-500"
                                                : "bg-muted-foreground/30"
                                        )}
                                    />
                                ))}
                            </div>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleNavigation(Math.min(totalTasks, currentTaskIndex + 1))}
                                disabled={currentTaskIndex >= totalTasks - 1}
                                className="h-8 w-8 p-0"
                            >
                                <TbChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                        
                        <div className="text-sm text-muted-foreground">
                            Task {currentTaskIndex + 1} of {totalTasks}
                        </div>
                    </div>
                )}

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
                                                    <SelectTrigger>
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
                                />                                <FormField
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
                                                    <SelectTrigger>
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

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="timeframe.start"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Start Date</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="date"
                                                    disabled={isSubmitting}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="timeframe.end"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Due Date</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="date"
                                                    disabled={isSubmitting}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-3 pt-4 border-t">
                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleClose}
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </Button>
                                {createdTasks.length > 0 && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleClose}
                                        disabled={isSubmitting}
                                    >
                                        <TbCheck className="h-4 w-4 mr-2" />
                                        Done ({createdTasks.length} task{createdTasks.length !== 1 ? 's' : ''})
                                    </Button>
                                )}
                            </div>
                            
                            <div className="flex gap-2">
                                <Button
                                    type="submit"
                                    disabled={isSubmitting || !form.formState.isValid}
                                    className="min-w-[100px]"
                                >
                                    {isSubmitting ? 'Creating...' : isCurrentTaskCreated ? 'Update' : 'Create Task'}
                                </Button>
                                
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={handleAddMore}
                                    disabled={isSubmitting || !form.formState.isValid}
                                >
                                    <TbPlus className="h-4 w-4 mr-2" />
                                    Add More
                                </Button>
                            </div>
                        </div>
                    </form>
                </Form>

                {/* Created Tasks Summary */}
                {createdTasks.length > 0 && (
                    <div className="border-t pt-4">
                        <h4 className="text-sm font-medium text-muted-foreground mb-2">
                            Created Tasks ({createdTasks.length})
                        </h4>
                        <div className="space-y-2 max-h-32 overflow-y-auto">
                            {createdTasks.map((task, index) => (
                                <div 
                                    key={task.id}
                                    className={cn(
                                        "flex items-center justify-between p-2 rounded-md border text-sm",
                                        index === currentTaskIndex ? "bg-primary/5 border-primary/20" : "bg-muted/20"
                                    )}
                                >
                                    <div className="flex items-center gap-2 flex-1 min-w-0">
                                        <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                                        <span className="truncate font-medium">{task.name}</span>
                                        {task.priority && (
                                            <Badge variant="outline" className="text-xs">
                                                {task.priority}
                                            </Badge>
                                        )}
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleNavigation(index)}
                                        className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                                    >
                                        <TbChevronRight className="h-3 w-3" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
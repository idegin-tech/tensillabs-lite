'use client'

import { useState, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import useCommon from '@/hooks/use-common'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
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
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { TbAlertCircle, TbCalendar, TbInfoCircle, TbUpload, TbX, TbFile } from 'react-icons/tb'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const timeOffRequestSchema = z.object({
    type: z.enum(['personal', 'family_emergency', 'medical_appointment', 'bereavement', 'religious_observance', 'jury_duty', 'military_leave', 'other'], {
        required_error: 'Time off type is required',
    }),
    startDate: z.date({
        required_error: 'Start date is required',
    }),
    endDate: z.date({
        required_error: 'End date is required',
    }),
    reason: z.string().max(1000).optional(),
}).refine((data) => {
    return data.endDate >= data.startDate
}, {
    message: 'End date must be after or equal to start date',
    path: ['endDate'],
})

type TimeOffRequestForm = z.infer<typeof timeOffRequestSchema>

interface CreateTimeOffRequestDialogProps {
    isOpen: boolean
    onClose: () => void
    hasPendingRequest?: boolean
}

const timeOffTypeLabels: Record<string, string> = {
    personal: 'Personal',
    family_emergency: 'Family Emergency',
    medical_appointment: 'Medical Appointment',
    bereavement: 'Bereavement',
    religious_observance: 'Religious Observance',
    jury_duty: 'Jury Duty',
    military_leave: 'Military Leave',
    other: 'Other'
}

export default function CreateTimeOffRequestDialog({
    isOpen,
    onClose,
    hasPendingRequest = false
}: CreateTimeOffRequestDialogProps) {
    const { member_id } = useCommon()
    const queryClient = useQueryClient()
    const [calculatedDays, setCalculatedDays] = useState<number>(0)
    const [selectedFiles, setSelectedFiles] = useState<File[]>([])
    const fileInputRef = useRef<HTMLInputElement>(null)

    const form = useForm<TimeOffRequestForm>({
        resolver: zodResolver(timeOffRequestSchema),
        defaultValues: {
            type: undefined,
            startDate: undefined,
            endDate: undefined,
            reason: '',
        },
    })

    const createTimeOffRequest = useMutation({
        mutationFn: async (data: { formData: TimeOffRequestForm; files: File[] }) => {
            const formData = new FormData()
            formData.append('type', data.formData.type)
            formData.append('startDate', data.formData.startDate.toISOString())
            formData.append('endDate', data.formData.endDate.toISOString())
            if (data.formData.reason) {
                formData.append('reason', data.formData.reason)
            }

            data.files.forEach((file) => {
                formData.append('files', file)
            })

            const response = await api.post('/hrms/time-off-requests', formData, {
                headers: {
                    'x-member-id': member_id,
                    'Content-Type': 'multipart/form-data',
                },
            })
            return response
        },
        onSuccess: () => {
            toast.success('Time off request submitted successfully')
            queryClient.invalidateQueries({ queryKey: ['hrms-dependencies'] })
            handleClose()
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to submit time off request')
        },
    })

    const calculateDays = (startDate: Date, endDate: Date) => {
        if (!startDate || !endDate) return 0
        const diffTime = endDate.getTime() - startDate.getTime()
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
        return diffDays > 0 ? diffDays : 0
    }

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        
        if (selectedFiles.length + files.length > 10) {
            toast.error('Maximum 10 files allowed')
            return
        }

        const oversizedFiles = files.filter(file => file.size > 10 * 1024 * 1024)
        if (oversizedFiles.length > 0) {
            toast.error(`Files exceed 10MB limit: ${oversizedFiles.map(f => f.name).join(', ')}`)
            return
        }

        setSelectedFiles(prev => [...prev, ...files])
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const removeFile = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index))
    }

    const onSubmit = async (values: TimeOffRequestForm) => {
        if (hasPendingRequest) {
            toast.error('You already have a pending time off request')
            return
        }
        await createTimeOffRequest.mutateAsync({ formData: values, files: selectedFiles })
    }

    const handleClose = () => {
        form.reset()
        setCalculatedDays(0)
        setSelectedFiles([])
        onClose()
    }

    const watchStartDate = form.watch('startDate')
    const watchEndDate = form.watch('endDate')

    useEffect(() => {
        if (watchStartDate && watchEndDate) {
            const days = calculateDays(watchStartDate, watchEndDate)
            setCalculatedDays(days)
        }
    }, [watchStartDate, watchEndDate])

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <TbCalendar className="h-5 w-5" />
                        Request Time Off
                    </DialogTitle>
                    <DialogDescription>
                        Submit a time off request for approval by your manager
                    </DialogDescription>
                </DialogHeader>

                {hasPendingRequest && (
                    <Alert variant="destructive" className="mb-4">
                        <TbAlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            You already have a pending time off request. Please wait for it to be processed before submitting another request.
                        </AlertDescription>
                    </Alert>
                )}

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Time Off Type</FormLabel>
                                    <Select 
                                        onValueChange={field.onChange} 
                                        value={field.value}
                                        disabled={hasPendingRequest}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select time off type" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {Object.entries(timeOffTypeLabels).map(([value, label]) => (
                                                <SelectItem key={value} value={value}>
                                                    {label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="startDate"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Start Date</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant="outline"
                                                        disabled={hasPendingRequest}
                                                        className={cn(
                                                            "w-full pl-3 text-left font-normal",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value ? (
                                                            format(field.value, "PPP")
                                                        ) : (
                                                            <span>Pick a date</span>
                                                        )}
                                                        <TbCalendar className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    disabled={(date) =>
                                                        date < new Date(new Date().setHours(0, 0, 0, 0)) || hasPendingRequest
                                                    }
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="endDate"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>End Date</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant="outline"
                                                        disabled={hasPendingRequest}
                                                        className={cn(
                                                            "w-full pl-3 text-left font-normal",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value ? (
                                                            format(field.value, "PPP")
                                                        ) : (
                                                            <span>Pick a date</span>
                                                        )}
                                                        <TbCalendar className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    disabled={(date) =>
                                                        date < (watchStartDate || new Date(new Date().setHours(0, 0, 0, 0))) || hasPendingRequest
                                                    }
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        

                        <FormField
                            control={form.control}
                            name="reason"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Reason (Optional)</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Provide additional details about your time off request..."
                                            className="resize-none min-h-[100px]"
                                            {...field}
                                            disabled={hasPendingRequest}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Maximum 1000 characters
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="space-y-2 grid grid-cols-1">
                            <FormLabel>Supporting Documents (Optional)</FormLabel>
                            <div className="flex items-center gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={hasPendingRequest || selectedFiles.length >= 10}
                                >
                                    <TbUpload className="h-4 w-4 mr-2" />
                                    Upload Files
                                </Button>
                                <span className="text-xs text-muted-foreground">
                                    {selectedFiles.length}/10 files • Max 10MB each
                                </span>
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                multiple
                                onChange={handleFileSelect}
                                className="hidden"
                                accept="*/*"
                            />
                            {selectedFiles.length > 0 && (
                                <div className="space-y-2">
                                    {selectedFiles.map((file, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between p-2 border rounded-md bg-muted/50"
                                        >
                                            <div className="flex items-center gap-2 min-w-0">
                                                <TbFile className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                                                <span className="text-sm truncate">{file.name}</span>
                                                <Badge variant="secondary" className="text-xs">
                                                    {(file.size / 1024).toFixed(1)} KB
                                                </Badge>
                                            </div>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeFile(index)}
                                                className="h-6 w-6 p-0 flex-shrink-0"
                                            >
                                                <TbX className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {calculatedDays > 0 && (
                            <Alert className="bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800">
                                <TbInfoCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                <AlertDescription className="text-blue-800 dark:text-blue-300">
                                    Total days: <span>
                                        <strong>{calculatedDays}</strong> {calculatedDays === 1 ? 'day' : 'days'}
                                    </span>
                                </AlertDescription>
                            </Alert>
                        )}

                        <div className="flex justify-end gap-3 pt-4 border-t">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleClose}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={createTimeOffRequest.isPending || hasPendingRequest}
                            >
                                {createTimeOffRequest.isPending ? 'Submitting...' : 'Submit Request'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

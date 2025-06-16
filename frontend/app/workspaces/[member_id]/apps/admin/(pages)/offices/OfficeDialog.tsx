import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { TbLoader2 } from 'react-icons/tb'
import { Office } from '@/types/offices.types'

const officeFormSchema = z.object({
    name: z
        .string()
        .min(1, 'Office name is required')
        .max(100, 'Office name must not exceed 100 characters')
        .trim()
        .refine((val) => val.length > 0, {
            message: 'Office name cannot be empty or contain only spaces',
        }),
    description: z
        .string()
        .max(500, 'Description must not exceed 500 characters')
        .trim()
        .optional()
        .or(z.literal(''))
        .transform((val) => (val === '' ? undefined : val)),
    address: z
        .string()
        .max(500, 'Address must not exceed 500 characters')
        .trim()
        .optional()
        .or(z.literal(''))
        .transform((val) => (val === '' ? undefined : val)),
})

type OfficeFormData = z.infer<typeof officeFormSchema>

interface OfficeDialogProps {
    office?: Office
    open: boolean
    onOpenChange: (open: boolean) => void
    onSubmit: (data: any) => void
    isLoading: boolean
}

export default function OfficeDialog({ office, open, onOpenChange, onSubmit, isLoading }: OfficeDialogProps) {
    const form = useForm<OfficeFormData>({
        resolver: zodResolver(officeFormSchema),
        defaultValues: {
            name: '',
            description: '',
            address: '',
        },
        mode: 'onChange',
    })

    useEffect(() => {
        if (office) {
            form.reset({
                name: office.name,
                description: office.description || '',
                address: office.address || ''
            })
        } else {
            form.reset({
                name: '',
                description: '',
                address: ''
            })
        }
    }, [office, open, form])

    const handleSubmit = (data: OfficeFormData) => {
        const submitData: any = {
            name: data.name,
            description: data.description,
            address: data.address
        }

        Object.keys(submitData).forEach(key => {
            if (submitData[key] === undefined) {
                delete submitData[key]
            }
        })

        onSubmit(submitData)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {office ? 'Edit Office' : 'Create New Office'}
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Office Name *</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="Enter office name"
                                            disabled={isLoading}
                                            maxLength={100}
                                        />
                                    </FormControl>
                                    <div className="flex justify-between items-center">
                                        <FormMessage />
                                        <span className="text-xs text-muted-foreground">
                                            {field.value?.length || 0}/100
                                        </span>
                                    </div>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Address</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="Enter office address"
                                            disabled={isLoading}
                                            maxLength={500}
                                        />
                                    </FormControl>
                                    <div className="flex justify-between items-center">
                                        <FormMessage />
                                        <span className="text-xs text-muted-foreground">
                                            {field.value?.length || 0}/500
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
                                            {...field}
                                            placeholder="Enter office description"
                                            rows={3}
                                            disabled={isLoading}
                                            maxLength={500}
                                            className="resize-none"
                                        />
                                    </FormControl>
                                    <div className="flex justify-between items-center">
                                        <FormMessage />
                                        <span className="text-xs text-muted-foreground">
                                            {field.value?.length || 0}/500
                                        </span>
                                    </div>
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end space-x-2 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                disabled={isLoading}
                            >
                                Cancel
                            </Button>
                            <Button 
                                type="submit" 
                                disabled={isLoading || !form.formState.isValid}
                            >
                                {isLoading && <TbLoader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {office ? 'Update' : 'Create'} Office
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

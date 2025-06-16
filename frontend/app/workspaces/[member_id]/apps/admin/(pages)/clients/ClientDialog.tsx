import React, { useEffect, useState } from 'react'
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form'
import { TbLoader2, TbX } from 'react-icons/tb'
import { Client } from '@/types/clients.types'
import OfficeSelector from '@/components/OfficeSelector'
import { InputSelectorData } from '@/components/InputSelector'
import { Badge } from '@/components/ui/badge'

const clientFormSchema = z.object({
    name: z
        .string()
        .min(1, 'Client name is required')
        .max(100, 'Client name must not exceed 100 characters')
        .trim()
        .refine((val) => val.length > 0, {
            message: 'Client name cannot be empty or contain only spaces',
        }),
    description: z
        .string()
        .max(500, 'Description must not exceed 500 characters')
        .trim()
        .optional(),
})

type ClientFormData = z.infer<typeof clientFormSchema>

interface ClientDialogProps {
    client?: Client
    open: boolean
    onOpenChange: (open: boolean) => void
    onSubmit: (data: any) => void
    isLoading: boolean
}

export default function ClientDialog({ client, open, onOpenChange, onSubmit, isLoading }: ClientDialogProps) {
    const [selectedOffices, setSelectedOffices] = useState<InputSelectorData[]>([])

    const form = useForm<ClientFormData>({
        resolver: zodResolver(clientFormSchema),
        defaultValues: {
            name: '',
            description: '',
        },
        mode: 'onChange',
    })

    useEffect(() => {
        if (client && open) {
            const officeOptions: InputSelectorData[] = Array.isArray(client.offices)
                ? client.offices.map(office => {
                    if (typeof office === 'string') {
                        return { label: office, value: office, description: '' }
                    }
                    return {
                        label: office.name || office._id,
                        value: office._id,
                        description: office.address || office.description || ''
                    }
                  })
                : []

            form.reset({
                name: client.name || '',
                description: client.description || '',
            })
            setSelectedOffices(officeOptions)
        } else if (!client && open) {
            form.reset({
                name: '',
                description: '',
            })
            setSelectedOffices([])
        }
    }, [client, open, form])

    const handleSubmit = (data: ClientFormData) => {
        const officeIds = selectedOffices.map(office => office.value)
        
        const submitData: any = {
            name: data.name.trim(),
            description: data.description?.trim() || undefined,
            offices: officeIds,
        }

        Object.keys(submitData).forEach(key => {
            if (submitData[key] === undefined || submitData[key] === '') {
                delete submitData[key]
            }
        })

        onSubmit(submitData)
    }

    const handleOpenChange = (newOpen: boolean) => {
        if (!newOpen && !isLoading) {
            form.reset()
            setSelectedOffices([])
        }
        onOpenChange(newOpen)
    }

    const handleAddOffice = (office: InputSelectorData) => {
        const exists = selectedOffices.some(selected => selected.value === office.value)
        if (!exists) {
            setSelectedOffices(prev => [...prev, office])
        }
    }

    const handleRemoveOffice = (officeId: string) => {
        setSelectedOffices(prev => prev.filter(office => office.value !== officeId))
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {client ? 'Edit Client' : 'Create New Client'}
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Client Name *</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="Enter client name"
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
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            placeholder="Enter client description"
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

                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Offices</Label>
                            <OfficeSelector
                                value={undefined}
                                onChange={handleAddOffice}
                                placeholder="Select offices to associate with this client"
                                disabled={isLoading}
                                className="w-full"
                            />
                            <FormDescription className="text-xs">
                                Select offices to associate with this client (optional)
                            </FormDescription>
                            
                            {selectedOffices.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {selectedOffices.map((office) => (
                                        <Badge key={office.value} variant="secondary" className="flex items-center gap-1">
                                            {office.label}
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="h-auto p-0 hover:bg-transparent"
                                                onClick={() => handleRemoveOffice(office.value)}
                                                disabled={isLoading}
                                            >
                                                <TbX className="h-3 w-3" />
                                            </Button>
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end space-x-2 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => handleOpenChange(false)}
                                disabled={isLoading}
                            >
                                Cancel
                            </Button>
                            <Button 
                                type="submit" 
                                disabled={isLoading || !form.formState.isValid}
                            >
                                {isLoading && <TbLoader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {client ? 'Update' : 'Create'} Client
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

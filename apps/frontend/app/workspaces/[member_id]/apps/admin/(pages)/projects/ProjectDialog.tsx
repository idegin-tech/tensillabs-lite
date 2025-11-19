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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form'
import { TbLoader2 } from 'react-icons/tb'
import { Project } from '@/types/projects.types'
import { toast } from 'sonner'
import ClientsSelector from '@/components/ClientsSelector'
import { InputSelectorData } from '@/components/InputSelector'

// Define the form schema based on backend validation
const projectFormSchema = z.object({
    name: z
        .string()
        .min(1, 'Project name is required')
        .max(100, 'Project name must not exceed 100 characters')
        .trim()
        .refine((val) => val.length > 0, {
            message: 'Project name cannot be empty or contain only spaces',
        }),
    description: z
        .string()
        .max(500, 'Description must not exceed 500 characters')
        .trim()
        .optional()
        .or(z.literal(''))
        .transform((val) => (val === '' ? undefined : val)),
    client: z
        .string()
        .optional()
        .or(z.literal(''))
        .transform((val) => (val === '' ? undefined : val)),
})

type ProjectFormData = z.infer<typeof projectFormSchema>

interface ProjectDialogProps {
    project?: Project
    open: boolean
    onOpenChange: (open: boolean) => void
    onSubmit: (data: any) => void
    isLoading: boolean
}

export default function ProjectDialog({ project, open, onOpenChange, onSubmit, isLoading }: ProjectDialogProps) {    const form = useForm<ProjectFormData>({
        resolver: zodResolver(projectFormSchema),
        defaultValues: {
            name: '',
            description: '',
            client: '',
        },
        mode: 'onChange',
    })

    // Reset and populate form when project changes
    useEffect(() => {
        if (project) {
            form.reset({
                name: project.name,
                description: project.description || '',
                client: typeof project.client === 'string' ? project.client : project.client?._id || ''
            })
        } else {
            form.reset({
                name: '',
                description: '',
                client: ''
            })
        }
    }, [project, open, form])

    const handleSubmit = (data: ProjectFormData) => {
        const submitData: any = {
            name: data.name,
            description: data.description,
            client: data.client
        }        // Remove undefined values
        Object.keys(submitData).forEach(key => {
            if (submitData[key] === undefined) {
                delete submitData[key]
            }
        })

        onSubmit(submitData)
    }

    const handleClientChange = (value: InputSelectorData | InputSelectorData[]) => {
        const client = Array.isArray(value) ? value[0] : value
        if (client) {
            form.setValue('client', client.value, { shouldValidate: true })
        }
    }

    const getSelectedClient = (): InputSelectorData | undefined => {
        const clientValue = form.watch('client')
        if (project && project.client && typeof project.client === 'object' && clientValue === project.client._id) {
            return {
                label: project.client.name || '',
                value: project.client._id || ''
            }
        }
        return undefined
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {project ? 'Edit Project' : 'Create New Project'}
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Project Name *</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="Enter project name"
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
                            name="client"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Client</FormLabel>
                                    <FormControl>
                                        <ClientsSelector
                                            value={getSelectedClient()}
                                            onChange={handleClientChange}
                                            placeholder="Select a client (optional)"
                                            disabled={isLoading}
                                            className="w-full"
                                        />
                                    </FormControl>
                                    <FormDescription className="text-xs">
                                        Choose a client to associate with this project (optional)
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        /><FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            placeholder="Enter project description"
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
                                {project ? 'Update' : 'Create'} Project
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

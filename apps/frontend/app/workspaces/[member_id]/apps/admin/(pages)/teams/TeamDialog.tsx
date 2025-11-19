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
import { Textarea } from '@/components/ui/textarea'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { TbLoader2 } from 'react-icons/tb'
import { Team } from '@/types/teams.types'

const teamFormSchema = z.object({
    name: z
        .string()
        .min(1, 'Team name is required')
        .max(100, 'Team name must not exceed 100 characters')
        .trim()
        .refine((val) => val.length > 0, {
            message: 'Team name cannot be empty or contain only spaces',
        }),
    description: z
        .string()
        .max(500, 'Description must not exceed 500 characters')
        .trim()
        .optional()
        .or(z.literal(''))
        .transform((val) => (val === '' ? undefined : val)),
})

type TeamFormData = z.infer<typeof teamFormSchema>

interface TeamDialogProps {
    team?: Team
    open: boolean
    onOpenChange: (open: boolean) => void
    onSubmit: (data: any) => void
    isLoading: boolean
}

export default function TeamDialog({ team, open, onOpenChange, onSubmit, isLoading }: TeamDialogProps) {
    const form = useForm<TeamFormData>({
        resolver: zodResolver(teamFormSchema),
        defaultValues: {
            name: '',
            description: '',
        },
        mode: 'onChange',
    })

    useEffect(() => {
        if (team && open) {
            form.reset({
                name: team.name || '',
                description: team.description || '',
            })
        } else if (!team && open) {
            form.reset({
                name: '',
                description: '',
            })
        }
    }, [team, open, form])

    const handleSubmit = (data: TeamFormData) => {
        const submitData: any = {
            name: data.name.trim(),
            description: data.description?.trim() || undefined,
        }

        Object.keys(submitData).forEach(key => {
            if (submitData[key] === undefined) {
                delete submitData[key]
            }
        })

        onSubmit(submitData)
    }

    const handleOpenChange = (newOpen: boolean) => {
        if (!newOpen && !isLoading) {
            form.reset()
        }
        onOpenChange(newOpen)
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {team ? 'Edit Team' : 'Create New Team'}
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Team Name *</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter team name"
                                            disabled={isLoading}
                                            maxLength={100}
                                            {...field}
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
                                            placeholder="Enter team description"
                                            rows={3}
                                            disabled={isLoading}
                                            maxLength={500}
                                            className="resize-none"
                                            {...field}
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
                                {team ? 'Update' : 'Create'} Team
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

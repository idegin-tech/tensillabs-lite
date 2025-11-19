'use client'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { toast } from 'sonner'
import { useTasksApp } from '../contexts/tasks-app.context'
import { useCreateSpace } from '../hooks/use-space'
import useCommon from '@/hooks/use-common'
import IconSelector from '@/components/IconSelector'
import ColorSelector from '@/components/ColorSelector'
import { useRouter } from 'next13-progressbar'

const createSpaceSchema = z.object({
  name: z
    .string()
    .min(1, 'Space name is required')
    .max(100, 'Space name must not exceed 100 characters')
    .trim()
    .refine((val) => val.length > 0, {
      message: 'Space name cannot be empty or contain only spaces',
    })
    .refine((val) => !/[<>:"/\\|?*]/.test(val), {
      message: 'Space name contains invalid characters',
    }),
  description: z
    .string()
    .max(500, 'Description must not exceed 500 characters')
    .trim()
    .optional()
    .or(z.literal('')),
  color: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid color format')
    .optional(),
  icon: z
    .string()
    .min(1, 'Icon is required')
    .optional(),
})

type CreateSpaceForm = z.infer<typeof createSpaceSchema>

export default function CreateSpacePopup() {
  const router = useRouter();
  const { state, updateState } = useTasksApp()
  const { getPathToApp } = useCommon()
  const createSpace = useCreateSpace();  
  const form = useForm<CreateSpaceForm>({
    resolver: zodResolver(createSpaceSchema),
    defaultValues: {
      name: '',
      description: '',
      color: '#3B82F6',
      icon: 'fa-folder',
    },
    mode: 'onChange',
  });
  const handleClose = () => {
    form.reset({
      name: '',
      description: '',
      color: '#3B82F6',
      icon: 'fa-folder',
    })
    updateState({ showCreateSpace: false })
  }
  const onSubmit = async (values: CreateSpaceForm) => {
    try {
      const sanitizedValues = {
        ...values,
        description: values.description?.trim() || undefined,
      }
      const response = await createSpace.mutateAsync(sanitizedValues)
      toast.success('Space created successfully')
      handleClose()
      router.push(`${getPathToApp('tasks')}/spaces/${response.payload._id}`)
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || 'Failed to create space'
      toast.error(message)
    }
  }
  return (
    <Dialog open={state.showCreateSpace} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Space</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">            
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Space Name *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., Marketing Campaign, Development Team"
                      maxLength={100}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
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
                      placeholder="Describe what this space is for and what kind of work will be done here..."
                      className="resize-none"
                      rows={3}
                      maxLength={500}
                      {...field} 
                    />
                  </FormControl>
                  <div className="text-xs text-muted-foreground">
                    {field.value?.length || 0}/500 characters
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <FormControl>
                    <ColorSelector value={field.value || '#3B82F6'} onChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon</FormLabel>
                  <FormControl>
                    <IconSelector value={field.value || 'fa-folder'} onChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={handleClose} disabled={createSpace.isPending}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createSpace.isPending || !form.formState.isValid}
              >
                {createSpace.isPending ? 'Creating...' : 'Create Space'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

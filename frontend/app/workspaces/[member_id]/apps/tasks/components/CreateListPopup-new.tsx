'use client'
import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { useParams } from 'next/navigation'
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
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { TbList, TbLoader } from 'react-icons/tb'
import { useTasksApp } from '../contexts/tasks-app.context'
import { useTasksSpace } from '../contexts/tasks-space.context'
import { useApiMutation } from '@/hooks/use-api'
import { api } from '@/lib/api'
import useCommon from '@/hooks/use-common'
import type { CreateListRequest, CreateListResponse } from '@/types/spaces.types'

const createListSchema = z.object({
  name: z
    .string()
    .min(1, 'List name is required')
    .max(100, 'List name must not exceed 100 characters')
    .trim()
    .refine((val) => val.length > 0, {
      message: 'List name cannot be empty or contain only spaces',
    }),
  description: z
    .string()
    .max(500, 'Description must not exceed 500 characters')
    .trim()
    .optional()
    .or(z.literal('')),
  isPrivate: z.boolean(),
})

type CreateListForm = z.infer<typeof createListSchema>

function useCreateList() {
  const { member_id } = useCommon()
  const params = useParams()
  const spaceId = params.space_id as string
  const { refetchSpace } = useTasksSpace()

  return useApiMutation<CreateListResponse, CreateListRequest>(
    async (data) => {
      return api.post<CreateListResponse>(`/spaces/${spaceId}/lists`, data, {
        headers: {
          'x-member-id': member_id,
        },
      })
    },
    {
      onSuccess: () => {
        refetchSpace()
      },
    }
  )
}

export default function CreateListPopup() {
  const { state, updateState } = useTasksApp()
  const createList = useCreateList()
  const form = useForm<CreateListForm>({
    resolver: zodResolver(createListSchema),
    defaultValues: {
      name: '',
      description: '',
      isPrivate: false,
    },
    mode: 'onChange',
  })

  const handleClose = () => {
    form.reset({
      name: '',
      description: '',
      isPrivate: false,
    })
    updateState({ showCreateList: false })
  }

  const onSubmit = async (values: CreateListForm) => {
    try {
      const result = await createList.mutateAsync({
        name: values.name,
        description: values.description || undefined,
        isPrivate: values.isPrivate || false,
      })

      if (result.success) {
        toast.success('List created successfully!', {
          description: `"${values.name}" has been created and is ready to use.`,
        })
        handleClose()
      } else {
        toast.error('Failed to create list', {
          description: result.message || 'Please check your input and try again.',
        })
      }
    } catch (error: any) {
      toast.error('Failed to create list', {
        description: error?.message || 'An unexpected error occurred. Please try again.',
      })
    }
  }

  return (
    <Dialog open={state.showCreateList} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <TbList className="h-5 w-5" />
            </div>
            Create New List
          </DialogTitle>
          <DialogDescription>
            Create a new list to organize your tasks within this space.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>List Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter list name"
                      {...field}
                      disabled={createList.isPending}
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
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe what this list is for..."
                      className="resize-none"
                      rows={3}
                      {...field}
                      disabled={createList.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isPrivate"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={createList.isPending}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Private List</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Only you can see and access this list
                    </p>
                  </div>
                </FormItem>
              )}
            />

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 space-y-2 space-y-reverse sm:space-y-0">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={createList.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createList.isPending}>
                {createList.isPending && (
                  <TbLoader className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create List
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

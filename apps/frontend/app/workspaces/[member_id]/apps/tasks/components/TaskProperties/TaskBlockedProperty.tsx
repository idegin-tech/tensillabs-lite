'use client'

import React, { useState, useEffect } from 'react'
import { TbLock, TbAlertTriangle, TbLockOpen, TbAlertCircle, TbEdit, TbCalendar, TbUser } from 'react-icons/tb'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { TaskPropertyProps } from '.'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { BlockedReason, TaskAssignee } from '@/types/tasks.types'

const REASON_MAX_LENGTH = 100
const DESCRIPTION_MAX_LENGTH = 500

const blockedReasonSchema = z.object({
  reason: z.string()
    .min(1, 'Reason is required')
    .max(REASON_MAX_LENGTH, `Reason must be ${REASON_MAX_LENGTH} characters or less`),
  description: z.string()
    .max(DESCRIPTION_MAX_LENGTH, `Description must be ${DESCRIPTION_MAX_LENGTH} characters or less`)
    .optional(),
})

type BlockedReasonForm = z.infer<typeof blockedReasonSchema>

interface TaskBlockedPropertyProps extends TaskPropertyProps {
  value?: BlockedReason
}

export default function TaskBlockedProperty({ onChange, value }: TaskBlockedPropertyProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [localBlockedState, setLocalBlockedState] = useState<BlockedReason | null>(value || null)

  const form = useForm<BlockedReasonForm>({
    resolver: zodResolver(blockedReasonSchema),
    defaultValues: {
      reason: value?.reason || '',
      description: value?.description || '',
    },
  })

  const isBlocked = !!(localBlockedState?.reason || localBlockedState?.description)
  const reasonLength = form.watch('reason')?.length || 0
  const descriptionLength = form.watch('description')?.length || 0

  useEffect(() => {
    form.reset({
      reason: value?.reason || '',
      description: value?.description || '',
    })
    setLocalBlockedState(value || null)
  }, [value, form])

  const handleSubmit = (data: BlockedReasonForm) => {
    const newBlockedState = {
      reason: data.reason.trim(),
      description: data.description?.trim() || '',
    }
    setLocalBlockedState(newBlockedState)
    onChange?.(newBlockedState)
    setIsOpen(false)
    setIsEditing(false)
  }

  const handleClear = () => {
    form.reset({ reason: '', description: '' })
    setLocalBlockedState(null)
    onChange?.(null)
    setIsOpen(false)
    setIsEditing(false)
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    form.reset({
      reason: value?.reason || '',
      description: value?.description || '',
    })
    setIsEditing(false)
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      form.reset({
        reason: value?.reason || '',
        description: value?.description || '',
      })
      setIsEditing(false)
    } else {
      if (!isBlocked) {
        setIsEditing(true)
      }
    }
    setIsOpen(open)
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        {isBlocked ? (
          <Badge 
            variant="destructive" 
            className="cursor-pointer hover:bg-destructive/90 gap-1.5 font-normal"
          >
            <TbAlertTriangle className="h-3.5 w-3.5" />
            Blocked
          </Badge>
        ) : (
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 px-0 text-xs text-muted-foreground hover:text-foreground"
          >
            No blockers
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-96" align="start">
        <div className="space-y-4">
          {isBlocked && !isEditing ? (
            <>
              <div className="flex items-center justify-between pb-2 border-b">
                <div className="flex items-center gap-2">
                  <TbLock className="h-5 w-5 text-destructive" />
                  <h4 className="font-semibold text-sm">Task Blocked</h4>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleEdit}
                  className="h-8 px-2 text-xs"
                >
                  <TbEdit className="h-4 w-4 mr-1.5" />
                  Edit
                </Button>
              </div>

              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-muted-foreground">Reason</Label>
                  <p className="text-sm font-medium">{value?.reason || 'No reason provided'}</p>
                </div>

                {value?.description && (
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-muted-foreground">Description</Label>
                    <p className="text-sm text-foreground leading-relaxed">{value.description}</p>
                  </div>
                )}

                <Separator />

                <div className="flex flex-col gap-2 text-xs text-muted-foreground">
                  {value?.blockedAt && (
                    <div className="flex items-center gap-2">
                      <TbCalendar className="h-3.5 w-3.5" />
                      <span>Blocked on {formatDate(value.blockedAt)}</span>
                    </div>
                  )}
                  {value?.blockedByMember && (
                    <div className="flex items-center gap-2">
                      <TbUser className="h-3.5 w-3.5" />
                      <span>
                        Posted by <span className='text-foreground'>{value.blockedByMember.firstName} {value.blockedByMember.lastName}</span>
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end pt-2 border-t">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleClear}
                  className="h-8 text-xs"
                >
                  <TbLockOpen className="h-3.5 w-3.5 mr-1.5" />
                  Unblock Task
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 pb-2 border-b">
                <TbAlertCircle className="h-5 w-5 text-destructive" />
                <h4 className="font-semibold text-sm">{isBlocked ? 'Edit Block' : 'Block Task'}</h4>
              </div>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-3">
                  <FormField
                    control={form.control}
                    name="reason"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium">
                          Reason <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Waiting for client approval"
                            {...field}
                            className="h-9 text-sm"
                            autoFocus
                            maxLength={REASON_MAX_LENGTH}
                          />
                        </FormControl>
                        <div className="flex items-center justify-between">
                          <FormMessage className="text-xs" />
                          <span className={`text-xs ${reasonLength > REASON_MAX_LENGTH * 0.9 ? 'text-destructive' : 'text-muted-foreground'}`}>
                            {reasonLength}/{REASON_MAX_LENGTH}
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
                        <FormLabel className="text-xs font-medium">
                          Description
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Add more details about why this task is blocked..."
                            {...field}
                            className="min-h-[80px] text-sm resize-none"
                            maxLength={DESCRIPTION_MAX_LENGTH}
                          />
                        </FormControl>
                        <div className="flex items-center justify-between">
                          <FormMessage className="text-xs" />
                          <span className={`text-xs ${descriptionLength > DESCRIPTION_MAX_LENGTH * 0.9 ? 'text-destructive' : 'text-muted-foreground'}`}>
                            {descriptionLength}/{DESCRIPTION_MAX_LENGTH}
                          </span>
                        </div>
                      </FormItem>
                    )}
                  />

                  <div className="flex items-center justify-between pt-2 border-t">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={isBlocked ? handleCancelEdit : () => setIsOpen(false)}
                      className="h-8 text-xs text-muted-foreground"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      size="sm"
                      className="h-8 text-xs"
                    >
                      <TbLock className="h-3.5 w-3.5 mr-1.5" />
                      {isBlocked ? 'Update Block' : 'Block Task'}
                    </Button>
                  </div>
                </form>
              </Form>
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

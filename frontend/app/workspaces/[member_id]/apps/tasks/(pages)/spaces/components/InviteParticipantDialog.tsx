import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import WorkspaceMemberSelector from '@/components/WorkspaceMemberSelector'
import { useInviteSpaceParticipant } from '@/hooks/use-space-participants'
import { InputSelectorData } from '@/components/InputSelector'

const inviteParticipantSchema = z.object({
  memberId: z.string().min(1, 'Member is required'),
  permissions: z.enum(['admin', 'regular'], {
    required_error: 'Permission level is required',
  }),
})

type InviteParticipantForm = z.infer<typeof inviteParticipantSchema>

interface InviteParticipantDialogProps {
  isOpen: boolean
  onClose: () => void
  spaceId: string
}

export default function InviteParticipantDialog({
  isOpen,
  onClose,
  spaceId
}: InviteParticipantDialogProps) {
  const [selectedMember, setSelectedMember] = useState<InputSelectorData | null>(null)
  const inviteParticipant = useInviteSpaceParticipant()

  const form = useForm<InviteParticipantForm>({
    resolver: zodResolver(inviteParticipantSchema),
    defaultValues: {
      memberId: '',
      permissions: 'regular',
    },
  })

  const onSubmit = async (values: InviteParticipantForm) => {
    try {      await inviteParticipant.mutateAsync({
        spaceId,
        memberId: values.memberId,
        permissions: values.permissions,
      })

      toast.success('Participant invited successfully!')
      form.reset()
      setSelectedMember(null)
      onClose()
    } catch (error: any) {
      toast.error('Failed to invite participant', {
        description: error.message || 'An unexpected error occurred',
      })
    }
  }

  const handleMemberChange = (value: InputSelectorData | InputSelectorData[]) => {
    const member = Array.isArray(value) ? value[0] : value
    setSelectedMember(member || null)
    form.setValue('memberId', member?.value || '')
  }

  const handleClose = () => {
    form.reset()
    setSelectedMember(null)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite Participant</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="memberId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Workspace Member</FormLabel>                  <FormControl>
                    <WorkspaceMemberSelector
                      value={selectedMember || undefined}
                      onChange={handleMemberChange}
                      placeholder="Select a member to invite..."
                      disabled={inviteParticipant.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="permissions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Permission Level</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={inviteParticipant.isPending}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select permission level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="regular">Regular</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={inviteParticipant.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={inviteParticipant.isPending}>
                {inviteParticipant.isPending ? 'Inviting...' : 'Invite Participant'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

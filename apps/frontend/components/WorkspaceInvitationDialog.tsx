'use client'

import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { TbBuilding, TbLoader2, TbMail } from 'react-icons/tb'
import { WorkspaceMember, Workspace } from '@/types/workspace.types'

interface WorkspaceInvitationDialogProps {
  member: WorkspaceMember | null
  workspace: Workspace | null
  isOpen: boolean
  isAccepting: boolean
  onAccept: () => void
  onClose: () => void
}

export default function WorkspaceInvitationDialog({
  member,
  workspace,
  isOpen,
  isAccepting,
  onAccept,
  onClose
}: WorkspaceInvitationDialogProps) {
  if (!member || !workspace) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-primary/10 rounded-lg p-3">
              {workspace.logoURL ? (
                <img 
                  src={workspace.logoURL} 
                  alt={workspace.name}
                  className="h-8 w-8 object-cover rounded"
                />
              ) : (
                <TbBuilding className="h-8 w-8 text-primary" />
              )}
            </div>
            <div>
              <DialogTitle className="text-left">Join Workspace</DialogTitle>
              <DialogDescription className="text-left">
                You've been invited to collaborate
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <TbMail className="h-4 w-4" />
              Workspace Invitation
            </div>
            <h3 className="font-semibold text-lg">{workspace.name}</h3>
            {workspace.description && (
              <p className="text-sm text-muted-foreground mt-1">
                {workspace.description}
              </p>
            )}
          </div>
          
          <div className="text-sm text-muted-foreground">
            <p>
              <strong>{member.firstName} {member.lastName}</strong> has been invited to join <strong>{workspace.name}</strong> as a <strong>{member.permission}</strong>.
            </p>
            <p className="mt-2">
              Would you like to accept this invitation and start collaborating?
            </p>
          </div>
        </div>

        <DialogFooter className="sm:justify-between">
          <Button variant="outline" onClick={onClose} disabled={isAccepting}>
            Not Now
          </Button>
          <Button onClick={onAccept} disabled={isAccepting}>
            {isAccepting ? (
              <>
                <TbLoader2 className="h-4 w-4 mr-2 animate-spin" />
                Accepting...
              </>
            ) : (
              'Accept Invitation'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

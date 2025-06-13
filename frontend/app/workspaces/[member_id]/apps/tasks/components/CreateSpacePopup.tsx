'use client'
import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { useTasksApp } from '../contexts/tasks-app.context'
import IconSelector from '@/components/IconSelector'
import ColorSelector from '@/components/ColorSelector'

export default function CreateSpacePopup() {
  const { state, updateState } = useTasksApp()
  const [selectedColor, setSelectedColor] = useState('#3B82F6')
  const [selectedIcon, setSelectedIcon] = useState('fas fa-folder')
  const handleClose = () => {
    updateState({ showCreateSpace: false })
  }

  return (
    <Dialog open={state.showCreateSpace} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Space</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="space-name">Space Name</Label>
            <Input
              id="space-name"
              placeholder="Enter space name"
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="space-description">Description</Label>
            <Textarea
              id="space-description"
              placeholder="Enter space description (optional)"
              className="w-full"
              rows={3}
            />
          </div>          <div className="space-y-3">
            <Label>Color</Label>
            <ColorSelector value={selectedColor} onChange={setSelectedColor} />
          </div>

          <div className="space-y-3">
            <Label>Icon</Label>
            <IconSelector value={selectedIcon} onChange={setSelectedIcon} />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button>
              Create Space
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

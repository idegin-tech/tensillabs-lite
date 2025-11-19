'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

interface RemarkDialogProps {
    isOpen: boolean
    onClose: () => void
    onSave: (remark: string) => void
    currentRemark?: string
    title?: string
    description?: string
    isRequired?: boolean
}

export default function RemarkDialog({
    isOpen,
    onClose,
    onSave,
    currentRemark = '',
    title = 'Add Remark',
    description = 'Please provide a remark for this attendance record.',
    isRequired = false
}: RemarkDialogProps) {
    const [remark, setRemark] = useState(currentRemark)

    useEffect(() => {
        setRemark(currentRemark)
    }, [currentRemark, isOpen])

    const handleSave = () => {
        if (isRequired && !remark.trim()) {
            return
        }
        onSave(remark.trim())
        handleClose()
    }

    const handleClose = () => {
        setRemark(currentRemark)
        onClose()
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="remark">
                            Remark {isRequired ? <span className="text-destructive">*</span> : <span>{`(Optional)`}</span>}
                        </Label>
                        <Textarea
                            id="remark"
                            placeholder="Enter your remark here..."
                            value={remark}
                            onChange={(e) => setRemark(e.target.value)}
                            maxLength={500}
                            rows={4}
                            className="resize-none"
                        />
                        <p className="text-xs text-muted-foreground">
                            {remark.length}/500 characters
                        </p>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleSave}
                        disabled={isRequired && !remark.trim()}
                    >
                        Save Remark
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

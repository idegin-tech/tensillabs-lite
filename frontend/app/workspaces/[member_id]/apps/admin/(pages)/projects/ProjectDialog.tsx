import React, { useState, useEffect } from 'react'
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
import { TbLoader2 } from 'react-icons/tb'
import { Project } from '@/types/projects.types'
import { toast } from 'sonner'
import ClientsSelector from '@/components/ClientsSelector'
import { InputSelectorData } from '@/components/InputSelector'

interface ProjectDialogProps {
    project?: Project
    open: boolean
    onOpenChange: (open: boolean) => void
    onSubmit: (data: any) => void
    isLoading: boolean
}

export default function ProjectDialog({ project, open, onOpenChange, onSubmit, isLoading }: ProjectDialogProps) {
    const [formData, setFormData] = useState({
        name: project?.name || '',
        description: project?.description || '',
        client: typeof project?.client === 'string' ? project.client : project?.client?._id || ''
    })
    const [selectedClient, setSelectedClient] = useState<InputSelectorData | undefined>(undefined)

    useEffect(() => {
        if (project) {
            setFormData({
                name: project.name,
                description: project.description || '',
                client: typeof project.client === 'string' ? project.client : project.client?._id || ''
            })
              if (project.client && typeof project.client === 'object') {
                setSelectedClient({
                    label: project.client.name || '',
                    value: project.client._id || ''
                })
            }
        } else {
            setFormData({
                name: '',
                description: '',
                client: ''
            })
            setSelectedClient(undefined)
        }
    }, [project, open])

    const handleClientChange = (client: InputSelectorData) => {
        setSelectedClient(client)
        setFormData(prev => ({ ...prev, client: client.value }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.name.trim()) {
            toast.error('Please enter a project name')
            return
        }
        const submitData: any = {
            name: formData.name.trim(),
            description: formData.description.trim() || undefined,
            client: formData.client.trim() || undefined
        }

        Object.keys(submitData).forEach(key => {
            if (submitData[key] === undefined) {
                delete submitData[key]
            }
        })

        onSubmit(submitData)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {project ? 'Edit Project' : 'Create New Project'}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Project Name *</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Enter project name"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="client">Client</Label>
                        <ClientsSelector
                            value={selectedClient}
                            onChange={handleClientChange}
                            placeholder="Select a client (optional)"
                            disabled={isLoading}
                            className="w-full"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Enter project description"
                            rows={3}
                        />
                    </div>
                    <div className="flex justify-end space-x-2 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isLoading}
                        >
                            Cancel                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading && <TbLoader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {project ? 'Update' : 'Create'} Project
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

'use client'

import { useState } from 'react'
import { TbPlayerPlayFilled, TbPlayerStopFilled } from 'react-icons/tb'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

interface TimeEntryFormProps {
    onStartTimer?: () => void
    isTimerRunning?: boolean
}

export default function TimeEntryForm({ 
    onStartTimer, 
    isTimerRunning = false 
}: TimeEntryFormProps) {
    const [description, setDescription] = useState('')
    const [selectedProject, setSelectedProject] = useState<string>()

    const mockProjects = [
        { id: '1', name: 'Website Redesign' },
        { id: '2', name: 'Mobile App Development' },
        { id: '3', name: 'API Integration' },
        { id: '4', name: 'Marketing Campaign' },
    ]

    return (
        <Card className='mb-16 border-2 shadow-sm'>
            <CardContent className='p-6'>
                <div className='grid gap-6 md:grid-cols-[1fr_auto] items-start'>
                    <div className='space-y-4'>
                        <div className='space-y-2'>
                            <Label htmlFor='description'>What are you working on?</Label>
                            <textarea
                                id='description'
                                placeholder='e.g., Creating proposals for new clients'
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className='w-full text-2xl font-medium placeholder:text-muted-foreground/40 bg-transparent border-0 outline-none resize-none focus:ring-0 p-0 min-h-[80px]'
                                rows={3}
                            />
                        </div>

                        <div className='space-y-2 max-w-xs'>
                            <Label htmlFor='project' className='text-sm text-muted-foreground'>Project (Optional)</Label>
                            <Select value={selectedProject} onValueChange={setSelectedProject}>
                                <SelectTrigger id='project' className='h-10'>
                                    <SelectValue placeholder='Select a project' />
                                </SelectTrigger>
                                <SelectContent>
                                    {mockProjects.map((project) => (
                                        <SelectItem key={project.id} value={project.id}>
                                            {project.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className='flex flex-col items-center gap-4 pt-8'>
                        <div className='text-5xl font-bold tabular-nums tracking-tight text-muted-foreground'>
                            00:00:00
                        </div>

                        <button
                            onClick={onStartTimer}
                            disabled={!description.trim()}
                            className={`h-20 w-20 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed ${
                                isTimerRunning 
                                    ? 'bg-red-500 hover:bg-red-600' 
                                    : 'bg-primary hover:bg-primary/90'
                            }`}
                        >
                            {isTimerRunning ? (
                                <TbPlayerStopFilled className='h-10 w-10 text-white' />
                            ) : (
                                <TbPlayerPlayFilled className='h-10 w-10 ml-1 text-white' />
                            )}
                        </button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

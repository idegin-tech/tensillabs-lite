'use client'

import React from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { TbClock, TbEdit, TbPlus, TbCheck, TbX, TbFlag, TbUsers } from 'react-icons/tb'

const activities = [
  {
    id: '1',
    type: 'status_change',
    user: { name: 'John Doe', avatar: null, initials: 'JD' },
    action: 'changed status from',
    details: { from: 'To Do', to: 'In Progress' },
    timestamp: '2 hours ago'
  },
  {
    id: '2',
    type: 'assignee_added',
    user: { name: 'Sarah Wilson', avatar: null, initials: 'SW' },
    action: 'assigned',
    details: { assignee: 'Mike Chen' },
    timestamp: '4 hours ago'
  },
  {
    id: '3',
    type: 'priority_change',
    user: { name: 'Alex Rodriguez', avatar: null, initials: 'AR' },
    action: 'changed priority from',
    details: { from: 'Normal', to: 'High' },
    timestamp: '1 day ago'
  },
  {
    id: '4',
    type: 'task_created',
    user: { name: 'Emily Johnson', avatar: null, initials: 'EJ' },
    action: 'created this task',
    details: {},
    timestamp: '3 days ago'
  }
]

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'status_change':
      return <TbCheck className="h-4 w-4 text-blue-600" />
    case 'assignee_added':
      return <TbUsers className="h-4 w-4 text-green-600" />
    case 'priority_change':
      return <TbFlag className="h-4 w-4 text-orange-600" />
    case 'task_created':
      return <TbPlus className="h-4 w-4 text-purple-600" />
    default:
      return <TbEdit className="h-4 w-4 text-gray-600" />
  }
}

const getActivityDetails = (activity: any) => {
  switch (activity.type) {
    case 'status_change':
      return (
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">{activity.details.from}</Badge>
          <span className="text-muted-foreground">to</span>
          <Badge variant="default" className="text-xs">{activity.details.to}</Badge>
        </div>
      )
    case 'assignee_added':
      return (
        <Badge variant="outline" className="text-xs">{activity.details.assignee}</Badge>
      )
    case 'priority_change':
      return (
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">{activity.details.from}</Badge>
          <span className="text-muted-foreground">to</span>
          <Badge variant="destructive" className="text-xs">{activity.details.to}</Badge>
        </div>
      )
    default:
      return null
  }
}

export default function TaskActivities() {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b bg-background/80 backdrop-blur-sm">
        <h3 className="font-semibold text-lg">Activity Timeline</h3>
        <p className="text-sm text-muted-foreground">Track all changes and updates to this task</p>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6">
          {activities.map((activity, index) => (
            <div key={activity.id} className="flex gap-3 group">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center group-hover:bg-accent transition-colors">
                  {getActivityIcon(activity.type)}
                </div>
                {index < activities.length - 1 && (
                  <div className="w-px h-6 bg-border mt-2" />
                )}
              </div>
              
              <div className="flex-1 min-w-0 pb-4">
                <div className="flex items-start gap-3 mb-2">                  <Avatar className="h-6 w-6">
                    <AvatarImage src={activity.user.avatar || undefined} />
                    <AvatarFallback className="text-xs">{activity.user.initials}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-sm">{activity.user.name}</span>
                      <span className="text-muted-foreground text-sm">{activity.action}</span>
                      {getActivityDetails(activity)}
                    </div>
                    
                    <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                      <TbClock className="h-3 w-3" />
                      <span>{activity.timestamp}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {activities.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <TbClock className="h-6 w-6 text-muted-foreground" />
            </div>
            <h4 className="font-medium mb-2">No activity yet</h4>
            <p className="text-sm text-muted-foreground">Task activity will appear here as changes are made</p>
          </div>
        )}
      </ScrollArea>
    </div>
  )
}

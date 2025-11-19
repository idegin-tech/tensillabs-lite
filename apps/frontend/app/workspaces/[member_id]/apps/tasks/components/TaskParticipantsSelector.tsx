'use client'
import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Check, ChevronDown, Loader2, X, Plus } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { useWorkspaceMembers } from '@/hooks/use-workspace-members'
import type { WorkspaceMember } from '@/types/workspace.types'
import type { TaskAssignee } from '@/types/tasks.types'

interface TaskParticipantsSelectorProps {
  value: TaskAssignee[]
  onChange: (assignees: TaskAssignee[]) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  maxVisible?: number
  avatarSize?: 'sm' | 'md' | 'lg'
}

export default function TaskParticipantsSelector({
  value = [],
  onChange,
  placeholder = "Assign to...",
  disabled = false,
  className,
  maxVisible = 3,
  avatarSize = 'sm'
}: TaskParticipantsSelectorProps) {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [pendingValue, setPendingValue] = useState<TaskAssignee[]>(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchTerm])

  useEffect(() => {
    setPendingValue(value)
  }, [value])

  const getAvatarSizeClasses = () => {
    switch (avatarSize) {
      case 'sm':
        return 'h-6 w-6'
      case 'md':
        return 'h-8 w-8'
      case 'lg':
        return 'h-10 w-10'
      default:
        return 'h-6 w-6'
    }
  }

  const getAvatarSpacing = () => {
    switch (avatarSize) {
      case 'sm':
        return '-space-x-2'
      case 'md':
        return '-space-x-2'
      case 'lg':
        return '-space-x-3'
      default:
        return '-space-x-2'
    }  }

  const { members, isLoading } = useWorkspaceMembers({
    search: debouncedSearchTerm,
    limit: 50,
    status: 'active'
  })
  const getDisplayName = (member: WorkspaceMember) => {
    const firstName = member.firstName?.trim() || ''
    const lastName = member.lastName?.trim() || ''
    const fullName = `${firstName} ${lastName}`.trim()
    return fullName || member.primaryEmail || 'Unknown'  }
  
  const getInitials = (member: WorkspaceMember) => {
    if (member.firstName && member.firstName.length > 0 && member.lastName && member.lastName.length > 0) {
      return `${member.firstName[0]}${member.lastName[0]}`.toUpperCase()
    }
    if (member.firstName && member.firstName.length > 0) {
      return member.firstName[0].toUpperCase()
    }
    if (member.lastName && member.lastName.length > 0) {
      return member.lastName[0].toUpperCase()
    }
    if (member.primaryEmail && member.primaryEmail.length > 0) {
      return member.primaryEmail[0].toUpperCase()
    }
    return 'U'  }

  const getAssigneeDisplayName = (assignee: TaskAssignee) => {
    const firstName = assignee.firstName?.trim() || ''
    const lastName = assignee.lastName?.trim() || ''
    const fullName = `${firstName} ${lastName}`.trim()
    return fullName || assignee.primaryEmail || 'Unknown User'
  }

  const getAssigneeInitials = (assignee: TaskAssignee) => {
    if (assignee.firstName && assignee.firstName.length > 0 && assignee.lastName && assignee.lastName.length > 0) {
      return `${assignee.firstName[0]}${assignee.lastName[0]}`.toUpperCase()
    }
    if (assignee.firstName && assignee.firstName.length > 0) {
      return assignee.firstName[0].toUpperCase()
    }
    if (assignee.lastName && assignee.lastName.length > 0) {
      return assignee.lastName[0].toUpperCase()
    }
    if (assignee.primaryEmail && assignee.primaryEmail.length > 0) {
      return assignee.primaryEmail[0].toUpperCase()
    }
    return 'U'
  }

  const convertMemberToAssignee = (member: WorkspaceMember): TaskAssignee => ({
    _id: member._id,
    firstName: member.firstName,
    lastName: member.lastName,
    primaryEmail: member.primaryEmail,
    avatarURL: member.avatarURL
  })
  const isSelected = (memberId: string) => {
    return pendingValue.some(assignee => assignee._id === memberId)
  }

  const handleSelect = (member: WorkspaceMember) => {
    const assignee = convertMemberToAssignee(member)
    if (isSelected(member._id)) {
      setPendingValue(pendingValue.filter(a => a._id !== member._id))
    } else {
      setPendingValue([...pendingValue, assignee])
    }
  }

  const handleRemove = (assigneeId: string, e?: React.MouseEvent) => {
    e?.preventDefault()
    e?.stopPropagation()
    setPendingValue(pendingValue.filter(a => a._id !== assigneeId))
  }

  const handleOpenChange = (open: boolean) => {
    setOpen(open)
    
    if (!open) {
      onChange(pendingValue)
    }
  }
  
  const renderSelectedAvatars = () => {
    if (value.length === 0) return null

    const visibleAssignees = value.slice(0, maxVisible)
    const remainingCount = value.length - maxVisible

    return (
      <TooltipProvider>
        <div className="flex items-center gap-1">
          <div className={cn("flex", getAvatarSpacing())}>          
            {visibleAssignees.map((assignee) => (
              <React.Fragment key={assignee._id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Avatar className={cn(getAvatarSizeClasses(), "border-2 border-background")}>
                      <AvatarImage
                        src={assignee.avatarURL?.sm || undefined}
                        alt={`${assignee.firstName} ${assignee.lastName}`}
                      />            
                      <AvatarFallback className="text-xs bg-primary/10 text-primary font-medium">
                        {getAssigneeInitials(assignee)}
                      </AvatarFallback>
                    </Avatar>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{getAssigneeDisplayName(assignee)}</p>
                  </TooltipContent>
                </Tooltip>
              </React.Fragment>
            ))}
          </div>
          {remainingCount > 0 && (
            <Badge variant="secondary" className="h-6 min-w-6 text-xs">
              +{remainingCount}
            </Badge>
          )}
        </div>
      </TooltipProvider>
    )
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "h-8 w-full justify-start font-normal hover:bg-muted/50 px-0",
            !value.length && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          {value.length > 0 ? (
            renderSelectedAvatars()
          ) : (
            <span className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              {placeholder}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <Command>
          <CommandInput
            placeholder="Search members..."
            value={searchTerm}
            onValueChange={setSearchTerm}
          />
          <CommandList>
            {isLoading ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            ) : (
              <>
                <CommandEmpty>No members found.</CommandEmpty>
                <CommandGroup>
                  {members.map((member) => (
                    <CommandItem
                      key={member._id}
                      value={getDisplayName(member)}
                      onSelect={() => handleSelect(member)}
                      className="flex items-center gap-3 py-2"
                    >                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={member.avatarURL?.sm || undefined}
                          alt={getDisplayName(member)}
                        />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {getInitials(member)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {getDisplayName(member)}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {member.primaryEmail}
                        </p>
                      </div>
                      <Check
                        className={cn(
                          "h-4 w-4",
                          isSelected(member._id) ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>        {pendingValue.length > 0 && (
          <div className="border-t p-3">
            <div className="text-xs text-muted-foreground mb-2">
              Assigned ({pendingValue.length})
            </div>
            <div className="flex flex-wrap gap-1">              {pendingValue.map((assignee) => (
                <Badge key={assignee._id} variant="secondary" className="gap-1">                  <Avatar className="h-4 w-4">
                  <AvatarImage
                    src={assignee.avatarURL?.sm || undefined}
                    alt={`${assignee.firstName} ${assignee.lastName}`}
                  />                  <AvatarFallback className="text-xs bg-primary/10 text-primary">
                    {getAssigneeInitials(assignee)}
                  </AvatarFallback>
                </Avatar>                  <span className="text-xs">
                    {getAssigneeDisplayName(assignee)}
                  </span>
                  <button
                    onClick={(e) => handleRemove(assignee._id, e)}
                    className="ml-1 hover:bg-muted rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}

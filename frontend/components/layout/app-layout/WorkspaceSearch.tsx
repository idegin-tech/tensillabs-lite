'use client'

import React, { useState } from 'react'
import { 
    SearchIcon, 
    FileIcon, 
    FolderIcon, 
    UserIcon, 
    SettingsIcon, 
    ClockIcon,
    MessageSquareIcon,
    CalendarIcon,
    BrainIcon,
    CommandIcon,
    HashIcon
} from 'lucide-react'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from '@/components/ui/button'
import { useIsMobile } from '@/hooks/use-mobile'

export default function WorkspaceSearch() {
    const [open, setOpen] = useState(false)
    const isMobile = useIsMobile()

    // Keyboard shortcut handler
    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }
        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    return (
        <div className={isMobile ? "flex-1" : "flex-1 max-w-2xl mx-auto "}>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    {isMobile ? (
                        <Button
                            size="icon"
                            variant="ghost"
                            role="combobox"
                            aria-expanded={open}
                            className="h-9 w-9 hover:bg-muted/70 focus-visible:ring-1 focus-visible:ring-ring transition-all duration-200"
                        >
                            <SearchIcon className="h-4 w-4" />
                            <span className="sr-only">Search</span>
                        </Button>
                    ) : (
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className="w-full justify-start text-sm text-muted-foreground h-9 bg-muted/50 border-0 hover:bg-muted/70 focus-visible:ring-1 focus-visible:ring-ring transition-all duration-200"
                        >
                            <SearchIcon className="mr-2 h-4 w-4 shrink-0" />
                            Search everywhere...
                            <CommandShortcut className="ml-auto">⌘K</CommandShortcut>
                        </Button>
                    )}
                </PopoverTrigger>
                <PopoverContent 
                    className={"max-w-screen md:w-[670px] p-0"} 
                    align={isMobile ? "center" : "center"}
                    // side={isMobile ? "bottom" : "bottom"}
                    sideOffset={-40}
                    avoidCollisions={false}
                    onOpenAutoFocus={(e) => {
                        e.preventDefault()
                    }}
                    // style={isMobile ? { left: '-1rem', right: '-1rem' } : undefined}
                >
                    <Command className='md:min-w-[600px] min-w-screen'>
                        <CommandInput placeholder="Search for anything..." autoFocus />
                        <CommandList>
                            <CommandEmpty>No results found.</CommandEmpty>
                            
                            <CommandGroup heading="Quick Actions">
                                <CommandItem>
                                    <FileIcon className="mr-2 h-4 w-4" />
                                    <span>New Document</span>
                                    <CommandShortcut>⌘N</CommandShortcut>
                                </CommandItem>
                                <CommandItem>
                                    <FolderIcon className="mr-2 h-4 w-4" />
                                    <span>New Folder</span>
                                    <CommandShortcut>⌘⇧N</CommandShortcut>
                                </CommandItem>
                                <CommandItem>
                                    <MessageSquareIcon className="mr-2 h-4 w-4" />
                                    <span>Start Chat</span>
                                </CommandItem>
                            </CommandGroup>
                            
                            <CommandSeparator />
                            
                            <CommandGroup heading="Navigation">
                                <CommandItem>
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    <span>Calendar</span>
                                    <CommandShortcut>⌘C</CommandShortcut>
                                </CommandItem>
                                <CommandItem>
                                    <ClockIcon className="mr-2 h-4 w-4" />
                                    <span>Timesheet</span>
                                    <CommandShortcut>⌘T</CommandShortcut>
                                </CommandItem>
                                <CommandItem>
                                    <BrainIcon className="mr-2 h-4 w-4" />
                                    <span>AI Assistant</span>
                                    <CommandShortcut>⌘A</CommandShortcut>
                                </CommandItem>
                                <CommandItem>
                                    <UserIcon className="mr-2 h-4 w-4" />
                                    <span>People</span>
                                    <CommandShortcut>⌘P</CommandShortcut>
                                </CommandItem>
                            </CommandGroup>
                            
                            <CommandSeparator />
                            
                            <CommandGroup heading="Recent">
                                <CommandItem>
                                    <HashIcon className="mr-2 h-4 w-4" />
                                    <span>Project Alpha - Task Board</span>
                                    <CommandShortcut>2 min ago</CommandShortcut>
                                </CommandItem>
                                <CommandItem>
                                    <FileIcon className="mr-2 h-4 w-4" />
                                    <span>Meeting Notes - Q1 Planning</span>
                                    <CommandShortcut>15 min ago</CommandShortcut>
                                </CommandItem>
                                <CommandItem>
                                    <MessageSquareIcon className="mr-2 h-4 w-4" />
                                    <span>Design Team Chat</span>
                                    <CommandShortcut>1 hour ago</CommandShortcut>
                                </CommandItem>
                            </CommandGroup>
                            
                            <CommandSeparator />
                            
                            <CommandGroup heading="Settings">
                                <CommandItem>
                                    <SettingsIcon className="mr-2 h-4 w-4" />
                                    <span>Preferences</span>
                                    <CommandShortcut>⌘,</CommandShortcut>
                                </CommandItem>
                                <CommandItem>
                                    <CommandIcon className="mr-2 h-4 w-4" />
                                    <span>Command Palette</span>
                                    <CommandShortcut>⌘K</CommandShortcut>
                                </CommandItem>
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    )
}

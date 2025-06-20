import React from 'react'
import { Input } from './ui/input'
import { cn } from '@/lib/utils'
import { Button } from './ui/button'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './ui/command'
import { Check, ChevronDown, Loader2, AlertCircle, Building2, X } from 'lucide-react'
import { Skeleton } from './ui/skeleton'
import { Badge } from './ui/badge'

// Placeholder SVG component for when no image is available
const PlaceholderImage = ({ className }: { className?: string }) => (
    <svg 
        className={cn("text-muted-foreground", className)} 
        fill="currentColor" 
        viewBox="0 0 16 16" 
        xmlns="http://www.w3.org/2000/svg"
    >
        <path 
            d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
        <path 
            d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12z"/>
    </svg>
)

export type InputSelectorData = {
    label: string;
    value: string;
    imageURL?: string;
    description?: string;
}

type Props = {
    options: InputSelectorData[];
    onChange: (value: InputSelectorData | InputSelectorData[]) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
    value?: InputSelectorData | InputSelectorData[];
    showImage?: boolean;
    isLoading?: boolean;
    hasError?: boolean;
    onRetry?: () => void;
    searchPlaceholder?: string;
    emptyMessage?: string;
    onSearchChange?: (search: string) => void;
    onOpenChange?: (open: boolean) => void;
    isMulti?: boolean;
}

export default function InputSelector({
    options,
    onChange,
    placeholder = 'Select an option',
    disabled = false,
    className = '',
    value = undefined,
    showImage = false,
    isLoading = false,
    hasError = false,    onRetry,
    searchPlaceholder = 'Search options...',
    emptyMessage = 'No options found.',
    onSearchChange,
    onOpenChange,
    isMulti = false
}: Props) {
    const [open, setOpen] = React.useState(false)
    const [searchValue, setSearchValue] = React.useState('')

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen)          
        onOpenChange?.(newOpen)
    }

    React.useEffect(() => {
        if (onSearchChange) {
            const timeoutId = setTimeout(() => {
                onSearchChange(searchValue)
            }, 400)
            return () => clearTimeout(timeoutId)
        }
    }, [searchValue, onSearchChange])

    const handleSelect = (selectedValue: string) => {
        const selectedOption = options.find(option => option.value === selectedValue)
        if (selectedOption) {
            if (isMulti) {
                const currentValues = Array.isArray(value) ? value : []
                const isAlreadySelected = currentValues.some(v => v.value === selectedOption.value)
                
                if (isAlreadySelected) {
                    const newValues = currentValues.filter(v => v.value !== selectedOption.value)
                    onChange(newValues)
                } else {
                    onChange([...currentValues, selectedOption])
                }
            } else {                onChange(selectedOption)
                handleOpenChange(false)
                setSearchValue('')
            }
        }
    }

    const renderTriggerContent = () => {
        if (isMulti && Array.isArray(value) && value.length > 0) {
            if (value.length === 1) {
                const singleValue = value[0]
                return (
                    <div className="flex items-center gap-2 flex-1">
                        {showImage && (
                            <div className="flex-shrink-0">
                                {singleValue.imageURL ? (
                                    <div 
                                        className="h-6 w-6 rounded-full bg-muted bg-cover bg-center"
                                        style={{ backgroundImage: `url(${singleValue.imageURL})` }}
                                    />
                                ) : (
                                    <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center">
                                        <PlaceholderImage className="h-3 w-3" />
                                    </div>
                                )}
                            </div>
                        )}
                        <div className="flex flex-col items-start flex-1 min-w-0">
                            <span className="text-sm font-medium truncate">{singleValue.label}</span>
                            {singleValue.description && (
                                <span className="text-xs text-muted-foreground truncate">
                                    {singleValue.description}
                                </span>
                            )}
                        </div>
                    </div>
                )
            } else {
                const remaining = value.length - 1
                return (
                    <div className="flex items-center gap-2 flex-1">
                        <span className="text-sm font-medium truncate">
                            {value[0].label}{remaining > 0 && `, +${remaining} more...`}
                        </span>
                    </div>
                )
            }
        } else if (!isMulti && value && !Array.isArray(value)) {
            return (
                <div className="flex items-center gap-2 flex-1">
                    {showImage && (
                        <div className="flex-shrink-0">
                            {value.imageURL ? (
                                <div 
                                    className="h-6 w-6 rounded-full bg-muted bg-cover bg-center"
                                    style={{ backgroundImage: `url(${value.imageURL})` }}
                                />
                            ) : (
                                <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center">
                                    <PlaceholderImage className="h-3 w-3" />
                                </div>
                            )}
                        </div>
                    )}
                    <div className="flex flex-col items-start flex-1 min-w-0">
                        <span className="text-sm font-medium truncate">{value.label}</span>
                        {value.description && (
                            <span className="text-xs text-muted-foreground truncate">
                                {value.description}
                            </span>
                        )}
                    </div>
                </div>
            )
        }
        return <span className="text-muted-foreground">{placeholder}</span>
    }

    const renderCommandContent = () => {
        if (hasError) {
            return (
                <div className="flex flex-col items-center justify-center py-6 px-4 space-y-3">
                    <AlertCircle className="h-8 w-8 text-destructive" />
                    <div className="text-center space-y-2">
                        <p className="text-sm font-medium text-foreground">Failed to load options</p>
                        <p className="text-xs text-muted-foreground">There was an error loading the data</p>
                    </div>
                    {onRetry && (
                        <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={onRetry}
                            className="h-8"
                        >
                            Try again
                        </Button>
                    )}
                </div>
            )
        }        if (isLoading) {
            return (
                <>
                    <CommandInput 
                        placeholder={searchPlaceholder}
                        value={searchValue}
                        onValueChange={setSearchValue}
                    />
                    <CommandList>
                        <div className="p-3">
                            <div className="space-y-3">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <div key={i} className="flex items-center gap-3 p-2">
                                        {showImage && (
                                            <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
                                        )}
                                        <div className="flex flex-col flex-1 space-y-2">
                                            <Skeleton className={cn("h-4", i % 2 === 0 ? "w-3/4" : "w-2/3")} />
                                            <Skeleton className={cn("h-3", i % 3 === 0 ? "w-1/2" : "w-2/3")} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CommandList>
                </>
            )
        }

        return (
            <>
                <CommandInput 
                    placeholder={searchPlaceholder}
                    value={searchValue}
                    onValueChange={setSearchValue}
                />
                <CommandList>
                    <CommandEmpty>{emptyMessage}</CommandEmpty>
                    <CommandGroup>
                        {options.map((option) => (
                            <CommandItem
                                key={option.value}
                                value={option.value}
                                onSelect={handleSelect}
                                className="flex items-center gap-2 p-2"
                            >
                                {showImage && (
                                    <div className="flex-shrink-0">
                                        {option.imageURL ? (
                                            <div 
                                                className="h-8 w-8 rounded-full bg-muted bg-cover bg-center"
                                                style={{ backgroundImage: `url(${option.imageURL})` }}
                                            />                                        ) : (
                                            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                                                <PlaceholderImage className="h-4 w-4" />
                                            </div>
                                        )}
                                    </div>
                                )}
                                <div className="flex flex-col flex-1 min-w-0">
                                    <span className="text-sm font-medium truncate">{option.label}</span>
                                    {option.description && (
                                        <span className="text-xs text-muted-foreground truncate">
                                            {option.description}
                                        </span>
                                    )}
                                </div>                                <Check
                                    className={cn(
                                        "ml-auto h-4 w-4",
                                        (() => {
                                            if (isMulti && Array.isArray(value)) {
                                                return value.some(v => v.value === option.value) ? "opacity-100" : "opacity-0"
                                            } else if (!isMulti && value && !Array.isArray(value)) {
                                                return value.value === option.value ? "opacity-100" : "opacity-0"
                                            }
                                            return "opacity-0"
                                        })()
                                    )}
                                />
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </CommandList>
            </>
        )
    }

    return (
        <div className={cn("relative", className)}>
            <Popover open={open} onOpenChange={handleOpenChange}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}                        className={cn(
                            "w-full justify-between h-auto min-h-9 px-3 py-2",
                            (!value || (Array.isArray(value) && value.length === 0)) && "text-muted-foreground",
                            disabled && "cursor-not-allowed opacity-50"
                        )}
                        disabled={disabled}
                    >
                        {renderTriggerContent()}
                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                    <Command>
                        {renderCommandContent()}
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    )
}

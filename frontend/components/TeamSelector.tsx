import React from 'react'
import InputSelector, { InputSelectorData } from './InputSelector'
import { useTeams } from '@/hooks/use-teams'
import { BaseSelectorProps } from '@/types/selector.types'

interface TeamSelectorProps extends BaseSelectorProps {}

export default function TeamSelector({
    value,
    onChange,
    placeholder = "Select a team...",
    disabled = false,
    className,
    isMulti = false
}: TeamSelectorProps) {
    const [searchTerm, setSearchTerm] = React.useState('')
    const [debouncedSearchTerm, setDebouncedSearchTerm] = React.useState('')
    const [isOpen, setIsOpen] = React.useState(false)

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm)
        }, 400)

        return () => clearTimeout(timer)    }, [searchTerm])

    const { teams, isLoading, error, refetch } = useTeams({
        search: debouncedSearchTerm,
        limit: 50,
        isActive: 'true'
    }, {
        enabled: isOpen
    });
    
    const options: InputSelectorData[] = React.useMemo(() => {
        return teams.map(team => ({
            label: team.name,
            value: team._id,
            description: team.description || 'No description'
        }))
    }, [teams])

    const handleSearchChange = (search: string) => {
        setSearchTerm(search)
    }

    const handleRetry = () => {
        refetch()
    }

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open)
    }

    return (
        <InputSelector
            options={options}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            className={className}
            showImage={false}
            isLoading={isLoading}
            hasError={!!error}
            onRetry={handleRetry}
            searchPlaceholder="Search teams..."
            emptyMessage="No teams found."
            onSearchChange={handleSearchChange}
            onOpenChange={handleOpenChange}
            isMulti={isMulti}
        />
    )
}

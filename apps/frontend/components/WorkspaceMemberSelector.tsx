import React from 'react'
import InputSelector, { InputSelectorData } from './InputSelector'
import { useWorkspaceMembers } from '@/hooks/use-workspace-members'
import { BaseSelectorProps } from '@/types/selector.types'

interface WorkspaceMemberSelectorProps extends BaseSelectorProps {}

export default function WorkspaceMemberSelector({
    value,
    onChange,
    placeholder = "Select a member...",
    disabled = false,
    className,
    isMulti = false
}: WorkspaceMemberSelectorProps) {
    const [searchTerm, setSearchTerm] = React.useState('')
    const [debouncedSearchTerm, setDebouncedSearchTerm] = React.useState('')
    const [isOpen, setIsOpen] = React.useState(false)

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm)
        }, 400)

        return () => clearTimeout(timer)
    }, [searchTerm])

    const { members, isLoading, error, refetch } = useWorkspaceMembers({
        search: debouncedSearchTerm,
        limit: 50,
        status: 'active'
    })
    
    const options: InputSelectorData[] = React.useMemo(() => {
        return members.map(member => ({
            label: `${member.firstName} ${member.lastName}`,
            value: member._id,
            description: member.primaryEmail
        }))
    }, [members])

    const handleSearchChange = (search: string) => {
        setSearchTerm(search)
    }

    const handleRetry = () => {
        refetch()
    }

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open)
        if (open && !debouncedSearchTerm) {
            refetch()
        }
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
            searchPlaceholder="Search members..."
            emptyMessage="No members found."
            onSearchChange={handleSearchChange}
            onOpenChange={handleOpenChange}
            isMulti={isMulti}
        />
    )
}

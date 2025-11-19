import React from 'react'
import InputSelector, { InputSelectorData } from './InputSelector'
import { useRoles } from '@/hooks/use-roles'
import { BaseSelectorProps } from '@/types/selector.types'

interface RoleSelectorProps extends BaseSelectorProps {}

export default function RoleSelector({
    value,
    onChange,
    placeholder = "Select a role...",
    disabled = false,
    className,
    isMulti = false
}: RoleSelectorProps) {
    const [searchTerm, setSearchTerm] = React.useState('')
    const [debouncedSearchTerm, setDebouncedSearchTerm] = React.useState('')
    const [isOpen, setIsOpen] = React.useState(false)

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm)
        }, 400)

        return () => clearTimeout(timer)
    }, [searchTerm]);    const { roles, isLoading, error, refetch } = useRoles({
        search: debouncedSearchTerm,
        limit: 50,
        isActive: 'true'
    }, {
        enabled: isOpen
    });
    
    const options: InputSelectorData[] = React.useMemo(() => {
        return roles.map(role => ({
            label: role.name,
            value: role._id,
            description: role.description || 'No description'
        }))
    }, [roles])

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
            searchPlaceholder="Search roles..."
            emptyMessage="No roles found."
            onSearchChange={handleSearchChange}
            onOpenChange={handleOpenChange}
            isMulti={isMulti}
        />
    )
}

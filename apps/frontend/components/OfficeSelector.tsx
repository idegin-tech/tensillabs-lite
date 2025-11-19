import React from 'react'
import InputSelector, { InputSelectorData } from './InputSelector'
import { useOffices } from '@/hooks/use-offices'
import { BaseSelectorProps } from '@/types/selector.types'

interface OfficeSelectorProps extends BaseSelectorProps {}

export default function OfficeSelector({
    value,
    onChange,
    placeholder = "Select an office...",
    disabled = false,
    className,
    isMulti = false
}: OfficeSelectorProps) {
    const [searchTerm, setSearchTerm] = React.useState('')
    const [debouncedSearchTerm, setDebouncedSearchTerm] = React.useState('')
    const [isOpen, setIsOpen] = React.useState(false)

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm)
        }, 400)

        return () => clearTimeout(timer)
    }, [searchTerm])

    const { offices, isLoading, error, refetch } = useOffices({
        search: debouncedSearchTerm,
        limit: 50
    }, {
        enabled: isOpen
    });
    
    const options: InputSelectorData[] = React.useMemo(() => {
        return offices.map(office => ({
            label: office.name,
            value: office._id,
            description: office.address || office.description || 'No address provided'
        }))
    }, [offices])

    const handleSearchChange = (search: string) => {
        setSearchTerm(search)
    }

    const handleRetry = () => {
        refetch()
    }

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open)
    }

    return (        <InputSelector
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
            searchPlaceholder="Search offices..."
            emptyMessage="No offices found."
            onSearchChange={handleSearchChange}
            onOpenChange={handleOpenChange}
            isMulti={isMulti}
        />
    )
}

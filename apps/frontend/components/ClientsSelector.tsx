import React from 'react'
import InputSelector, { InputSelectorData } from './InputSelector'
import { useClients } from '@/hooks/use-clients'
import { BaseSelectorProps } from '@/types/selector.types'

interface ClientsSelectorProps extends BaseSelectorProps {}

export default function ClientsSelector({
    value,
    onChange,
    placeholder = "Select a client...",
    disabled = false,
    className,
    isMulti = false
}: ClientsSelectorProps) {const [searchTerm, setSearchTerm] = React.useState('')
    const [debouncedSearchTerm, setDebouncedSearchTerm] = React.useState('')
    const [isOpen, setIsOpen] = React.useState(false)

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm)
        }, 400)

        return () => clearTimeout(timer)
    }, [searchTerm])

    const { clients, isLoading, error, refetch } = useClients({
        search: debouncedSearchTerm,
        limit: 50
    }, {
        enabled: isOpen
    });
    
    const options: InputSelectorData[] = React.useMemo(() => {
        return clients.map(client => {
            let description = 'No address'
            
            if (client.offices && client.offices.length > 0) {
                const firstOffice = client.offices[0]
                if (typeof firstOffice === 'object' && firstOffice.address) {
                    description = firstOffice.address
                } else if (client.description) {
                    description = client.description
                }
            } else if (client.description) {
                description = client.description
            }

            return {
                label: client.name,
                value: client._id,
                description
            }
        })
    }, [clients])

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
            searchPlaceholder="Search clients..."
            emptyMessage="No clients found."
            onSearchChange={handleSearchChange}
            onOpenChange={handleOpenChange}
            isMulti={isMulti}
        />
    )
}
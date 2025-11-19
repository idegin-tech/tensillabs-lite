import React from 'react'
import Select, { Props, components, DropdownIndicatorProps, ClearIndicatorProps } from 'react-select'
import { ChevronDownIcon, XIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ReactSelectProps extends Props {
    placeholder?: string
}

const DropdownIndicator = (props: DropdownIndicatorProps) => {
    return (
        <components.DropdownIndicator {...props}>
            <ChevronDownIcon className="h-4 w-4" />
        </components.DropdownIndicator>
    )
}

const ClearIndicator = (props: ClearIndicatorProps) => {
    return (
        <components.ClearIndicator {...props}>
            <XIcon className="h-4 w-4" />
        </components.ClearIndicator>
    )
}

const controlStyles = {
    base: "flex min-h-9 w-full rounded-md border border-input bg-background text-sm transition-colors",
    focus: "border-ring ring-1 ring-ring/50",
    disabled: "cursor-not-allowed opacity-50"
}

const placeholderStyles = "text-muted-foreground"
const inputStyles = "text-foreground"
const valueContainerStyles = "gap-1 px-3 py-1"
const singleValueStyles = "text-foreground"
const multiValueStyles = "inline-flex items-center rounded-md border border-transparent bg-secondary text-secondary-foreground px-2.5 py-0.5 text-xs font-semibold"
const multiValueLabelStyles = "text-secondary-foreground"
const multiValueRemoveStyles = "ml-1 hover:bg-secondary/80 hover:text-secondary-foreground rounded-sm"
const indicatorsContainerStyles = "gap-1 px-1"
const clearIndicatorStyles = "text-muted-foreground hover:text-foreground p-1 rounded-sm hover:bg-muted transition-colors"
const indicatorSeparatorStyles = "bg-border mx-1"
const dropdownIndicatorStyles = "text-muted-foreground hover:text-foreground p-1 rounded-sm hover:bg-muted transition-colors"
const menuStyles = "mt-1 border border-border bg-popover text-popover-foreground rounded-md shadow-md z-50"
const groupHeadingStyles = "text-sm font-semibold text-muted-foreground px-3 py-2"
const optionStyles = {
    base: "relative flex cursor-default select-none items-center rounded-sm px-3 py-2 text-sm outline-none transition-colors",
    focus: "bg-accent text-accent-foreground",
    selected: "bg-primary text-primary-foreground",
    disabled: "pointer-events-none opacity-50"
}
const noOptionsMessageStyles = "text-muted-foreground px-3 py-2 text-center text-sm"

export default function ReactSelect({
    placeholder = "Select...",
    ...props
}: ReactSelectProps) {
    return (
        <Select
            placeholder={placeholder}
            unstyled
            styles={{
                input: (base) => ({
                    ...base,
                    "input:focus": {
                        boxShadow: "none",
                    },
                }),
                multiValueLabel: (base) => ({
                    ...base,
                    whiteSpace: "normal",
                    overflow: "visible",
                }),
                control: (base) => ({
                    ...base,
                    transition: "none",
                }),
            }}
            components={{ DropdownIndicator, ClearIndicator }}
            classNames={{
                control: ({ isFocused, isDisabled }) =>
                    cn(
                        controlStyles.base,
                        isFocused && controlStyles.focus,
                        isDisabled && controlStyles.disabled
                    ),
                placeholder: () => placeholderStyles,
                input: () => inputStyles,
                valueContainer: () => valueContainerStyles,
                singleValue: () => singleValueStyles,
                multiValue: () => multiValueStyles,
                multiValueLabel: () => multiValueLabelStyles,
                multiValueRemove: () => multiValueRemoveStyles,
                indicatorsContainer: () => indicatorsContainerStyles,
                clearIndicator: () => clearIndicatorStyles,
                indicatorSeparator: () => indicatorSeparatorStyles,
                dropdownIndicator: () => dropdownIndicatorStyles,
                menu: () => menuStyles,
                groupHeading: () => groupHeadingStyles,
                option: ({ isFocused, isSelected, isDisabled }) =>
                    cn(
                        optionStyles.base,
                        isFocused && !isSelected && optionStyles.focus,
                        isSelected && optionStyles.selected,
                        isDisabled && optionStyles.disabled
                    ),
                noOptionsMessage: () => noOptionsMessageStyles,
            }}
            {...props}
        />
    )
}
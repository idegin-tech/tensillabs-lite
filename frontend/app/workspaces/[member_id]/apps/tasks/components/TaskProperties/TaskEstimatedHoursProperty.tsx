'use client'

import React, { useState, useEffect } from 'react'
import { TaskPropertyProps } from '.'

export default function TaskEstimatedHoursProperty({ onChange, value }: TaskPropertyProps) {
    const [internalValue, setInternalValue] = useState<string>(value?.toString() || '')

    useEffect(() => {
        setInternalValue(value?.toString() || '')
    }, [value])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value

        if (inputValue === '') {
            setInternalValue('')
            return
        }

        if (/^\d*\.?\d*$/.test(inputValue)) {
            setInternalValue(inputValue)
        }
    }

    const handleBlur = () => {
        if (internalValue === '') {
            onChange?.(null)
            return
        }

        const numValue = parseFloat(internalValue)
        if (!isNaN(numValue) && numValue >= 0) {
            setTimeout(() => {
                onChange?.(numValue);
            }, 10);
        } else {
            setInternalValue(value?.toString() || '')
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.currentTarget.blur()
        }
    }

    return (
        <input
            type="text"
            value={internalValue}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            placeholder="None"
            className="w-full h-8 bg-transparent border-0 outline-none focus:outline-none text-sm px-0"
        />
    )
}

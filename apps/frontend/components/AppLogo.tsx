import { useTheme } from 'next-themes'
import React from 'react'

type Props = {
    size?: number;
}

export default function AppLogo({ size }: Props) {
    const { theme } = useTheme();
    return (
        <>
            <img
                src={theme == 'light' ? '/brand/logo-dark.svg' : '/brand/logo-light.png'}
                width={size || 200}
                height={50}
                alt='logo'
            />
        </>
    )
}
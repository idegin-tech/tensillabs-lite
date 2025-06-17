
import React from 'react'

type Props = {
    children: React.ReactNode;
    Icon: React.ReactNode;
    label: string;
}

export default function EachTaskDetailsProperty({ children, Icon, label }: Props) {
    return (
        <div className='grid grid-cols-2'>

            <div className='flex gap-2 items-center'>
                <span className='text-lg text-muted-foreground'>
                    {Icon}
                </span>
                <span>
                    {label}
                </span>
            </div>

            <div>
                {children}
            </div>

        </div>
    )
}

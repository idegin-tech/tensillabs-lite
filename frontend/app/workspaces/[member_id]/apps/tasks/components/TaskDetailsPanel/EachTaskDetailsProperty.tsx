
import React from 'react'

type Props = {
    children: React.ReactNode;
    label: string;
}

export default function EachTaskDetailsProperty({ children, label }: Props) {
    return (
        <div className='grid grid-cols-4 items-center gap-x-8 gap-y-10'>

            <div className='flex gap-2 items-center'>
                <span>
                    {label}
                </span>
            </div>

            <div className='col-span-3'>
                {children}
            </div>

        </div>
    )
}

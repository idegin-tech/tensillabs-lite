import AppLayout from '@/components/layout/app-layout/AppLayout'
import React from 'react'
import PeopleAppNav from './components/PeopleAppNav'

export default function layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <AppLayout navContent={<PeopleAppNav />}>
                {children}
            </AppLayout>
        </>
    )
}

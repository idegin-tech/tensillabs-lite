import AppLayout from '@/components/layout/app-layout/AppLayout'
import React from 'react'
import PeopleAppNav from './components/PeopleAppNav'
import { PeopleProvider } from './contexts/people.context'

export default function layout({ children }: { children: React.ReactNode }) {
    return (
        <PeopleProvider>
            <AppLayout navContent={<PeopleAppNav />}>
                {children}
            </AppLayout>
        </PeopleProvider>
    )
}

import { WorkspaceMemberProvider } from '@/contexts/workspace-member.context'
import React from 'react'

export default function layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <WorkspaceMemberProvider>
                {children}
            </WorkspaceMemberProvider>
        </>
    )
}

import AppLayout from '@/components/layout/app-layout/AppLayout'
import React from 'react'
import AuthAppNav from './components/AdminAppNav'

export default function layout({children}: {children: React.ReactNode}) {
  return (
    <AppLayout navContent={<AuthAppNav />}>
        {children}
    </AppLayout>
  )
}

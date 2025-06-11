import AppLayout from '@/components/layout/app-layout/AppLayout'
import React from 'react'
import AIAppNav from './components/AIAppNav'

export default function layout({children}: {children: React.ReactNode}) {
  return (
    <AppLayout navContent={<AIAppNav />}>
        {children}
    </AppLayout>
  )
}

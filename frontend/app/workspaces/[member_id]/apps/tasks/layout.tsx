import AppLayout from '@/components/layout/app-layout/AppLayout'
import React from 'react'
import TasksAppNav from './components/TasksAppNav'

export default function layout({children}: {children: React.ReactNode}) {
  return (
    <AppLayout navContent={<TasksAppNav />}>
        {children}
    </AppLayout>
  )
}

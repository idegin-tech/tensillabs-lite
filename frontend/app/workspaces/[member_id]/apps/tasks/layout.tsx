import AppLayout from '@/components/layout/app-layout/AppLayout'
import React from 'react'
import TasksAppNav from './components/TasksAppNav'
import { TaskListProvider } from './contexts/task-list.context'
import { TasksAppProvider } from './contexts/tasks-app.context'
import CreateSpacePopup from './components/CreateSpacePopup'
import { TasksSpaceProvider } from './contexts/tasks-space.context'
import TaskDetails from './components/TaskDetails/TaskDetails'

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <TasksAppProvider>
      <TasksSpaceProvider>
        <TaskListProvider>
          <CreateSpacePopup />
          <AppLayout navContent={<TasksAppNav />}>
            <TaskDetails />
            {children}
          </AppLayout>
        </TaskListProvider>
      </TasksSpaceProvider>
    </TasksAppProvider>
  )
}

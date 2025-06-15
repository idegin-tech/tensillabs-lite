import React from 'react'

import { cn } from '@/lib/utils';
import AppHeader from './AppHeader';

export default function AppBody(
  {
    children,
    withoutPadding = false,
  }: {
    children: React.ReactNode;
    withoutPadding?: boolean;
  }
) {
  return (
    <>
      <AppHeader />
      <main className={cn(
        "flex flex-1 flex-col gap-4 pt-0 max-h-app-body overflow-y-auto select-none",
        "bg-gradient-to-tr from-background to-sidebar",
        withoutPadding ? "p-0" : "p-4"
      )}>
        {children}
      </main>
    </>
  )
}

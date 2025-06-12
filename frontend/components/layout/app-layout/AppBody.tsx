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
      <main className={cn("flex flex-1 flex-col gap-4 pt-0 max-h-[calc(100vh-3rem-16px)] overflow-y-auto select-none", withoutPadding ? "p-0" : "p-4")}>
        {children}
      </main>
    </>
  )
}

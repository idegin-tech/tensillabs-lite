'use client'

import React from 'react'
import PWAInstallPrompt from './PWAInstallPrompt'
import { useServiceWorker, useOfflineStatus } from '@/hooks/use-pwa'
import { Button } from '@/components/ui/button'
import { RefreshCw, Wifi, WifiOff } from 'lucide-react'

export default function Providers({children}:{children: React.ReactNode}) {
  const { needRefresh, updateServiceWorker } = useServiceWorker()
  const { isOnline } = useOfflineStatus()

  return (
    <>
      {children}
      <PWAInstallPrompt />
      
      {needRefresh && (
        <div className="fixed top-4 right-4 z-50 bg-background border border-border rounded-lg shadow-lg p-4 max-w-sm">
          <div className="flex items-center gap-3">
            <RefreshCw className="h-5 w-5 text-primary" />
            <div className="flex-1">
              <p className="text-sm font-medium">Update Available</p>
              <p className="text-xs text-muted-foreground">A new version is ready</p>
            </div>
            <Button onClick={updateServiceWorker} size="sm">
              Update
            </Button>
          </div>
        </div>
      )}

      {!isOnline && (
        <div className="fixed bottom-4 left-4 z-50 bg-destructive text-destructive-foreground rounded-lg shadow-lg p-3 flex items-center gap-2">
          <WifiOff className="h-4 w-4" />
          <span className="text-sm font-medium">You're offline</span>
        </div>
      )}
    </>
  )
}

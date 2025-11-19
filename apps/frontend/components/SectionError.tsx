'use client'

import React from 'react'
import { TbAlertCircle, TbRefresh } from 'react-icons/tb'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface SectionErrorProps {
  title?: string
  message?: string
  onRetry?: () => void
}

export default function SectionError({
  title = "Something went wrong",
  message = "We encountered an error while loading this section. Please try again.",
  onRetry
}: SectionErrorProps) {
  return (
    <Card className="w-full max-w-md mx-auto border-destructive/20">
      <CardContent className="flex flex-col items-center text-center space-y-4 py-8">
        <div className="bg-destructive/10 rounded-full p-3">
          <TbAlertCircle className="h-8 w-8 text-destructive" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground max-w-sm">{message}</p>
        </div>
        
        {onRetry && (
          <Button 
            onClick={onRetry}
            variant="outline"
            size="sm"
            className="mt-4"
          >
            <TbRefresh className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

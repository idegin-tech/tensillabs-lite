'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { WifiOff, RotateCcw, ArrowLeft } from 'lucide-react'

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
            <WifiOff className="w-8 h-8 text-muted-foreground" />
          </div>
          <CardTitle className="text-2xl">You're Offline</CardTitle>
          <CardDescription>
            It looks like you're not connected to the internet. Don't worry, you can still access some features of TensilLabs.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={() => window.location.reload()} 
            className="w-full"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
          
          <Button 
            onClick={() => window.history.back()} 
            variant="outline" 
            className="w-full"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
          
          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground text-center">
              TensilLabs works best with an internet connection, but you can still view cached content.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

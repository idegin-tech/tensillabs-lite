'use client'

import { useAuth } from '@/hooks/use-next-auth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import AppLogo from '@/components/AppLogo'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { TbLogout, TbUser } from 'react-icons/tb'

export default function ProtectedWorkspacesPage() {
  const { user, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/')
    }
  }, [isLoading, isAuthenticated, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
        <Card className="w-full max-w-md p-6">
          <div className="flex flex-col items-center space-y-4">
            <Skeleton className="h-12 w-48" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-full" />
          </div>
        </Card>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center space-y-8">
          <AppLogo size={180} />
          
          <Card className="w-full max-w-md">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-primary/10 rounded-full p-2">
                  <TbUser className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Welcome back!</h2>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">ID:</span> {user.id}</p>
                <p><span className="font-medium">Timezone:</span> {user.timezone}</p>
                <p><span className="font-medium">Email Verified:</span> {user.isEmailVerified ? 'Yes' : 'No'}</p>
              </div>
              
              <Button 
                className="w-full mt-4" 
                variant="outline"
                onClick={() => router.push('/api/auth/signout')}
              >
                <TbLogout className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </CardContent>
          </Card>
          
          <div className="text-center space-y-2">
            <h3 className="text-xl font-semibold">Workspaces</h3>
            <p className="text-muted-foreground">This is a protected route that requires authentication</p>
          </div>
        </div>
      </div>
    </div>
  )
}

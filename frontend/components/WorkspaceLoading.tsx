import React from 'react'
import { cn } from '@/lib/utils'
import AppLogo from './AppLogo'

interface WorkspaceLoadingProps {
    className?: string
}

export default function WorkspaceLoading({ className }: WorkspaceLoadingProps) {
    return (
        <div className={cn(
            "min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-background/95 to-muted/20 relative overflow-hidden",
            className
        )}>
            <div className="relative flex flex-col items-center space-y-12- z-10">
                <div className="relative">
                    <AppLogo size={250} />
                    {/* <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-secondary/10 rounded-full animate-spin"
                        style={{ animationDuration: '8s' }}>

                    </div> */}
                </div>

                <div className="text-center space-y-6 max-w-md">
                    {/* <div className="space-y-2">
                        <h2 className="text-2xl font-semibold text-foreground/90 tracking-tight">
                            Preparing your workspace
                        </h2>
                        <p className="text-sm text-muted-foreground/80">
                            Setting up your personalized environment...
                        </p>
                    </div> */}

                    <div className="flex justify-center items-center space-x-2 pt-2 animate-pulse">
                        <div className="h-3 w-3 bg-primary rounded-full animate-bounce shadow-lg shadow-primary/30"></div>
                        <div className="h-3 w-3 bg-primary rounded-full animate-bounce shadow-lg shadow-primary/30"
                            style={{ animationDelay: '0.15s' }}></div>
                        <div className="h-3 w-3 bg-primary rounded-full animate-bounce shadow-lg shadow-primary/30"
                            style={{ animationDelay: '0.3s' }}></div>
                    </div>
                </div>

                {/* Enhanced background elements */}
                <div className="absolute -top-32 -left-32 w-64 h-64 bg-gradient-to-r from-primary/8 to-secondary/8 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-32 -right-32 w-48 h-48 bg-gradient-to-l from-secondary/8 to-accent/8 rounded-full blur-2xl animate-pulse"
                    style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/4 -right-20 w-32 h-32 bg-gradient-to-b from-accent/5 to-primary/5 rounded-full blur-xl animate-pulse"
                    style={{ animationDelay: '2s' }}></div>
                <div className="absolute bottom-1/4 -left-16 w-24 h-24 bg-gradient-to-t from-secondary/6 to-accent/6 rounded-full blur-lg animate-pulse"
                    style={{ animationDelay: '1.5s' }}></div>
            </div>

            {/* Subtle grid pattern overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.05)_1px,transparent_0)] bg-[length:24px_24px] opacity-30"></div>
        </div>
    )
}

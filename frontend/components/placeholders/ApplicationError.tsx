'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface ApplicationErrorProps {
    message?: string
    onRetry?: () => void
    className?: string
}

const BrokenAppIllustration = ({ className }: { className?: string }) => (
    <svg
        className={cn("text-muted-foreground/60", className)}
        fill="currentColor"
        viewBox="0 0 240 180"
        xmlns="http://www.w3.org/2000/svg"
    >
        <rect x="40" y="30" width="160" height="120" rx="8" fill="currentColor" opacity="0.1" />
        <rect x="40" y="30" width="160" height="20" rx="8" fill="currentColor" opacity="0.2" />
        <circle cx="52" cy="40" r="3" fill="#ef4444" opacity="0.8" />
        <circle cx="62" cy="40" r="3" fill="#f59e0b" opacity="0.8" />
        <circle cx="72" cy="40" r="3" fill="#10b981" opacity="0.8" />

        <rect x="60" y="70" width="80" height="8" rx="2" fill="currentColor" opacity="0.3" />
        <rect x="60" y="85" width="120" height="6" rx="2" fill="currentColor" opacity="0.2" />
        <rect x="60" y="98" width="100" height="6" rx="2" fill="currentColor" opacity="0.2" />

        <path d="M85 115 L95 125 L85 135" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.8" />
        <path d="M155 115 L145 125 L155 135" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.8" />

        <circle cx="120" cy="125" r="15" fill="#ef4444" opacity="0.1" />
        <path d="M112 117 L128 133 M128 117 L112 133" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />

        <rect x="20" y="160" width="200" height="4" rx="2" fill="currentColor" opacity="0.1" />

        <circle cx="50" cy="70" r="2" fill="#ef4444" opacity="0.6" />
        <circle cx="170" cy="85" r="2" fill="#ef4444" opacity="0.6" />
        <circle cx="180" cy="110" r="1.5" fill="#ef4444" opacity="0.4" />

        <path d="M25 45 Q30 40 35 45 T45 45" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.3" />
        <path d="M195 65 Q200 60 205 65 T215 65" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.3" />
    </svg>
)

export default function ApplicationError({
    message = "Something went wrong while loading the application",
    onRetry,
    className
}: ApplicationErrorProps) {
    return (
        <div className={cn(
            "min-h-screen w-full flex items-center justify-center bg-background/50 backdrop-blur-sm",
            className
        )}>
            <Card className="w-full max-w-md mx-4 shadow-2xl border-0 bg-card/90 backdrop-blur-sm">
                <CardContent className="flex flex-col items-center text-center space-y-8 py-12 px-8">
                    <div className="relative">
                        <BrokenAppIllustration className="w-[20rem]" />
                        <div className="absolute -top-2 -right-2 animate-bounce">
                            <div className="bg-destructive rounded-full p-2">
                                <svg className="h-4 w-4 text-destructive-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h1 className="text-2xl font-bold text-foreground">
                            Oops! This wasn't supposed to happen
                        </h1>
                        <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
                            {message}
                        </p>
                    </div>

                    {onRetry && (
                        <div className="space-y-4 w-full">
                            <Button
                                onClick={onRetry}
                                className="w-full"
                                size="lg"
                            >
                                <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Try Again
                            </Button>

                            <p className="text-xs text-muted-foreground">
                                If this problem persists, please contact support
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

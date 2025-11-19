'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface ButtonConfig {
  label: string
  onClick: () => void
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  icon?: React.ComponentType<{ className?: string }>
}

interface SectionPlaceholderProps {
  icon: React.ComponentType<{ className?: string }>
  heading: string
  subHeading: string
  ctaButton?: ButtonConfig
  variant?: 'default' | 'error' | 'empty' | 'success' | 'warning'
  className?: string
  fullWidth?: boolean
}

const variantStyles = {
  default: {
    iconContainer: 'bg-muted/50',
    iconColor: 'text-muted-foreground',
    cardBorder: ''
  },
  error: {
    iconContainer: 'bg-destructive/10',
    iconColor: 'text-destructive',
    cardBorder: 'border-destructive/20'
  },
  empty: {
    iconContainer: 'bg-primary/10',
    iconColor: 'text-primary',
    cardBorder: 'border-primary/20'
  },
  success: {
    iconContainer: 'bg-green-100 dark:bg-green-900/20',
    iconColor: 'text-green-600 dark:text-green-400',
    cardBorder: 'border-green-200 dark:border-green-800'
  },
  warning: {
    iconContainer: 'bg-yellow-100 dark:bg-yellow-900/20',
    iconColor: 'text-yellow-600 dark:text-yellow-400',
    cardBorder: 'border-yellow-200 dark:border-yellow-800'
  }
}

export default function SectionPlaceholder({
  icon: Icon,
  heading,
  subHeading,
  ctaButton,
  variant = 'default',
  className,
  fullWidth = false
}: SectionPlaceholderProps) {
  const styles = variantStyles[variant]
  const ButtonIcon = ctaButton?.icon

  return (
    <div className={cn(
      'flex items-center justify-center',
      fullWidth ? 'w-full' : 'w-full max-w-lg mx-auto',
      className
    )}>
      <div className={cn(
        'w-full transition-all duration-200',
        styles.cardBorder
      )}>
        <CardContent className="flex flex-col items-center text-center space-y-6 py-12 px-8">
         
          <div className={cn(
            'rounded-full p-6 transition-all duration-200',
            'w-20 h-20 flex items-center justify-center',
            'shadow-sm border border-border/10',
            styles.iconContainer
          )}>
            <Icon className={cn('h-8 w-8', styles.iconColor)} />
          </div>
          
          <div className="space-y-3 max-w-md">
            <h3 className="text-xl font-semibold text-foreground leading-tight">
              {heading}
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {subHeading}
            </p>
          </div>
          
          {ctaButton && (
            <Button 
              onClick={ctaButton.onClick}
              variant={ctaButton.variant || 'default'}
              size={ctaButton.size || 'default'}
              className={cn(
                'mt-6 transition-all duration-200',
                'hover:scale-105 active:scale-95'
              )}
            >
              {ButtonIcon && <ButtonIcon className="h-4 w-4 mr-2" />}
              {ctaButton.label}
            </Button>
          )}
        </CardContent>
      </div>
    </div>
  )
}

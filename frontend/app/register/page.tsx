'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { TbMail, TbLock, TbBrandGoogle, TbBrandWindows, TbEye, TbEyeOff, TbBuilding } from 'react-icons/tb'
import { toast } from 'sonner'
import { APP_CONFIG } from '@/config/app.config'
import AuthLayout from '@/components/auth/AuthLayout'
import Link from 'next/link'
import { useAuthActions } from '@/hooks/use-auth'

const registerSchema = z
  .object({
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Please enter a valid email address')
      .toLowerCase()
      .trim(),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must be at least 8 characters'),
    confirmPassword: z
      .string()
      .min(1, 'Please confirm your password')
      .min(8, 'Password must be at least 8 characters'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

type RegisterForm = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const { register, isLoading, error, clearError } = useAuthActions()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'onChange',
  })

  const onSubmit = async (values: RegisterForm) => {
    try {
      clearError()
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
      
      const result = await register({
        email: values.email.toLowerCase().trim(),
        password: values.password,
        confirmPassword: values.confirmPassword,
        timezone,
      })

      if (result.success) {
        toast.success('Registration successful!', {
          description: 'Please check your email for verification instructions.',
        })
      } else {
        toast.error('Registration failed', {
          description: result.error || 'Please check your information and try again.',
        })
      }
    } catch (error) {
      toast.error('Registration failed', {
        description: 'An unexpected error occurred. Please try again.',
      })
    }
  }

  return (
    <AuthLayout>
      <Card className="w-full max-w-md shadow-2xl border-0 bg-card/50 backdrop-blur-sm">
        <CardHeader className="text-center space-y-4">
          <div className="lg:hidden flex items-center justify-center space-x-3 mb-4">
            <div className="bg-primary rounded-xl p-2">
              <TbBuilding className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">{APP_CONFIG.appName}</h1>
          </div>
          
          <CardTitle className="text-2xl font-bold text-foreground">
            Create your account
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Join thousands of teams using {APP_CONFIG.appName} to manage their work
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="w-full h-11 border-border/50 hover:bg-accent/50 transition-colors">
              <TbBrandGoogle className="h-5 w-5 mr-2 text-red-500" />
              Google
            </Button>
            <Button variant="outline" className="w-full h-11 border-border/50 hover:bg-accent/50 transition-colors">
              <TbBrandWindows className="h-5 w-5 mr-2 text-blue-500" />
              Microsoft
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">or continue with email</span>
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-destructive/15 p-3">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField<RegisterForm>
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground font-medium">Email address</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <TbMail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="email"
                          placeholder="Enter your email address"
                          className="pl-10 h-11 border-border/50 focus:border-primary transition-colors"
                          value={field.value as string}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField<RegisterForm>
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground font-medium">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <TbLock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Create a strong password"
                          className="pl-10 pr-10 h-11 border-border/50 focus:border-primary transition-colors"
                          value={field.value as string}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <TbEyeOff className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                          ) : (
                            <TbEye className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <div className="text-xs text-muted-foreground">
                      Use at least 8 characters with a mix of letters, numbers & symbols
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField<RegisterForm>
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground font-medium">Confirm password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <TbLock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="Confirm your password"
                          className="pl-10 pr-10 h-11 border-border/50 focus:border-primary transition-colors"
                          value={field.value as string}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0 hover:bg-transparent"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <TbEyeOff className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                          ) : (
                            <TbEye className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full h-11 bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-200"
                disabled={!form.formState.isValid || isLoading}
                isLoading={isLoading}
              >
                Create account
              </Button>
            </form>
          </Form>

          <div className="text-center">
            <span className="text-muted-foreground text-sm">
              Already have an account?
            </span>{' '}
            <Link href="/" className="text-primary text-sm font-medium hover:text-primary/80 transition-colors">
              Sign in
            </Link>
          </div>

          <p className="text-xs text-muted-foreground text-center leading-relaxed">
            By creating an account, you agree to our{' '}
            <Button variant="link" className="p-0 h-auto text-xs text-primary hover:text-primary/80 transition-colors">
              Terms of Service
            </Button>{' '}
            and{' '}
            <Button variant="link" className="p-0 h-auto text-xs text-primary hover:text-primary/80 transition-colors">
              Privacy Policy
            </Button>
          </p>
        </CardContent>
      </Card>
    </AuthLayout>
  )
}

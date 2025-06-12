'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useState } from 'react'
import { TbBuilding, TbBrandGoogle, TbBrandWindows, TbEye, TbEyeOff } from 'react-icons/tb'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { toast } from 'sonner'
import Link from 'next/link'
import AuthLayout from '@/components/auth/AuthLayout'
import { useAuthActions } from '@/hooks/use-auth'
import { APP_CONFIG } from '@/config/app.config'

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean(),
})

type LoginForm = z.infer<typeof loginSchema>

export default function LoginPage() {
  const { login, isLoading, error, clearError } = useAuthActions()
  const [showPassword, setShowPassword] = useState(false)
  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  })

  const onSubmit = async (values: LoginForm) => {
    console.log('[LOGIN_PAGE] Form submission started with values:', {
      email: values.email,
      hasPassword: !!values.password,
      rememberMe: values.rememberMe
    });

    try {
      clearError()
      console.log('[LOGIN_PAGE] Calling login function...');
      const result = await login({
        email: values.email,
        password: values.password,
      })

      console.log('[LOGIN_PAGE] Login function result:', result);

      if (result.success) {
        console.log('[LOGIN_PAGE] Login successful, showing success toast');
        toast.success('Login successful! Redirecting...', {
          description: 'Welcome back to TensilLabs',
        })
      } else {
        console.log('[LOGIN_PAGE] Login failed, showing error toast');
        toast.error('Login failed', {
          description: result.error || 'Invalid credentials. Please try again.',
        })
      }
    } catch (error) {
      console.error('[LOGIN_PAGE] Login error caught:', error);
      toast.error('Login failed', {
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
            Welcome back
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Sign in to your account to continue
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
          </div>          {error && (
            <div className="rounded-md bg-destructive/15 p-3">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">              <FormField<LoginForm>
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground font-medium">Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        className="h-11"
                        value={field.value as string}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField<LoginForm>
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground font-medium">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter your password"
                          className="h-11 pr-10"
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
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <TbEyeOff className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <TbEye className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-between">
                <FormField<LoginForm>
                  control={form.control}
                  name="rememberMe"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value as boolean}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm font-normal text-muted-foreground">
                          Remember me
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                <Link 
                  href="/forgot-password" 
                  className="text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  Forgot password?
                </Link>
              </div><Button 
                type="submit" 
                className="w-full h-11 bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-200"
                isLoading={isLoading}
              >
                Sign in
              </Button>
            </form>
          </Form>

          <div className="text-center">
            <span className="text-muted-foreground text-sm">
              Don't have an account?
            </span>{' '}
            <Link href="/register" className="text-primary text-sm font-medium hover:text-primary/80 transition-colors">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </AuthLayout>
  )
}

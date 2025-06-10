'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { TbMail, TbLock, TbBrandGoogle, TbBrandWindows, TbEye, TbEyeOff, TbBuilding } from 'react-icons/tb'
import { APP_CONFIG } from '@/config/app.config'
import AuthLayout from '@/components/auth/AuthLayout'
import Link from 'next/link'

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('Registration form submitted:', formData)
  }

  const passwordsMatch = formData.password === formData.confirmPassword
  const isFormValid = formData.email && formData.password && formData.confirmPassword && passwordsMatch

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
          {/* Social login buttons */}
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

          {/* Separator */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">or continue with email</span>
            </div>
          </div>

          {/* Registration form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground font-medium">Email address</Label>
              <div className="relative">
                <TbMail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email address"
                  className="pl-10 h-11 border-border/50 focus:border-primary transition-colors"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground font-medium">Password</Label>
              <div className="relative">
                <TbLock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a strong password"
                  className="pl-10 pr-10 h-11 border-border/50 focus:border-primary transition-colors"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
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
              <div className="text-xs text-muted-foreground">
                Use at least 8 characters with a mix of letters, numbers & symbols
              </div>
            </div>

            {/* Confirm password field */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-foreground font-medium">Confirm password</Label>
              <div className="relative">
                <TbLock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  className={`pl-10 pr-10 h-11 border-border/50 focus:border-primary transition-colors ${
                    formData.confirmPassword && !passwordsMatch ? 'border-destructive focus:border-destructive' : ''
                  }`}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
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
              {formData.confirmPassword && !passwordsMatch && (
                <div className="text-xs text-destructive">
                  Passwords do not match
                </div>
              )}
            </div>

            {/* Submit button */}
            <Button 
              type="submit" 
              className={`w-full h-11 transition-all duration-200 ${
                isFormValid 
                  ? 'bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl' 
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
              }`}
              disabled={!isFormValid}
            >
              Create account
            </Button>
          </form>

          {/* Sign in link */}
          <div className="text-center">
            <span className="text-muted-foreground text-sm">
              Already have an account?
            </span>{' '}
            <Link href="/" className="text-primary text-sm font-medium hover:text-primary/80 transition-colors">
              Sign in
            </Link>
          </div>

          {/* Terms and privacy */}
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

'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form'
import { Separator } from '@/components/ui/separator'
import AppBody from '@/components/layout/app-layout/AppBody'
import RoleSelector from '@/components/RoleSelector'
import TeamSelector from '@/components/TeamSelector'
import { InputSelectorData } from '@/components/InputSelector'
import { TbArrowLeft, TbUserPlus, TbMail, TbUser, TbPhone, TbUsers, TbShield, TbLoader2, TbCheck } from 'react-icons/tb'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useInviteMember } from '@/hooks/use-workspace-members'
import { toast } from 'sonner'

const inviteUserSchema = z.object({
    firstName: z
        .string()
        .min(1, 'First name is required')
        .min(2, 'First name must be at least 2 characters')
        .max(50, 'First name must not exceed 50 characters')
        .regex(/^[a-zA-Z\s'-]+$/, 'First name can only contain letters, spaces, hyphens, and apostrophes')
        .transform(val => val.trim()),
    lastName: z
        .string()
        .min(1, 'Last name is required')
        .min(2, 'Last name must be at least 2 characters')
        .max(50, 'Last name must not exceed 50 characters')
        .regex(/^[a-zA-Z\s'-]+$/, 'Last name can only contain letters, spaces, hyphens, and apostrophes')
        .transform(val => val.trim()),
    middleName: z
        .string()
        .max(50, 'Middle name must not exceed 50 characters')
        .regex(/^[a-zA-Z\s'-]*$/, 'Middle name can only contain letters, spaces, hyphens, and apostrophes')
        .transform(val => val.trim())
        .optional()
        .or(z.literal('')),
    primaryEmail: z
        .string()
        .min(1, 'Email address is required')
        .email('Please enter a valid email address')
        .max(254, 'Email address is too long')
        .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email format')
        .transform(val => val.toLowerCase().trim()),
    workPhone: z
        .string()
        .max(20, 'Work phone must not exceed 20 characters')
        .regex(/^[\d\s\-\+\(\)\.]*$/, 'Phone number can only contain digits, spaces, and standard phone formatting characters')
        .transform(val => val.trim())
        .optional()
        .or(z.literal('')),
})

type InviteUserFormData = z.infer<typeof inviteUserSchema>

export default function InviteUserPage() {
    const params = useParams()
    const router = useRouter()
    const member_id = params.member_id as string

    const [selectedRole, setSelectedRole] = useState<InputSelectorData | undefined>()
    const [selectedTeam, setSelectedTeam] = useState<InputSelectorData | undefined>()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const inviteMember = useInviteMember()

    const form = useForm<InviteUserFormData>({
        resolver: zodResolver(inviteUserSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            middleName: '',
            primaryEmail: '',
            workPhone: '',
        },
        mode: 'onChange',
    })

    const onSubmit = async (data: InviteUserFormData) => {
        if (isSubmitting) return
        
        setIsSubmitting(true)
        
        try {
            const inviteData = {
                ...data,
                middleName: data.middleName || undefined,
                workPhone: data.workPhone || undefined,
                primaryRole: selectedRole?.value,
                primaryTeam: selectedTeam?.value,
            }

            await inviteMember.mutateAsync(inviteData)
            
            toast.success('Invitation sent successfully!')
            router.push(`/workspaces/${member_id}/apps/admin/users`)
        } catch (error: any) {
            console.error('Failed to invite user:', error)
            const errorMessage = error?.response?.data?.message || error?.message || 'Failed to send invitation'
            toast.error(errorMessage)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <AppBody>
            <div className='flex justify-center'>
                <div className="md:w-[45rem] space-y-6 py-20">
                    <div className="flex items-center gap-4">
                        <Link href={`/workspaces/${member_id}/apps/admin/users`}>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <TbArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Invite User</h1>
                            <p className="text-muted-foreground">
                                Send an invitation to join your workspace
                            </p>
                        </div>
                    </div>

                    <Card className="border shadow-sm">
                        <CardHeader className="pb-6">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <TbUserPlus className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl">User Information</CardTitle>
                                    <CardDescription>
                                        Enter the details for the person you want to invite
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">                                        
                                        <FormField
                                            control={form.control}
                                            name="firstName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="flex items-center gap-2">
                                                        <TbUser className="h-4 w-4" />
                                                        First Name
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Enter first name"
                                                            className="h-11"
                                                            disabled={isSubmitting}
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormDescription>
                                                        The person's first name (2-50 characters)
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="lastName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="flex items-center gap-2">
                                                        <TbUser className="h-4 w-4" />
                                                        Last Name
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Enter last name"
                                                            className="h-11"
                                                            disabled={isSubmitting}
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormDescription>
                                                        The person's last name (2-50 characters)
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>                                    <FormField
                                        control={form.control}
                                        name="middleName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center gap-2">
                                                    <TbUser className="h-4 w-4" />
                                                    Middle Name (Optional)
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Enter middle name"
                                                        className="h-11"
                                                        disabled={isSubmitting}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    Optional middle name or initial
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="primaryEmail"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center gap-2">
                                                    <TbMail className="h-4 w-4" />
                                                    Email Address
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="email"
                                                        placeholder="user@company.com"
                                                        className="h-11"
                                                        disabled={isSubmitting}
                                                        autoComplete="email"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    The invitation will be sent to this email address
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="workPhone"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center gap-2">
                                                    <TbPhone className="h-4 w-4" />
                                                    Work Phone (Optional)
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="tel"
                                                        placeholder="+1 (555) 123-4567"
                                                        className="h-11"
                                                        disabled={isSubmitting}
                                                        autoComplete="tel-work"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    Optional work phone number
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <Separator />

                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="text-lg font-semibold mb-2">Assignment (Optional)</h3>
                                            <p className="text-sm text-muted-foreground mb-4">
                                                Assign the user to a role and team. These can be changed later.
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">                                            <div className="space-y-2">
                                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2">
                                                    <TbShield className="h-4 w-4" />
                                                    Role
                                                </label>
                                                <RoleSelector
                                                    value={selectedRole}
                                                    onChange={(value) => setSelectedRole(value as InputSelectorData)}
                                                    placeholder="Select a role (optional)"
                                                    className="h-11"
                                                    disabled={isSubmitting}
                                                    isMulti={false}
                                                />
                                                <p className="text-xs text-muted-foreground">
                                                    Optional role assignment for the new user
                                                </p>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2">
                                                    <TbUsers className="h-4 w-4" />
                                                    Team
                                                </label>
                                                <TeamSelector
                                                    value={selectedTeam}
                                                    onChange={(value) => setSelectedTeam(value as InputSelectorData)}
                                                    placeholder="Select a team (optional)"
                                                    className="h-11"
                                                    disabled={isSubmitting}
                                                    isMulti={false}
                                                />
                                                <p className="text-xs text-muted-foreground">
                                                    Optional team assignment for the new user
                                                </p>
                                            </div>
                                        </div>
                                    </div>                                    <Separator />

                                    <div className="flex justify-end gap-3 pt-2">
                                        <Link href={`/workspaces/${member_id}/apps/admin/users`}>
                                            <Button variant="outline" type="button" disabled={isSubmitting}>
                                                Cancel
                                            </Button>
                                        </Link>
                                        <Button 
                                            type="submit" 
                                            className="min-w-[140px]" 
                                            disabled={isSubmitting || !form.formState.isValid}
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <TbLoader2 className="h-4 w-4 mr-2 animate-spin" />
                                                    Sending...
                                                </>
                                            ) : (
                                                <>
                                                    <TbUserPlus className="h-4 w-4 mr-2" />
                                                    Send Invitation
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppBody>
    )
}

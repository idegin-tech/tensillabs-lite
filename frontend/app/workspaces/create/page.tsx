'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next13-progressbar'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { TbArrowLeft, TbBuilding, TbLoader2, TbCheck, TbSparkles } from 'react-icons/tb'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import AppLogo from '@/components/AppLogo'
import { useCreateWorkspace } from '@/hooks/use-workspaces'

const createWorkspaceSchema = z.object({
    name: z
        .string()
        .min(1, 'Workspace name is required')
        .max(100, 'Workspace name must not exceed 100 characters')
        .trim(),
    description: z
        .string()
        .max(500, 'Description must not exceed 500 characters')
        .trim()
        .optional(),
})

type CreateWorkspaceForm = z.infer<typeof createWorkspaceSchema>

export default function CreateWorkspacePage() {
    const router = useRouter()
    const createWorkspace = useCreateWorkspace()
    const [isSuccess, setIsSuccess] = useState(false)
    const [createdWorkspaceName, setCreatedWorkspaceName] = useState('')

    const form = useForm<CreateWorkspaceForm>({
        resolver: zodResolver(createWorkspaceSchema),
        defaultValues: {
            name: '',
            description: '',
        },
        mode: 'onChange',
    })

    const onSubmit = async (data: CreateWorkspaceForm) => {
        try {
            const response = await createWorkspace.mutateAsync(data)
            
            setCreatedWorkspaceName(data.name)
            setIsSuccess(true)
            
            toast.success('Workspace created successfully!', {
                description: `"${data.name}" is ready for your team to collaborate.`,
            })

            setTimeout(() => {
                const memberId = response.payload.member._id
                router.push(`/workspaces/${memberId}/apps/admin/users`)
            }, 2500)

        } catch (error: any) {
            console.error('Failed to create workspace:', error)
            const errorMessage = error?.response?.data?.message || error?.message || 'Failed to create workspace'
            toast.error('Failed to create workspace', {
                description: errorMessage,
            })
        }
    }

    const handleCancel = () => {
        router.push('/workspaces')
    }

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
                <div className="container mx-auto px-4 py-20">
                    <div className="max-w-lg mx-auto">
                        <Card className="shadow-2xl border-0 bg-card/80 backdrop-blur-sm">
                            <CardContent className="p-12 text-center space-y-8">
                                <div className="relative">
                                    <div className="mx-auto w-24 h-24 rounded-full bg-green-500/10 flex items-center justify-center mb-6">
                                        <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center animate-pulse">
                                            <TbCheck className="h-8 w-8 text-white" />
                                        </div>
                                    </div>
                                    <div className="absolute -top-2 -right-2">
                                        <TbSparkles className="h-6 w-6 text-yellow-500 animate-bounce" />
                                    </div>
                                </div>
                                
                                <div className="space-y-4">
                                    <h1 className="text-3xl font-bold text-foreground">
                                        Workspace Created!
                                    </h1>
                                    <p className="text-lg text-muted-foreground">
                                        <span className="font-semibold text-foreground">"{createdWorkspaceName}"</span> is ready for your team
                                    </p>
                                </div>

                                <div className="flex items-center justify-center space-x-3 pt-4">
                                    <TbLoader2 className="h-5 w-5 animate-spin text-primary" />
                                    <span className="text-sm text-muted-foreground">
                                        Redirecting to your workspace...
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        )
    }    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(120,119,198,0.1),transparent_50%),radial-gradient(circle_at_80%_20%,rgba(255,119,198,0.1),transparent_50%),radial-gradient(circle_at_40%_40%,rgba(120,200,255,0.05),transparent_50%)]"></div>
            
            <div className="container mx-auto px-4 py-12 relative z-10">
                <div className="max-w-2xl mx-auto">
                    <div className="text-center mb-12">
                        <div className="inline-block p-4 rounded-full bg-primary/10 mb-6">
                            <AppLogo size={80} />
                        </div>
                        <h1 className="text-4xl font-bold text-foreground mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                            Create Your Workspace
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-lg mx-auto">
                            Set up a collaborative environment where your team can organize projects and achieve goals together.
                        </p>
                    </div>

                    <Card className="shadow-2xl border-0 bg-card/80 backdrop-blur-sm">
                        <CardHeader className="pb-8">
                            <CardTitle className="flex items-center gap-3 text-xl">
                                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                    <TbBuilding className="h-5 w-5" />
                                </div>
                                Workspace Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-base font-medium">
                                                    Workspace Name <span className="text-destructive">*</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <Input 
                                                        placeholder="e.g., Acme Corp, Marketing Team, Development Hub"
                                                        disabled={createWorkspace.isPending}
                                                        className="h-12 text-base"
                                                        {...field} 
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="description"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-base font-medium">
                                                    Description
                                                </FormLabel>
                                                <FormControl>
                                                    <Textarea 
                                                        placeholder="Tell your team what this workspace is for..."
                                                        disabled={createWorkspace.isPending}
                                                        rows={4}
                                                        className="text-base resize-none"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <p className="text-sm text-muted-foreground">
                                                    Help your team understand the purpose of this workspace
                                                </p>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="flex gap-4 pt-6">
                                        <Button 
                                            type="button" 
                                            variant="outline" 
                                            onClick={handleCancel}
                                            disabled={createWorkspace.isPending}
                                            className="flex-1 h-12"
                                        >
                                            <TbArrowLeft className="h-4 w-4 mr-2" />
                                            Cancel
                                        </Button>
                                        <Button 
                                            type="submit" 
                                            disabled={createWorkspace.isPending || !form.formState.isValid}
                                            className="flex-1 h-12 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80"
                                        >
                                            {createWorkspace.isPending ? (
                                                <>
                                                    <TbLoader2 className="h-4 w-4 mr-2 animate-spin" />
                                                    Creating...
                                                </>
                                            ) : (
                                                <>
                                                    <TbBuilding className="h-4 w-4 mr-2" />
                                                    Create Workspace
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>

                    <div className="text-center mt-8">
                        <Button
                            variant="ghost"
                            onClick={handleCancel}
                            disabled={createWorkspace.isPending}
                            className="text-muted-foreground hover:text-foreground"
                        >
                            <TbArrowLeft className="h-4 w-4 mr-2" />
                            Back to Workspaces
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

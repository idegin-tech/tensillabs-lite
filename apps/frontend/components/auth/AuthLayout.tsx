'use client'

import React from 'react'
import { TbBuilding, TbShield, TbClock, TbUsers, TbChartLine, TbTarget } from 'react-icons/tb'
import { APP_CONFIG } from '@/config/app.config'
import AppLogo from '../AppLogo'

interface AuthLayoutProps {
    children: React.ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex">
            <div className="flex-1 hidden lg:flex flex-col justify-center px-12 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5">
                <div className="max-w-lg mx-auto text-center space-y-8">
                    <div className="flex items-center justify-center space-x-3 mb-8">
                        <AppLogo />
                        {/* <div className="bg-primary rounded-2xl p-3">
                            <TbBuilding className="h-8 w-8 text-primary-foreground" />
                        </div>
                        <h1 className="text-3xl font-bold text-foreground">{APP_CONFIG.appName}</h1> */}
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-2xl font-semibold text-foreground">
                            All-in-one work management platform
                        </h2>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            {APP_CONFIG.appDescription}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mt-12">
                        <div className="text-center space-y-2">
                            <div className="bg-primary/10 rounded-full p-4 w-16 h-16 mx-auto flex items-center justify-center">
                                <TbTarget className="h-8 w-8 text-primary" />
                            </div>
                            <h3 className="font-semibold text-foreground">Project Management</h3>
                            <p className="text-sm text-muted-foreground">Organize and track your projects</p>
                        </div>

                        <div className="text-center space-y-2">
                            <div className="bg-primary/10 rounded-full p-4 w-16 h-16 mx-auto flex items-center justify-center">
                                <TbClock className="h-8 w-8 text-primary" />
                            </div>
                            <h3 className="font-semibold text-foreground">Time Tracking</h3>
                            <p className="text-sm text-muted-foreground">Monitor productivity and hours</p>
                        </div>

                        <div className="text-center space-y-2">
                            <div className="bg-primary/10 rounded-full p-4 w-16 h-16 mx-auto flex items-center justify-center">
                                <TbUsers className="h-8 w-8 text-primary" />
                            </div>
                            <h3 className="font-semibold text-foreground">Team Collaboration</h3>
                            <p className="text-sm text-muted-foreground">Work together seamlessly</p>
                        </div>

                        <div className="text-center space-y-2">
                            <div className="bg-primary/10 rounded-full p-4 w-16 h-16 mx-auto flex items-center justify-center">
                                <TbChartLine className="h-8 w-8 text-primary" />
                            </div>
                            <h3 className="font-semibold text-foreground">Analytics</h3>
                            <p className="text-sm text-muted-foreground">Insights and reporting</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2 justify-center mt-8 text-sm text-muted-foreground">
                        <TbShield className="h-4 w-4" />
                        <span>Enterprise-grade security and privacy</span>
                    </div>
                </div>
            </div>

            {/* Right side - Auth forms */}
            <div className="flex-1 flex items-center justify-center md:px-8 py-12">
                {children}
            </div>
        </div>
    )
}

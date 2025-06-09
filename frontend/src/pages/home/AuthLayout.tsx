import React from 'react';
import { TbStack3, TbShield, TbUsers, TbScale, TbBolt } from 'react-icons/tb';

import { APP_CONFIG } from '../../config/app.config';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export default function AuthLayout({
  children,
  title,
  subtitle,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary to-secondary relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/20 rounded-full blur-3xl" />
          <div className="absolute top-3/4 left-1/3 w-64 h-64 bg-warning/10 rounded-full blur-2xl" />
        </div>

        <div className="relative z-10 flex flex-col justify-center items-center p-12 text-center w-full">
          <div className="mb-12">
            <div className="mb-6">
              <h1 className="text-5xl font-bold text-primary-foreground mb-4 leading-tight">
                Welcome to
                <br />
                <span className="bg-gradient-to-r from-primary-foreground to-content1 bg-clip-text text-transparent">
                  {APP_CONFIG.name}
                </span>
              </h1>
              <p className="text-xl text-content1 max-w-lg leading-relaxed">
                Transform your workflow with our innovative platform designed
                for modern teams and seamless collaboration.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl w-full">
            <div className="bg-content1/10 backdrop-blur-sm rounded-3xl p-8 border border-content2/20 hover:bg-content1/15 transition-all duration-300">
              <div className="w-16 h-16 bg-success rounded-2xl mb-6 flex items-center justify-center">
                <TbShield className="w-8 h-8 text-success-foreground" />
              </div>
              <h3 className="text-primary-foreground font-bold text-xl mb-3">
                Secure & Reliable
              </h3>
              <p className="text-content1 leading-relaxed">
                Enterprise-grade security with end-to-end encryption
              </p>
            </div>
            <div className="bg-content1/10 backdrop-blur-sm rounded-3xl p-8 border border-content2/20 hover:bg-content1/15 transition-all duration-300">
              <div className="w-16 h-16 bg-warning rounded-2xl mb-6 flex items-center justify-center">
                <TbUsers className="w-8 h-8 text-warning-foreground" />
              </div>
              <h3 className="text-primary-foreground font-bold text-xl mb-3">
                Smart Collaboration
              </h3>
              <p className="text-content1 leading-relaxed">
                Real-time sync and intelligent workflow automation
              </p>
            </div>
            <div className="bg-content1/10 backdrop-blur-sm rounded-3xl p-8 border border-content2/20 hover:bg-content1/15 transition-all duration-300">
              <div className="w-16 h-16 bg-secondary rounded-2xl mb-6 flex items-center justify-center">
                <TbScale className="w-8 h-8 text-secondary-foreground" />
              </div>
              <h3 className="text-primary-foreground font-bold text-xl mb-3">
                Scalable Platform
              </h3>
              <p className="text-content1 leading-relaxed">
                Grows with your team from startup to enterprise
              </p>
            </div>
            <div className="bg-content1/10 backdrop-blur-sm rounded-3xl p-8 border border-content2/20 hover:bg-content1/15 transition-all duration-300">
              <div className="w-16 h-16 bg-danger rounded-2xl mb-6 flex items-center justify-center">
                <TbBolt className="w-8 h-8 text-danger-foreground" />
              </div>
              <h3 className="text-primary-foreground font-bold text-xl mb-3">
                Lightning Fast
              </h3>
              <p className="text-content1 leading-relaxed">
                Optimized performance for instant productivity
              </p>
            </div>
          </div>

          <div className="mt-12 flex items-center gap-8 text-content1">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-success rounded-full" />
              <span className="text-sm">99.9% Uptime</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-warning rounded-full" />
              <span className="text-sm">24/7 Support</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-secondary rounded-full" />
              <span className="text-sm">Global CDN</span>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-content1 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full blur-3xl opacity-20 -translate-y-32 translate-x-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-success/10 to-warning/10 rounded-full blur-2xl opacity-20 translate-y-24 -translate-x-24" />

        <div className="w-full max-w-md relative z-10">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center mx-auto mb-4">
              <TbStack3 className="w-6 h-6 text-primary-foreground" />
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-2">{title}</h2>
            <p className="text-default-500 text-lg">{subtitle}</p>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}

import React from 'react'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TbArrowLeft, TbArrowRight } from 'react-icons/tb';
import { SearchIcon } from 'lucide-react';
import WorkspaceSearch from './WorkspaceSearch';

export default function AppHeader() {
    return (
        <>
            <header className="flex h-12 shrink-0 items-center gap-2 border-b">
                <div className="flex items-center gap-2 px-4 w-full">
                    <SidebarTrigger className="-ml-1" />
                    <div className='flex items-center'>
                        <Button size='icon' variant='ghost'>
                            <TbArrowLeft />
                        </Button>
                        <Button size='icon' variant='ghost'>
                            <TbArrowRight />
                        </Button>
                    </div>


                    <WorkspaceSearch/>

                    <div className='min-w-[100px]'>
                        {/* Leave here empty for now */}
                    </div>
                </div>
            </header>
        </>
    )
}

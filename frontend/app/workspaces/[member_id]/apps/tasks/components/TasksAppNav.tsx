'use client'
import React from 'react'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  TbHome,
  TbBell,
  TbClock,
  TbTrash,
  TbWeight,
} from "react-icons/tb"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import EachSpace from './EachTasksSpace'
import useCommon from '@/hooks/use-common'
import TaskSpacesNavList from './TaskSpacesNavList'

export default function TasksAppNav() {
  const pathname = usePathname()
  const { getPathToApp } = useCommon();
  
  const tasksNavSections = [
    {
      title: "Main",
      items: [
        {
          title: "Home",
          url: `${getPathToApp('tasks')}`,
          icon: TbHome,
        },
        {
          title: "Notifications",
          url: `${getPathToApp('tasks')}/notifications`,
          icon: TbBell,
        },        {
          title: "Timesheet",
          url: `${getPathToApp('tasks')}/timesheet`,
          icon: TbClock,
        },
        {
          title: "Workload",
          url: `${getPathToApp('tasks')}/workload`,
          icon: TbWeight,
        },
        {
          title: "Trash",
          url: `${getPathToApp('tasks')}/trash`,
          icon: TbTrash,
        },
      ]
    },
  ];

  return (
    <>
      {tasksNavSections.map((section) => (
        <SidebarGroup key={section.title}>
          {section.title && <SidebarGroupLabel>{section.title}</SidebarGroupLabel>}
          <SidebarMenu>
            {section.items.map((item) => {
              const isActive = pathname === item.url
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>
      ))}

      <TaskSpacesNavList/>
    </>
  )
}

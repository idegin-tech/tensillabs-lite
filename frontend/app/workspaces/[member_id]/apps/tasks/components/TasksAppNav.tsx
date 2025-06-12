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
  TbTarget,
  TbBulb,
  TbPalette,
  TbCalendar,
  TbCode,
} from "react-icons/tb"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import EachSpace from './EachSpace'
import useCommon from '@/hooks/use-common'

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
        },
        {
          title: "Timesheet",
          url: `${getPathToApp('tasks')}/timesheet`,
          icon: TbClock,
        },
        {
          title: "Trash",
          url: `${getPathToApp('tasks')}/trash`,
          icon: TbTrash,
        },
      ]
    },
  ]

  const mockSpaces = [
    {
      _id: 'marketing-campaign',
      name: 'Marketing Campaign',
      color: '#3b82f6',
      Icon: <TbTarget className="h-3 w-3" />
    },
    {
      _id: 'product-development',
      name: 'Product Development',
      color: '#10b981',
      Icon: <TbBulb className="h-3 w-3" />
    },
    {
      _id: 'design-system',
      name: 'Design System',
      color: '#8b5cf6',
      Icon: <TbPalette className="h-3 w-3" />
    },
    {
      _id: 'event-planning',
      name: 'Event Planning',
      color: '#f59e0b',
      Icon: <TbCalendar className="h-3 w-3" />
    },
    {
      _id: 'engineering',
      name: 'Engineering',
      color: '#ef4444',
      Icon: <TbCode className="h-3 w-3" />
    }
  ]

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

      <SidebarGroup>
        <SidebarGroupLabel>Spaces</SidebarGroupLabel>
        <SidebarMenu>
          {mockSpaces.map((space, index) => (
            <EachSpace
              key={space._id}
              _id={space._id}
              color={space.color}
              Icon={space.Icon}
              name={space.name}
            />
          ))}
        </SidebarMenu>
      </SidebarGroup>
    </>
  )
}

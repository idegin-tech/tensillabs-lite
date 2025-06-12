'use client'
import React from 'react'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  TbHome,
  TbBell,
  TbClock,
  TbTrash,
} from "react-icons/tb"
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function TasksAppNav() {
  const pathname = usePathname()

  const tasksNavSections = [
    {
      title: "Main",
      items: [
        {
          title: "Home",
          url: "#",
          icon: TbHome,
        },
        {
          title: "Notifications",
          url: "#",
          icon: TbBell,
        },
        {
          title: "Timesheet",
          url: "#",
          icon: TbClock,
        },
        {
          title: "Trash",
          url: "#",
          icon: TbTrash,
        },
      ]
    },
  ]
  return (
    <>
      {tasksNavSections.map((section) => (
        <SidebarGroup key={section.title}>
          {section.title && <SidebarGroupLabel>{section.title}</SidebarGroupLabel>}          <SidebarMenu>
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
    </>
  )
}

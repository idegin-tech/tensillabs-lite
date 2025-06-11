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

export default function AIAappNav() {
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
          {section.title && <SidebarGroupLabel>{section.title}</SidebarGroupLabel>}
          <SidebarMenu>
            {section.items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <Link href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </>
  )
}

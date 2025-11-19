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
  TbBrain,
  TbFolderOpen,
  TbSettings,
  TbMessageCircle,
} from "react-icons/tb"
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function AIAppNav() {
  const pathname = usePathname()

  const aiNavSections = [
    {
      title: "AI Assistant",
      items: [
        {
          title: "New Chat",
          url: "#",
          icon: TbMessageCircle,
        },
        {
          title: "Knowledge",
          url: "#",
          icon: TbBrain,
        },
        {
          title: "Folders",
          url: "#",
          icon: TbFolderOpen,
        },
        {
          title: "Settings",
          url: "#",
          icon: TbSettings,
        },
      ]
    },
  ]
  return (
    <>
      {aiNavSections.map((section) => (
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

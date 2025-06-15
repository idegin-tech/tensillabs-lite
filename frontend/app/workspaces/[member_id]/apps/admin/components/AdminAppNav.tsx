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
  TbDashboard,
  TbUsers,
  TbCreditCard,
  TbBuilding,
  TbUserCheck,
  TbShield,
  TbUsersGroup,
  TbSettings,
  TbFolders,
} from "react-icons/tb"
import Link from 'next/link'
import useCommon from '@/hooks/use-common'
import { usePathname } from 'next/navigation'

export default function AuthAppNav() {
  const {getPathToApp} = useCommon();
  const pathname = usePathname()

  const adminNavSections = [
    {
      title: "Organization",
      items: [
        {
          title: "Overview",
          url: `${getPathToApp('admin')}`,
          icon: TbDashboard,
        },
        {
          title: "Projects",
          url: `${getPathToApp('admin')}/projects`,
          icon: TbFolders,
        },
        {
          title: "Offices",
          url: `${getPathToApp('admin')}/offices`,
          icon: TbBuilding,
        },
        {
          title: "Clients",
          url: `${getPathToApp('admin')}/clients`,
          icon: TbUserCheck,
        },
        {
          title: "Billing",
          url: `${getPathToApp('admin')}/billing`,
          icon: TbCreditCard,
        },
        {
          title: "Settings",
          url: `${getPathToApp('admin')}/settings`,
          icon: TbSettings,
        },
      ]
    },
    {
      title: "User Management",
      items: [
        {
          title: "Users",
          url: `${getPathToApp('admin')}/users`,
          icon: TbUsers,
        },
        {
          title: "Roles",
          url: `${getPathToApp('admin')}/roles`,
          icon: TbShield,
        },
        {
          title: "Teams",
          url: `${getPathToApp('admin')}/teams`,
          icon: TbUsersGroup,
        },
      ]
    },

  ]
  return (
    <>
      {adminNavSections.map((section) => (
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
    </>
  )
}

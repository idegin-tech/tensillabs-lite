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
} from "react-icons/tb"
import Link from 'next/link'

export default function AuthAppNav() {
  const adminNavSections = [
    {
      title: "Organization",
      items: [
        {
          title: "Overview",
          url: "#",
          icon: TbDashboard,
        },
        {
          title: "Offices",
          url: "#",
          icon: TbBuilding,
        },
        {
          title: "Clients",
          url: "#",
          icon: TbUserCheck,
        },
        {
          title: "Billing",
          url: "#", 
          icon: TbCreditCard,
        },
        {
          title: "Settings",
          url: "#",
          icon: TbSettings,
        },
      ]
    },
    {
      title: "User Management",
      items: [
        {
          title: "Users",
          url: "#",
          icon: TbUsers,
        },
        {
          title: "Roles",
          url: "#",
          icon: TbShield,
        },
        {
          title: "Teams",
          url: "#",
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

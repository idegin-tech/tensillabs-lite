
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
  TbUser,
  TbCalendarEvent,
  TbUsers,
  TbUserPlus,
  TbClipboardList,
  TbChartBar,
  TbSettings,
  TbClock,
  TbCalendarCheck,
  TbCalendarOff,
  TbBell,
} from "react-icons/tb"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import useCommon from '@/hooks/use-common'

export default function PeopleAppNav() {
  const pathname = usePathname()
  const { getPathToApp } = useCommon();
  
  const peopleNavSections = [    {
      title: "Personal",
      items: [
        {
          title: "For You",
          url: `${getPathToApp('people')}`,
          icon: TbUser,
        },
        {
          title: "Notifications",
          url: `${getPathToApp('people')}/notifications`,
          icon: TbBell,
        },
        {
          title: "My Attendance",
          url: `${getPathToApp('people')}/my-attendance`,
          icon: TbCalendarCheck,
        },
        {
          title: "My Timesheet",
          url: `${getPathToApp('people')}/my-timesheet`,
          icon: TbClock,
        },
        {
          title: "Leave Requests",
          url: `${getPathToApp('people')}/leave-requests`,
          icon: TbCalendarOff,
        },
      ]
    },
    {
      title: "Team Management",
      items: [
        {
          title: "Employees",
          url: `${getPathToApp('people')}/employees`,
          icon: TbUsers,
        },
        {
          title: "Attendance",
          url: `${getPathToApp('people')}/attendance`,
          icon: TbCalendarEvent,
        },
        {
          title: "Onboarding",
          url: `${getPathToApp('people')}/onboarding`,
          icon: TbUserPlus,
        },
        {
          title: "Performance",
          url: `${getPathToApp('people')}/performance`,
          icon: TbChartBar,
        },
      ]
    },
    {
      title: "Administration",
      items: [
        {
          title: "Policies",
          url: `${getPathToApp('people')}/policies`,
          icon: TbClipboardList,
        },
        {
          title: "Settings",
          url: `${getPathToApp('people')}/settings`,
          icon: TbSettings,
        },
      ]
    },
  ];

  return (
    <>
      {peopleNavSections.map((section) => (
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


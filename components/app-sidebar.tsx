// components/app-sidebar.tsx
"use client";

import * as React from "react";
import {
  BookOpenCheck,
  Building2,
  Users,
  Clock8,
  Book,
  Pencil,
  Frame,
  LifeBuoy,
  Map,
  PieChart,
  Send,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { SignedOut, SignedIn } from "@clerk/nextjs";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  // SidebarHeader,
  // SidebarMenu,
} from "@/components/ui/sidebar";
// import { ThemeToggle } from "./theme/theme-toggle"; 

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Estudiantes",
      url: "/estudiantes/",
      icon: Pencil,

      items: [
        {
          title: "Ver",
          url: "/estudiantes/",
        },
        {
          title: "Crear",
          url: "/estudiantes/create/",
        },
      ],
    },
    {
      title: "Horarios",
      url: "/horarios",
      icon: Clock8,

      items: [
        {
          title: "Ver",
          url: "/horarios/",
        },
        {
          title: "Crear",
          url: "/horarios/create",
        },
      ],
    },
    {
      title: "Maestros",
      url: "/maestros/",
      icon: Users,
      items: [
        {
          title: "Ver",
          url: "/maestros/",
        },
        {
          title: "Crear",
          url: "/maestros/create",
        },
      ],
    },
    {
      title: "Materias",
      url: "/materias",
      icon: Book,
      items: [
        {
          title: "Ver",
          url: "/materias/",
        },
        {
          title: "Crear",
          url: "/materias/create/",
        },
      ],
    },
    {
      title: "Salones",
      url: "/salones/",
      icon: Building2,

      items: [
        {
          title: "Ver",
          url: "/salones/",
        },
        {
          title: "Crear",
          url: "/salones/create/",
        },
      ],
    },
    {
      title: "Calificaciones",
      url: "/calificaciones",
      icon: BookOpenCheck,
      items: [
        {
          title: "Ver",
          url: "/calificaciones",
        },
        {
          title: "Crear",
          url: "/calificaciones/create",
        },
      ],
    },
    // {
    //   title: "Settings",
    //   url: "#",
    //   icon: Settings2,
    //   items: [
    //     {
    //       title: "General",
    //       url: "#",
    //     },
    //     {
    //       title: "Team",
    //       url: "",
    //     },
    //     {
    //       title: "Billing",
    //       url: "#",
    //     },
    //     {
    //       title: "Limits",
    //       url: "#",
    //     },
    //   ],
    // },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      className="top-(--header-height) h-[calc(101svh-var(--header-height))]!"
      {...props}
    >
      {/*<SidebarHeader>
         <SidebarMenu>
        </SidebarMenu> 
      </SidebarHeader>*/}
      <SidebarContent>
        <SignedOut>
          <NavUser />
        </SignedOut>

        <SignedIn>
          <NavMain items={data.navMain} />
        </SignedIn>
      </SidebarContent>
      {/* <ThemeToggle /> */}
      <SidebarFooter>
        <SignedIn>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <NavUser/>
          </div>
        </SignedIn>
      </SidebarFooter>
    </Sidebar>
  );
}

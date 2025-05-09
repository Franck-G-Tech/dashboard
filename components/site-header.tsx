"use client";

import React from 'react';
import { SidebarIcon } from "lucide-react";
import { ThemeToggle } from "./theme/theme-toggle";
import { SearchForm } from "@/components/search-form";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useSidebar } from "@/components/ui/sidebar";
import useBreadcrumb from '@/hooks/use-breadcrumb';

export function SiteHeader() {
  const { toggleSidebar } = useSidebar();
  const breadcrumbPath = useBreadcrumb();

  return (
    <header className="bg-background sticky top-0 z-50 flex w-full items-center border-b">
      <div className="flex h-(--header-height) w-full items-center gap-2 px-4">
        <Button
          className="h-8 w-8"
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
        >
          <SidebarIcon />
        </Button>
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb className="hidden sm:block">
          <BreadcrumbList>
            {Array.isArray(breadcrumbPath) && breadcrumbPath.map((item, index) => (
              <React.Fragment key={index}>
                {index < breadcrumbPath.length - 1 ? (
                  <BreadcrumbItem>
                    <BreadcrumbLink href={`/${breadcrumbPath.slice(1, index + 1).map(i => i.slug).join('/')}`}>
                      {item.label}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                ) : (
                  <BreadcrumbItem>
                    <BreadcrumbPage>{item.label}</BreadcrumbPage>
                  </BreadcrumbItem>
                )}
                {index < breadcrumbPath.length - 1 && <BreadcrumbSeparator />}
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>

        
          <SearchForm className="w-full sm:ml-auto sm:w-auto" />
          <ThemeToggle />
        
      </div>
    </header>
  );
}
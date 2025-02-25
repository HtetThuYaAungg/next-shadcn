"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  const pathname = usePathname();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const isActive =
            item.url === pathname ||
            item.items?.some((subItem) => subItem.url === pathname);
          return (
            <Collapsible
              key={item.title}
              defaultOpen={isActive}
              className="group/collapsible"
            >
              <TooltipProvider>
                <Tooltip delayDuration={100}>
                  <TooltipTrigger asChild>
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          className={`${isActive ? "text-red-500" : ""}`}
                        >
                          {item.icon && <item.icon />}
                          <span>{item.title}</span>
                          {item.items && !isCollapsed && (
                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                          )}
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                    </SidebarMenuItem>
                  </TooltipTrigger>
                  {isCollapsed && item.items ? (
                    <TooltipContent
                      side="right"
                      className="w-48 p-2 ml-2 bg-sidebar-accent"
                    >
                      {isCollapsed && item.items && (
                        <div className="flex flex-col py-1 text-primary">
                          <span className="px-2 pt-1 pb-3 font-semibold">
                            {item.title}
                          </span>
                          {item.items.map((subItem) => (
                            <Link
                              key={subItem.title}
                              href={subItem.url}
                              className={`px-2 py-1.5 hover:bg-foreground/5 rounded-md ${
                                subItem.url === pathname
                                  ? "bg-red-500 text-white hover:text-foreground"
                                  : ""
                              }`}
                            >
                              {subItem.title}
                            </Link>
                          ))}
                        </div>
                      )}
                    </TooltipContent>
                  ) : (
                    <></>
                  )}
                </Tooltip>
              </TooltipProvider>
              {!isCollapsed && item.items && (
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton
                          asChild
                          isActive={subItem.url === pathname}
                        >
                          <Link href={subItem.url}>
                            <span>{subItem.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              )}
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}

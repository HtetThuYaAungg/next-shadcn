import { AppSidebar } from "@/components/app-sidebar";
import DynamicBreadcrumb from "@/components/bread_crumb";
import { ThemeProvider } from "@/components/theme-provider";
import { ToggleMode } from "@/components/toggle-mode";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import React from "react";

const Main = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <SidebarProvider
          style={
            {
              "--sidebar-width": "250px",
            } as React.CSSProperties
          }
        >
          <AppSidebar />
          <SidebarInset>
            <header className="sticky top-0 flex shrink-0 items-center justify-between gap-2 border-b bg-background p-1 px-2">
              <div className="flex items-center">
                <SidebarTrigger className="-ml-1 mr-2" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <DynamicBreadcrumb />
              </div>

              <ToggleMode />
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
          </SidebarInset>
        </SidebarProvider>
      </ThemeProvider>
    </>
  );
};

export default Main;

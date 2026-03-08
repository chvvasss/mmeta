"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { Sidebar } from "@/components/layout/Sidebar"
import { Topbar } from "@/components/layout/Topbar"
import { MobileNav } from "@/components/layout/MobileNav"
import { cn } from "@/lib/utils"
import { NAV_ITEMS } from "@/lib/constants"

function getPageTitle(pathname: string): string {
  if (pathname === "/") return "Dashboard"
  const item = NAV_ITEMS.find(
    (item) => item.href !== "/" && pathname.startsWith(item.href)
  )
  return item?.label || "Dashboard"
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const title = getPageTitle(pathname)

  return (
    <div className="min-h-screen bg-[#06090f] grid-pattern">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      </div>

      {/* Main Content */}
      <div
        className={cn(
          "transition-all duration-300 md:pb-0 pb-16",
          collapsed ? "md:ml-16" : "md:ml-60"
        )}
      >
        <Topbar title={title} />
        <main className="p-6">{children}</main>
      </div>

      {/* Mobile Bottom Nav */}
      <MobileNav />
    </div>
  )
}

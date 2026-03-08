"use client"

import { Bell, RefreshCw, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DateRangePicker } from "@/components/shared/DateRangePicker"
import { useAlerts } from "@/hooks/use-alerts"
import { useQueryClient } from "@tanstack/react-query"
import { signOut } from "next-auth/react"
import { useState } from "react"

interface TopbarProps {
  title: string
}

export function Topbar({ title }: TopbarProps) {
  const alertsQuery = useAlerts()
  const queryClient = useQueryClient()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const unreadCount = alertsQuery.data?.meta?.unreadCount || 0

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await queryClient.invalidateQueries({ queryKey: ["meta"] })
    await queryClient.invalidateQueries({ queryKey: ["alerts"] })
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-[rgba(148,163,184,0.06)] bg-[#06090f]/80 px-6 backdrop-blur-xl">
      <h1
        className="text-base font-semibold text-white tracking-tight"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        {title}
      </h1>

      <div className="flex items-center gap-2">
        <DateRangePicker />

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-slate-500 hover:text-white hover:bg-slate-800/50"
          title="Verileri yenile"
          onClick={handleRefresh}
        >
          <RefreshCw className={`h-3.5 w-3.5 transition-transform ${isRefreshing ? "animate-spin" : ""}`} />
        </Button>

        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="relative h-8 w-8 text-slate-500 hover:text-white hover:bg-slate-800/50"
        >
          <Bell className="h-3.5 w-3.5" />
          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white shadow-lg shadow-red-500/30">
              {unreadCount}
            </span>
          )}
        </Button>

        {/* Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-slate-800/50 transition-colors">
            <Avatar className="h-7 w-7">
              <AvatarFallback className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 text-xs text-blue-300 border border-blue-500/20">
                <User className="h-3.5 w-3.5" />
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-48 border-[rgba(148,163,184,0.08)] bg-[#0c1220]"
          >
            <DropdownMenuItem className="text-slate-300 focus:bg-slate-800 focus:text-white text-xs">
              Profil
            </DropdownMenuItem>
            <DropdownMenuItem className="text-slate-300 focus:bg-slate-800 focus:text-white text-xs">
              Ayarlar
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[rgba(148,163,184,0.08)]" />
            <DropdownMenuItem
              onClick={() => signOut()}
              className="text-red-400 focus:bg-slate-800 focus:text-red-300 text-xs"
            >
              Çıkış Yap
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

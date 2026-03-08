"use client"

import { useAccountStore } from "@/stores/account-store"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Building2 } from "lucide-react"

export function AccountSwitcher() {
  const { accounts, activeAccountId, setActiveAccount } = useAccountStore()

  if (accounts.length === 0) {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-slate-800/50 px-3 py-2">
        <Building2 className="h-4 w-4 text-slate-500" />
        <span className="text-xs text-slate-500">Hesap bağlanmadı</span>
      </div>
    )
  }

  return (
    <Select value={activeAccountId || ""} onValueChange={(val) => { if (val) setActiveAccount(val) }}>
      <SelectTrigger className="h-9 border-slate-700 bg-slate-800/50 text-xs text-slate-300">
        <SelectValue placeholder="Hesap seçin" />
      </SelectTrigger>
      <SelectContent className="border-slate-700 bg-slate-800">
        {accounts.map((account) => (
          <SelectItem
            key={account.id}
            value={account.id}
            className="text-xs text-slate-300 focus:bg-slate-700 focus:text-white"
          >
            <div className="flex flex-col">
              <span>{account.name}</span>
              <span className="text-slate-500">{account.id}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

import { create } from "zustand"
import { persist } from "zustand/middleware"

interface AdAccountInfo {
  id: string
  name: string
  currency: string
  timezone: string
  status: number
  businessName?: string
}

interface AccountStore {
  activeAccountId: string | null
  accounts: AdAccountInfo[]
  setActiveAccount: (id: string) => void
  setAccounts: (accounts: AdAccountInfo[]) => void
  getActiveAccount: () => AdAccountInfo | undefined
}

export const useAccountStore = create<AccountStore>()(
  persist(
    (set, get) => ({
      activeAccountId: null,
      accounts: [],
      setActiveAccount: (id) => set({ activeAccountId: id }),
      setAccounts: (accounts) =>
        set((state) => ({
          accounts,
          activeAccountId: state.activeAccountId || accounts[0]?.id || null,
        })),
      getActiveAccount: () => {
        const { accounts, activeAccountId } = get()
        return accounts.find((a) => a.id === activeAccountId)
      },
    }),
    { name: "meta-ads-account" }
  )
)

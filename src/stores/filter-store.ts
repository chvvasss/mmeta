import { create } from "zustand"

interface FilterStore {
  statusFilter: string[]
  searchQuery: string
  setStatusFilter: (statuses: string[]) => void
  setSearchQuery: (query: string) => void
  resetFilters: () => void
}

export const useFilterStore = create<FilterStore>()((set) => ({
  statusFilter: [],
  searchQuery: "",
  setStatusFilter: (statusFilter) => set({ statusFilter }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  resetFilters: () => set({ statusFilter: [], searchQuery: "" }),
}))

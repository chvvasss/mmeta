import type { MetaAdLibraryResult } from "./types"

export async function searchAdLibrary(params: {
  searchTerms: string
  country?: string
  activeStatus?: string
}): Promise<MetaAdLibraryResult[]> {
  console.log("searchAdLibrary stub", params)
  return []
}

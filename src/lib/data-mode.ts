import type { Session } from "next-auth"

export type DataMode = "live" | "demo"

export function getDataMode(session: Session | null): DataMode {
  if (!session) return "demo"

  const s = session as Session & { accessToken?: string; dataMode?: string }

  if (s.dataMode === "live" && s.accessToken) {
    return "live"
  }

  return "demo"
}

export function getAccessToken(session: Session | null): string | null {
  if (!session) return null
  const s = session as Session & { accessToken?: string }
  return s.accessToken || null
}

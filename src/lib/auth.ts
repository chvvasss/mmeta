import NextAuth from "next-auth"
import Facebook from "next-auth/providers/facebook"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import bcrypt from "bcryptjs"
import { db } from "./db"

// Exchange short-lived token for long-lived token (60 days)
async function exchangeForLongLivedToken(shortLivedToken: string): Promise<{
  access_token: string
  expires_in: number
} | null> {
  try {
    const appId = process.env.FACEBOOK_CLIENT_ID
    const appSecret = process.env.FACEBOOK_CLIENT_SECRET
    if (!appId || !appSecret) return null

    const url = new URL("https://graph.facebook.com/v22.0/oauth/access_token")
    url.searchParams.set("grant_type", "fb_exchange_token")
    url.searchParams.set("client_id", appId)
    url.searchParams.set("client_secret", appSecret)
    url.searchParams.set("fb_exchange_token", shortLivedToken)

    const res = await fetch(url.toString())
    if (!res.ok) return null

    const data = await res.json()
    return {
      access_token: data.access_token,
      expires_in: data.expires_in || 5184000, // 60 days default
    }
  } catch {
    console.error("[Auth] Failed to exchange for long-lived token")
    return null
  }
}

// Verify token validity with Meta Graph API
async function verifyMetaToken(token: string): Promise<boolean> {
  try {
    const res = await fetch(
      `https://graph.facebook.com/v22.0/me?access_token=${token}`
    )
    return res.ok
  } catch {
    return false
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db) as never,
  providers: [
    Facebook({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
      authorization: {
        params: {
          // Start with basic scopes — advanced scopes need App Review
          scope: "public_profile,email",
        },
      },
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await db.user.findUnique({
          where: { email: credentials.email as string },
        })

        if (!user || !user.password) return null

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        )
        if (!isValid) return null

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, account, user, trigger }) {
      // Initial sign-in
      if (account && user) {
        token.provider = account.provider
        token.userId = user.id

        if (account.provider === "facebook" && account.access_token) {
          // Exchange short-lived token for long-lived token
          const longLived = await exchangeForLongLivedToken(account.access_token)

          if (longLived) {
            token.accessToken = longLived.access_token
            token.tokenExpiry = Date.now() + longLived.expires_in * 1000
          } else {
            token.accessToken = account.access_token
            token.tokenExpiry = account.expires_at
              ? account.expires_at * 1000
              : Date.now() + 3600 * 1000
          }

          token.dataMode = "live"
        } else {
          // Credentials login — demo mode
          token.dataMode = "demo"
        }
      }

      // Check token expiry on subsequent requests
      if (token.accessToken && token.tokenExpiry) {
        const expiryTime = token.tokenExpiry as number
        const isExpired = Date.now() > expiryTime
        const isExpiringSoon = Date.now() > expiryTime - 24 * 60 * 60 * 1000 // 1 day before

        if (isExpired) {
          token.dataMode = "demo"
          token.accessToken = undefined
          token.tokenExpiry = undefined
        } else if (isExpiringSoon) {
          token.tokenExpiring = true
        }
      }

      return token
    },

    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.userId as string,
        },
        accessToken: token.accessToken as string | undefined,
        provider: token.provider as string,
        dataMode: (token.dataMode as string) || "demo",
        tokenExpiring: (token.tokenExpiring as boolean) || false,
      }
    },

    authorized({ auth: session, request: { nextUrl } }) {
      const isLoggedIn = !!session?.user
      const isOnLogin = nextUrl.pathname.startsWith("/login")
      const isApiAuth = nextUrl.pathname.startsWith("/api/auth")

      if (isApiAuth) return true
      if (isOnLogin) {
        if (isLoggedIn) return Response.redirect(new URL("/", nextUrl))
        return true
      }

      return isLoggedIn
    },
  },
})

// Type augmentation for session
declare module "next-auth" {
  interface Session {
    accessToken?: string
    provider: string
    dataMode: "live" | "demo"
    tokenExpiring: boolean
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    accessToken?: string
    provider?: string
    userId?: string
    dataMode?: string
    tokenExpiry?: number
    tokenExpiring?: boolean
  }
}

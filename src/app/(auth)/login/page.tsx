"use client"

import { signIn } from "next-auth/react"
import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

function LoginContent() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [showCredentials, setShowCredentials] = useState(false)
  const [error, setError] = useState("")
  const searchParams = useSearchParams()
  const authError = searchParams.get("error")

  async function handleCredentialsLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      setError("Email veya şifre hatalı")
      setLoading(false)
    } else {
      window.location.href = "/"
    }
  }

  async function handleFacebookLogin() {
    setLoading(true)
    await signIn("facebook", { callbackUrl: "/" })
  }

  async function handleDemoLogin() {
    setLoading(true)
    setError("")

    const result = await signIn("credentials", {
      email: "admin@metaboost.com",
      password: "Admin123!",
      redirect: false,
    })

    if (result?.error) {
      setError("Demo hesabı bulunamadı")
      setLoading(false)
    } else {
      window.location.href = "/"
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-[420px] flex-col items-center">
      {/* Logo & Brand */}
      <div className="mb-10 flex flex-col items-center text-center">
        {/* Animated logo mark */}
        <div className="relative mb-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-xl">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M16 2L28 9V23L16 30L4 23V9L16 2Z" stroke="url(#logo-grad)" strokeWidth="1.5" fill="none" />
              <path d="M16 8L22 11.5V18.5L16 22L10 18.5V11.5L16 8Z" fill="url(#logo-grad)" opacity="0.3" />
              <circle cx="16" cy="15" r="3" fill="url(#logo-grad)" />
              <defs>
                <linearGradient id="logo-grad" x1="4" y1="2" x2="28" y2="30">
                  <stop stopColor="#3B82F6" />
                  <stop offset="1" stopColor="#06B6D4" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          {/* Pulse ring */}
          <div className="absolute inset-0 rounded-2xl animate-ping opacity-10"
            style={{ background: "linear-gradient(135deg, #3B82F6, #06B6D4)", animationDuration: "3s" }}
          />
        </div>

        <h1
          className="text-3xl font-bold tracking-tight text-white"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Command Center
        </h1>
        <p className="mt-2 text-sm text-slate-400 max-w-[280px] leading-relaxed">
          Meta reklam kampanyalarınızı tek panelden yönetin, analiz edin ve optimize edin.
        </p>
      </div>

      {/* Auth error from OAuth */}
      {authError && (
        <div className="mb-4 w-full rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
          {authError === "OAuthCallback"
            ? "Facebook bağlantısında bir sorun oluştu. Lütfen tekrar deneyin."
            : authError === "AccessDenied"
            ? "Erişim reddedildi. Lütfen gerekli izinleri onaylayın."
            : "Giriş sırasında bir hata oluştu."}
        </div>
      )}

      {/* Login card */}
      <div className="w-full rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6 backdrop-blur-xl">
        {/* Facebook Login — Primary CTA */}
        <button
          onClick={handleFacebookLogin}
          disabled={loading}
          className="group relative flex w-full items-center justify-center gap-3 rounded-xl px-5 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #1877F2 0%, #0C63D4 100%)",
          }}
        >
          {/* Shine effect */}
          <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="relative">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          <span className="relative">Facebook ile Bağlan</span>
        </button>

        <p className="mt-2.5 text-center text-[11px] text-slate-500">
          Reklam hesaplarınıza erişim için Facebook ile giriş yapın
        </p>

        {/* Divider */}
        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <span className="text-[10px] font-medium uppercase tracking-widest text-slate-500">
            veya
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>

        {/* Demo Login */}
        <button
          onClick={handleDemoLogin}
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-5 py-3 text-sm font-medium text-slate-300 transition-all duration-200 hover:border-white/[0.15] hover:bg-white/[0.06] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-cyan-400">
            <path d="M8 1L14 4.5V11.5L8 15L2 11.5V4.5L8 1Z" stroke="currentColor" strokeWidth="1.2" />
            <circle cx="8" cy="8" r="2" fill="currentColor" opacity="0.5" />
          </svg>
          Demo Hesabı ile Keşfet
        </button>

        {/* Credentials toggle */}
        <button
          onClick={() => setShowCredentials(!showCredentials)}
          className="mt-3 flex w-full items-center justify-center gap-1.5 py-2 text-xs text-slate-500 transition-colors hover:text-slate-300"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className={`transition-transform duration-200 ${showCredentials ? "rotate-90" : ""}`}
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
          Email ile giriş
        </button>

        {/* Credentials form — collapsible */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-out ${
            showCredentials ? "max-h-[300px] opacity-100 mt-2" : "max-h-0 opacity-0"
          }`}
        >
          {error && (
            <div className="mb-3 rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2 text-xs text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleCredentialsLogin} className="space-y-3">
            <div>
              <label htmlFor="email" className="mb-1 block text-xs font-medium text-slate-400">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                required
                className="w-full rounded-lg border border-white/[0.08] bg-white/[0.04] px-3.5 py-2.5 text-sm text-white placeholder:text-slate-600 outline-none transition-all focus:border-blue-500/40 focus:ring-1 focus:ring-blue-500/20"
              />
            </div>
            <div>
              <label htmlFor="password" className="mb-1 block text-xs font-medium text-slate-400">
                Şifre
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full rounded-lg border border-white/[0.08] bg-white/[0.04] px-3.5 py-2.5 text-sm text-white placeholder:text-slate-600 outline-none transition-all focus:border-blue-500/40 focus:ring-1 focus:ring-blue-500/20"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg border border-white/[0.1] bg-white/[0.06] py-2.5 text-sm font-medium text-white transition-all hover:bg-white/[0.1] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="32" strokeLinecap="round" className="opacity-25" />
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="32" strokeDashoffset="24" strokeLinecap="round" />
                  </svg>
                  Giriş yapılıyor...
                </span>
              ) : (
                "Giriş Yap"
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 flex flex-col items-center gap-2">
        <div className="flex items-center gap-1.5 text-[10px] text-slate-600">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500/60 animate-pulse" />
          Tüm veriler şifrelenmiş bağlantı ile iletilir
        </div>
        <p className="text-[10px] text-slate-700">
          Meta Ads Command Center v1.0
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  )
}

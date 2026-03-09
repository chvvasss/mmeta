import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#06090f]">
      <div className="max-w-md text-center">
        <div className="mb-4 text-7xl font-bold text-slate-800">404</div>
        <h2 className="mb-2 text-lg font-semibold text-white">Sayfa Bulunamadi</h2>
        <p className="mb-6 text-sm text-slate-400">
          Aradiginiz sayfa mevcut degil veya tasindi.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-500/20 px-4 py-2 text-sm font-medium text-blue-400 border border-blue-500/20 transition-all hover:bg-blue-500/30"
        >
          Dashboard&apos;a Don
        </Link>
      </div>
    </div>
  )
}

export default function DashboardLoading() {
  return (
    <div className="px-4 py-8 lg:px-8 animate-pulse">
      {/* Header skeleton */}
      <div className="mb-8">
        <div className="h-7 w-36 rounded-md bg-white/[0.06]" />
        <div className="mt-2 h-4 w-64 rounded-md bg-white/[0.04]" />
      </div>

      {/* Stats grid skeleton */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-white/[0.06] bg-brand-surface-light p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="h-4 w-20 rounded bg-white/[0.06]" />
              <div className="size-9 rounded-lg bg-white/[0.06]" />
            </div>
            <div className="h-7 w-24 rounded bg-white/[0.06]" />
            <div className="mt-2 h-3 w-16 rounded bg-white/[0.04]" />
          </div>
        ))}
      </div>

      {/* Content skeleton */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-white/[0.06] bg-brand-surface-light p-6 lg:col-span-2">
          <div className="h-5 w-32 rounded bg-white/[0.06] mb-6" />
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-10 rounded bg-white/[0.04]" />
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-brand-surface-light p-6">
          <div className="h-5 w-28 rounded bg-white/[0.06] mb-6" />
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-12 rounded bg-white/[0.04]" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

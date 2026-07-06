export function LiffLoading() {
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto space-y-5 pt-4">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-surface-container animate-pulse" />
            <div className="w-20 h-4 rounded bg-surface-container animate-pulse" />
          </div>
          <div className="w-24 h-4 rounded bg-surface-container animate-pulse" />
        </div>

        <div className="bento-card p-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-surface-container animate-pulse shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="w-12 h-3 rounded bg-surface-container animate-pulse" />
              <div className="w-32 h-5 rounded bg-surface-container animate-pulse" />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="w-16 h-4 rounded bg-surface-container animate-pulse" />
          <div className="grid grid-cols-2 gap-3">
            <div className="bento-card p-5 h-32 flex flex-col items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-surface-container animate-pulse" />
              <div className="w-16 h-4 rounded bg-surface-container animate-pulse" />
            </div>
            <div className="bento-card p-5 h-32 flex flex-col items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-surface-container animate-pulse" />
              <div className="w-16 h-4 rounded bg-surface-container animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

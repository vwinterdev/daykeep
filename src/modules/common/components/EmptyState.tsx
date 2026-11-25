import type { ReactNode } from 'react'

export function EmptyState({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <section className="overflow-hidden rounded-[17px] border border-card-line bg-background" aria-labelledby="empty-title">
      <div className="grid h-[156px] place-items-center border-b border-card-line bg-sage bg-[radial-gradient(var(--theme-art-dots)_1px,transparent_1px)] bg-[length:14px_14px] bg-center text-primary">
        {children}
      </div>
      <div className="px-[17px] pt-3.5 pb-4">
        <h2 className="text-xl leading-tight font-[720] tracking-[-.025em]" id="empty-title">{title}</h2>
        <p className="mt-[5px] max-w-[32ch] text-sm leading-[1.55] text-muted-foreground">{description}</p>
      </div>
    </section>
  )
}

export function EmptyStateIcon({ children }: { children: ReactNode }) {
  return (
    <div className="grid size-[94px] place-items-center rounded-3xl border border-art-border bg-art-paper shadow-art">
      {children}
    </div>
  )
}

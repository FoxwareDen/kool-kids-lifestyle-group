import type { ReactNode } from 'react'

export const Field = ({ label, children }: { label: string; children: ReactNode }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--brand-navy)]/55">{label}</label>
    {children}
  </div>
)
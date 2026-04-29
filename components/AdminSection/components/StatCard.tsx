import type { ReactNode } from 'react'

interface StatCardProps {
  label: string
  value: string | number
  subtext?: ReactNode
  icon: ReactNode
  iconBg: string
  accent?: string // optional bottom-border color
}

export default function StatCard({ label, value, subtext, icon, iconBg, accent }: StatCardProps) {
  return (
    <div className={`
      relative overflow-hidden group
      bg-white dark:bg-[#141414]
      border border-[#e8e8e8] dark:border-[#1f1f1f]
      rounded-2xl p-5 flex flex-col gap-0
      transition-shadow hover:shadow-md dark:hover:shadow-black/30
      ${accent ? `border-b-2` : ''}
    `}
    style={accent ? { borderBottomColor: accent } : undefined}
    >
      {/* Subtle dot-grid texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025] dark:opacity-[0.05]"
        style={{
          backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
          backgroundSize: '18px 18px',
        }}
      />

      <div className="relative flex items-start justify-between mb-4">
        <p className="text-[10.5px] font-bold text-[#a3a3a3] dark:text-[#525252] uppercase tracking-widest leading-none pt-0.5 pr-2">
          {label}
        </p>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg} transition-transform group-hover:scale-110`}>
          {icon}
        </div>
      </div>

      <p
        className="relative text-[42px] font-bold text-[#111] dark:text-[#f0f0f0] leading-none tracking-tight tabular-nums"
        style={{ fontFamily: 'var(--font-jetbrains-mono), ui-monospace, monospace' }}
      >
        {value}
      </p>

      {subtext && (
        <p className="relative text-[12px] text-[#a3a3a3] dark:text-[#525252] mt-3 leading-snug">{subtext}</p>
      )}
    </div>
  )
}

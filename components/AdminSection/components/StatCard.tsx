import type { ReactNode } from 'react'

interface StatCardProps {
  label: string
  value: string | number
  subtext?: ReactNode
  icon: ReactNode
  iconBg: string
}

export default function StatCard({ label, value, subtext, icon, iconBg }: StatCardProps) {
  return (
    <div className="bg-white dark:bg-[#1a1a1a] border border-[#e5e7eb] dark:border-[#2a2a2a] rounded-xl p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">{label}</span>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconBg}`}>
          {icon}
        </div>
      </div>
      <div className="text-[28px] font-bold text-[#111] dark:text-white leading-none tracking-tight">
        {value}
      </div>
      {subtext && (
        <div className="text-[12px] text-[#6b7280]">{subtext}</div>
      )}
    </div>
  )
}

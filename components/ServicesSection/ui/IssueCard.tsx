import {
    RectangleVertical,
    Layers,
    Battery,
    CameraOff,
    Camera,
    Plug,
    Ear,
    Volume2,
    Mic,
    Droplets,
    ScanFace,
    Fingerprint,
    Wifi,
    Bluetooth,
    SignalZero,
    Vibrate,
    PowerOff,
    Flame,
    HardDrive,
    KeyRound,
    Wrench,
    type LucideIcon,
  } from 'lucide-react'
  import type { IssueType } from '../types/wizard'
  
  const ICON_MAP: Record<string, LucideIcon> = {
    RectangleVertical,
    Layers,
    Battery,
    CameraOff,
    Camera,
    Plug,
    Ear,
    Volume2,
    Mic,
    Droplets,
    ScanFace,
    Fingerprint,
    Wifi,
    Bluetooth,
    SignalZero,
    Vibrate,
    PowerOff,
    Flame,
    HardDrive,
    KeyRound,
    Wrench,
  }
  
  interface IssueCardProps {
    issue: IssueType
    selected: boolean
    onClick: () => void
  }
  
  export default function IssueCard({ issue, selected, onClick }: IssueCardProps) {
    const Icon = ICON_MAP[issue.icon]
  
    return (
      <button
        type="button"
        onClick={onClick}
        className={`
          flex flex-col items-center justify-center gap-2
          p-3 lg:p-5 rounded-2xl cursor-pointer select-none
          shadow-sm hover:shadow-md transition-shadow
          w-full aspect-square
          ${selected
            ? 'ring-2 ring-red-500 bg-red-50'
            : 'bg-white border border-gray-100'
          }
        `}
      >
        {Icon ? (
          <>
            <Icon size={18} className={`lg:hidden ${selected ? 'text-red-600' : 'text-slate-500'}`} />
            <Icon size={26} className={`hidden lg:block ${selected ? 'text-red-600' : 'text-slate-500'}`} />
          </>
        ) : (
          <span className="w-4 h-4 bg-gray-200 rounded" />
        )}
        <span className={`text-xs font-medium text-center leading-tight ${selected ? 'text-red-600' : 'text-slate-700'}`}>
          {issue.label}
        </span>
      </button>
    )
  }
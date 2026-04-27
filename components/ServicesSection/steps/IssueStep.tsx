import { issueTypes } from '../data/issueTypes'
import IssueCard from '../ui/IssueCard'
import type { DeviceType } from '../types/wizard'

interface IssueStepProps {
  device: DeviceType | null
  issues: string[]
  toggleIssue: (id: string) => void
  nextStep: () => void
}

const DEVICE_LABEL: Record<string, string> = {
  iphone:  'iPhone',
  android: 'Android Phone',
  tablet:  'Tablet',
}

export default function IssueStep({ device, issues, toggleIssue, nextStep }: IssueStepProps) {
  const deviceLabel = device ? (DEVICE_LABEL[device] ?? 'device') : 'device'

  return (
    <div className="w-full flex flex-col gap-4">

      {/* Sub-header */}
      <p className="text-sm text-center" style={{ color: '#6b7280' }}>
        What&apos;s wrong with your {deviceLabel}?
      </p>

      {/* Issue grid — contained within the card, no bleed */}
      <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 sm:gap-3">
        {issueTypes.map((issue) => (
          <IssueCard
            key={issue.id}
            issue={issue}
            selected={issues.includes(issue.id)}
            onClick={() => toggleIssue(issue.id)}
          />
        ))}
      </div>

      {/* Inline continue — appears at the bottom once at least one issue is selected */}
      {issues.length > 0 && (
        <div className="flex justify-center mt-2">
          <button
            type="button"
            onClick={nextStep}
            className="bg-brand hover:bg-brand-hover text-white font-bold tracking-[0.02em] rounded-lg px-8 py-3 text-sm transition-all duration-200 active:scale-95"
            style={{ boxShadow: '0 4px 20px rgba(139,26,26,0.25)' }}
          >
            Continue ({issues.length} issue{issues.length > 1 ? 's' : ''}) →
          </button>
        </div>
      )}

    </div>
  )
}

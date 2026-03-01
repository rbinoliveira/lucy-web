'use client'

import { Clock, FastForward, SkipForward, ThumbsUp } from 'lucide-react'

export type AdherenceBehaviorCounts = {
  onTime: number
  late: number
  early: number
  skipped: number
}

type PatientAdherenceBehaviorProps = {
  counts?: AdherenceBehaviorCounts | null
  isLoading?: boolean
}

const display = (value: number, isLoading?: boolean) =>
  isLoading ? '–' : value

export function PatientAdherenceBehavior({
  counts,
  isLoading,
}: PatientAdherenceBehaviorProps) {
  const onTime = counts?.onTime ?? 0
  const late = counts?.late ?? 0
  const early = counts?.early ?? 0
  const skipped = counts?.skipped ?? 0

  const items = [
    {
      label: 'Na hora',
      value: display(onTime, isLoading),
      icon: ThumbsUp,
      className: 'text-success-one bg-success-one/10',
    },
    {
      label: 'Atrasou',
      value: display(late, isLoading),
      icon: Clock,
      className: 'text-warning-one bg-warning-one/10',
    },
    {
      label: 'Adiantou',
      value: display(early, isLoading),
      icon: FastForward,
      className: 'text-primary bg-primary/10',
    },
    {
      label: 'Pulou',
      value: display(skipped, isLoading),
      icon: SkipForward,
      className: 'text-danger-one bg-danger-one/10',
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {items.map(({ label, value, icon: Icon, className }) => (
        <div
          key={label}
          className="flex items-center gap-3 rounded-xl border border-border-one/60 bg-white/80 p-3"
        >
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${className}`}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-text-one text-lg font-semibold tabular-nums">
              {value}
            </p>
            <p className="text-text-three text-xs">{label}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

import * as React from 'react'

import { cn } from '@/application/_shared/libs/tw-merge'

type SeparatorProps = {
  className?: string
  label?: string
}

export function Separator({ className, label }: SeparatorProps) {
  return (
    <div
      className={cn('flex w-full items-center', label && 'gap-2', className)}
    >
      <div className="bg-border-one h-[1px] flex-1" />
      {label && <p className="text-text-six text-sm">{label}</p>}
      <div className="bg-border-one h-[1px] flex-1" />
    </div>
  )
}

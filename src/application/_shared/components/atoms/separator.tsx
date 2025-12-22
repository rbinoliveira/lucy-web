import * as React from 'react'

import { cn } from '@/application/_shared/libs/tw-merge'

type SeparatorProps = {
  className?: string
  label?: string
}

export function Separator({ className, label }: SeparatorProps) {
  return (
    <div
      className={cn('w-full flex items-center', label && 'gap-2', className)}
    >
      <div className="flex-1 h-[1px] bg-border-one" />
      {label && <p className="text-text-six text-sm">{label}</p>}
      <div className="flex-1 h-[1px] bg-border-one" />
    </div>
  )
}

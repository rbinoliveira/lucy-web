'use client'

import { useRef } from 'react'

import { cn } from '@/shared/libs/tw-merge'

export function TiltCard({
  className,
  children,
  ...props
}: React.ComponentProps<'div'>) {
  const ref = useRef<HTMLDivElement>(null)

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const card = ref.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const cx = rect.width / 2
    const cy = rect.height / 2
    const rotateX = (y - cy) / 20
    const rotateY = (cx - x) / 20
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`
  }

  function handleMouseLeave() {
    const card = ref.current
    if (!card) return
    card.style.transform =
      'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)'
  }

  return (
    <div
      ref={ref}
      role="group"
      tabIndex={0}
      className={cn('glass-card glass-card-3d', className)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onKeyDown={(e) => {
        if (e.key === 'Escape') handleMouseLeave()
      }}
      {...props}
    >
      {children}
    </div>
  )
}

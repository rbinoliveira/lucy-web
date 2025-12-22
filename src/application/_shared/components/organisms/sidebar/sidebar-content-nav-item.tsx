'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { cn } from '@/application/_shared/libs/tw-merge'

export type SidebarContentNavItem = {
  title: string
  href: string
  icon: React.ReactNode
  description?: string
}

export function SidebarContentNavItem({
  href,
  icon,
  title,
}: SidebarContentNavItem) {
  const pathname = usePathname()

  const isActive = pathname.includes(href)

  return (
    <li key={href} className={cn('flex w-full items-center', 'justify-start')}>
      <Link
        href={href}
        className={cn(
          'transition-colors',
          'rounded-radius flex w-full items-center',
          'gap-3 px-4 py-3 leading-[1.1875]',
          'text-text-seven',
          '[&_svg]:shrink-0 [&_svg]:text-2xl [&_svg]:text-text-six',
          isActive
            ? 'bg-primary text-white [&_svg]:text-white'
            : 'hover:bg-black/10',
          'justify-start',
        )}
      >
        {icon}
        {title}
      </Link>
    </li>
  )
}

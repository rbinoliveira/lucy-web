'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { useSidebar } from '@/application/_shared/components/sidebar'
import { cn } from '@/application/_shared/libs/tw-merge'

export type SidebarContentNavItem = {
  title: string
  href: string
  icon: React.ReactNode
}

export function SidebarContentNavItem({
  href,
  icon,
  title,
}: SidebarContentNavItem) {
  const pathname = usePathname()

  const { state } = useSidebar()

  const stateIsExpanded = state === 'expanded'

  const isActive = pathname.includes(href)

  return (
    <li
      key={href}
      className={cn(
        'flex w-full items-center',
        stateIsExpanded ? 'justify-start' : 'justify-center',
      )}
    >
      <Link
        href={href}
        className={cn(
          'rounded-radius flex w-full items-center',
          'gap-4 p-4 font-bold leading-[1.1875]',
          'hover:bg-primary hover:text-primary-contrast hover:[&_svg]:text-primary-contrast',
          '[&_svg]:shrink-0 [&_svg]:text-2xl',
          {
            'bg-primary text-primary-contrast [&_svg]:text-primary-contrast':
              isActive,
            '[&_svg]:text-text-four': !isActive,
          },
          stateIsExpanded ? 'justify-start' : 'justify-center',
        )}
      >
        {icon}
        {stateIsExpanded && title}
      </Link>
    </li>
  )
}

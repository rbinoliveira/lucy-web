'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { cn } from '@/shared/libs/tw-merge'

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
    <li className="flex w-full items-center justify-start">
      <Link
        href={href}
        className={cn(
          'flex w-full items-center gap-[14px]',
          'rounded-xl px-[18px] py-[14px]',
          'text-sm font-medium leading-[1.1875]',
          'transition-all duration-200',
          '[&_svg]:h-[22px] [&_svg]:w-[22px] [&_svg]:shrink-0',
          isActive
            ? 'bg-primary/12 border border-primary/20 text-text-one [&_svg]:text-primary'
            : 'text-text-two border border-transparent [&_svg]:text-text-three hover:bg-primary/10 hover:text-text-one hover:[&_svg]:text-primary',
        )}
      >
        {icon}
        {title}
      </Link>
    </li>
  )
}

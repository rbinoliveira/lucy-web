import { Archive } from 'lucide-react'

import { SidebarContentNavItem } from '@/application/_shared/components/shared/sidebar-content-nav-item'

export const sidebarContentNavItems: SidebarContentNavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: <Archive />,
  },
  {
    title: 'Remédios',
    href: '/medicines',
    icon: <Archive />,
  },
]

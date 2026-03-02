import { House, PillBottle, ScrollText, Users } from 'lucide-react'

import type { SidebarContentNavItem } from '@/shared/components/organisms/sidebar/sidebar-content-nav-item'

export type SidebarNavGroup = {
  label: string
  items: SidebarContentNavItem[]
}

export const sidebarNavGroups = (role?: string): SidebarNavGroup[] => {
  const mainGroup: SidebarNavGroup = {
    label: 'Menu Principal',
    items: [
      {
        title: 'Dashboard',
        href: '/dashboard',
        icon: <House />,
        description: 'Visão geral',
      },
    ],
  }

  const clinicItems: SidebarContentNavItem[] = [
    {
      title: 'Pacientes',
      href: '/pacientes',
      icon: <Users />,
      description: 'Cadastro de pacientes',
    },
    {
      title: 'Prescrições',
      href: '/prescricoes',
      icon: <ScrollText />,
      description: 'Prescrições dos pacientes',
    },
  ]

  if (role === 'admin') {
    clinicItems.push({
      title: 'Medicamentos',
      href: '/medicamentos',
      icon: <PillBottle />,
      description: 'Catálogo de medicamentos',
    })
  }

  const clinicGroup: SidebarNavGroup = {
    label: 'Clínica',
    items: clinicItems,
  }

  return [mainGroup, clinicGroup]
}

export const sidebarContentNavItems = (
  role?: string,
): SidebarContentNavItem[] => sidebarNavGroups(role).flatMap((g) => g.items)

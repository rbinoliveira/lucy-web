import { useAuth } from '@/features/auth/hooks/auth.hook'
import { SidebarContentNavItem } from '@/shared/components/organisms/sidebar/sidebar-content-nav-item'
import { sidebarContentNavItems } from '@/shared/components/organisms/sidebar/sidebar-content-nav-items'

export function SidebarContentNav() {
  const { user } = useAuth()

  return (
    <nav>
      <ul className="flex flex-col gap-4 px-4">
        {sidebarContentNavItems(user?.role).map((item) => (
          <SidebarContentNavItem key={item.href} {...item} />
        ))}
      </ul>
    </nav>
  )
}

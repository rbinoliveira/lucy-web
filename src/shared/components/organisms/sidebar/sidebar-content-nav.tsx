import { useAuth } from '@/features/auth/hooks/auth.hook'
import { SidebarContentNavItem } from '@/shared/components/organisms/sidebar/sidebar-content-nav-item'
import {
  sidebarNavGroups,
} from '@/shared/components/organisms/sidebar/sidebar-content-nav-items'

export function SidebarContentNav() {
  const { user } = useAuth()
  const groups = sidebarNavGroups(user?.role)

  return (
    <nav className="flex flex-col px-6">
      {groups.map((group, index) => (
        <div
          key={group.label}
          className={
            index > 0
              ? 'border-t border-border-two pt-[25px] mt-[25px]'
              : 'pb-[5px]'
          }
        >
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[1.5px] text-text-four pl-[18px]">
            {group.label}
          </p>
          <ul className="flex flex-col gap-[5px]">
            {group.items.map((item) => (
              <SidebarContentNavItem key={item.href} {...item} />
            ))}
          </ul>
        </div>
      ))}
    </nav>
  )
}

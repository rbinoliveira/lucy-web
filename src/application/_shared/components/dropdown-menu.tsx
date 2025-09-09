import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'

import { cn } from '@/application/_shared/libs/tw-merge'

type DropdownMenuProps = {
  trigger: React.ReactNode
  items: React.ReactNode[]
}

function DropdownMenu({ trigger, items }: DropdownMenuProps) {
  return (
    <Menu>
      <MenuButton className={'rounded-radius'}>{trigger}</MenuButton>
      <MenuItems
        anchor="bottom"
        className="bg-background rounded-radius p-1 shadow-[0px_4px_20px_0px_rgba(0,0,0,0.25)]"
      >
        {items.map((item, index) => (
          <MenuItem key={index}>
            <div
              className={cn(
                'rounded-radius-alt text-sm font-semibold',
                'data-[focus]:bg-primary data-[focus]:text-primary-contrast',
              )}
            >
              {item}
            </div>
          </MenuItem>
        ))}
      </MenuItems>
    </Menu>
  )
}

export { DropdownMenu }

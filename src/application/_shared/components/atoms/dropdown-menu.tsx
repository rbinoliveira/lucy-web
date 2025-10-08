import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import React, { useEffect, useRef, useState } from 'react'

import { cn } from '@/application/_shared/libs/tw-merge'

type DropdownMenuProps = {
  trigger: React.ReactNode
  items: React.ReactNode[]
}

function DropdownMenu({ trigger, items }: DropdownMenuProps) {
  const buttonRef = useRef<HTMLButtonElement | null>(null)
  const [btnWidth, setBtnWidth] = useState<number | undefined>(undefined)

  useEffect(() => {
    if (!buttonRef.current) return

    const update = () => setBtnWidth(buttonRef.current?.offsetWidth)
    update()

    const ro = new ResizeObserver(update)
    ro.observe(buttonRef.current)
    return () => ro.disconnect()
  }, [])

  return (
    <Menu>
      <MenuButton ref={buttonRef} className="rounded-radius">
        {trigger}
      </MenuButton>
      <MenuItems
        anchor="bottom"
        className="bg-background rounded-lg p-1 shadow-[0px_4px_20px_0px_rgba(0,0,0,0.25)]"
        style={{ minWidth: btnWidth }}
      >
        {items.map((item, index) => (
          <MenuItem key={index}>
            <div
              className={cn(
                'rounded-md text-sm font-semibold px-4 py-2',
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

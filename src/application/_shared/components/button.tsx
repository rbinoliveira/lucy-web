import { Slot } from '@radix-ui/react-slot'
import * as React from 'react'

import { cn } from '@/application/_shared/libs/tw-merge'

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'ghost' | 'google' | 'link' | 'login'
  type?: 'button' | 'submit'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      asChild = false,
      type = 'button',
      variant = 'primary',
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button'

    const variants = {
      primary: [
        'bg-primary h-[52px] justify-center items-center gap-2 flex-row',
        'rounded-lg',
      ],
      secondary: [
        'bg-white border-2 border-border h-[52px] justify-center items-center ',
        'gap-2 flex-row w-full rounded-lg',
      ],
      ghost: [''],
      google: [
        'flex justify-center items-center gap-2 h-[52px] h-[64px]',
        'border-2 border-border-one rounded-xl shadow-one font-semibold',
        'text-lg',
      ],
      link: ['flex flex-col text-sm font-semibold text-blue-one'],
      login: [
        'h-[56px] flex justify-center items-center gap-2',
        'w-full rounded-xl linear-bg-two shadow-two font-semibold',
        'text-white',
      ],
    }

    return (
      <Comp
        className={cn(className, 'cursor-pointer', ...variants[variant])}
        type={type}
        ref={ref}
        {...props}
      />
    )
  },
)

export { Button }

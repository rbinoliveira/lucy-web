import { Slot } from '@radix-ui/react-slot'
import * as React from 'react'

import { cn } from '@/application/_shared/libs/tw-merge'

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  children: React.ReactNode
  variant?:
    | 'primary'
    | 'secondary'
    | 'ghost'
    | 'google'
    | 'link'
    | 'login'
    | 'pagination'
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
        'h-[48px] flex justify-center items-center gap-2',
        'w-full rounded-xl bg-primary shadow-two font-medium',
        'text-white disabled:opacity-50 disabled:cursor-not-allowed',
      ],
      secondary: [
        'bg-white h-[48px] bg-secondary justify-center',
        'gap-2 flex-row w-full rounded-xl items-center font-medium',
        'text-text-seven',
      ],
      ghost: ['flex items-center justify-center'],
      google: [
        'flex justify-center items-center gap-2 h-[52px] h-[64px]',
        'border-2 border-border-one rounded-xl shadow-one font-semibold',
        'text-lg',
      ],
      link: ['flex flex-col text-sm font-semibold text-primary'],
      login: [
        'h-[56px] flex justify-center items-center gap-2',
        'w-full rounded-xl linear-two shadow-two font-semibold',
        'text-white',
      ],
      pagination: [
        'h-[38px] w-[38px] flex justify-center items-center',
        'rounded-lg shadow-three font-medium text-sm',
        'text-text-seven disabled:opacity-50 disabled:cursor-not-allowed',
        'border border-border-three bg-white',
      ],
    }

    return (
      <Comp
        className={cn('cursor-pointer', ...variants[variant], className)}
        type={type}
        ref={ref}
        {...props}
      />
    )
  },
)

export { Button }

import { Slot } from '@radix-ui/react-slot'
import { LoaderCircle } from 'lucide-react'
import * as React from 'react'

import { cn } from '@/shared/libs/tw-merge'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  children?: React.ReactNode
  variant?:
    | 'primary'
    | 'secondary'
    | 'ghost'
    | 'google'
    | 'link'
    | 'login'
    | 'danger'
    | 'pagination'
  size?: 'sm' | 'md' | 'lg'
  type?: 'button' | 'submit'
  isLoading?: boolean
  icon?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      asChild = false,
      type = 'button',
      variant = 'primary',
      size: _size = 'md',
      isLoading = false,
      disabled,
      icon,
      children,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button'

    const variants = {
      primary: [
        'h-[48px] flex flex-row justify-center items-center gap-2',
        'rounded-xl bg-primary shadow-two font-medium px-4',
        'text-white hover:bg-primary-alternative disabled:opacity-50 disabled:cursor-not-allowed',
      ],
      secondary: [
        'bg-white h-[48px] flex flex-row justify-center items-center gap-2',
        'rounded-xl font-medium border border-border-one px-4 bg-white',
        'text-text-seven hover:border-primary/30 hover:bg-primary/5 disabled:opacity-50 disabled:cursor-not-allowed',
      ],
      ghost: ['flex items-center justify-center', 'hover:bg-primary/10'],
      google: [
        'flex justify-center items-center gap-2 h-[52px]',
        'border-2 border-border-one rounded-xl shadow-one font-semibold',
        'text-lg hover:bg-background-contrast',
      ],
      link: [
        'flex flex-col text-sm font-semibold text-primary',
        'hover:text-primary-alternative',
      ],
      login: [
        'h-[56px] flex justify-center items-center gap-2',
        'w-full rounded-xl linear-two shadow-two font-semibold',
        'text-white hover:opacity-95',
      ],
      danger: [
        'h-[48px] flex flex-row justify-center items-center gap-2',
        'rounded-xl bg-danger-one font-medium px-4',
        'text-white hover:bg-danger-two disabled:opacity-50 disabled:cursor-not-allowed',
      ],
      pagination: [
        'h-[38px] w-[38px] flex justify-center items-center',
        'rounded-lg shadow-three font-medium text-sm',
        'text-text-seven hover:border-primary/30 hover:bg-primary/5 disabled:opacity-50 disabled:cursor-not-allowed',
        'border border-border-three bg-white',
      ],
    }

    if (asChild) {
      const content = isLoading ? (
        <LoaderCircle className="h-5 w-5 animate-spin text-white" />
      ) : icon ? (
        <span className="flex items-center gap-2">
          {icon}
          {children}
        </span>
      ) : (
        children
      )

      return (
        <Comp
          className={cn('cursor-pointer', ...variants[variant], className)}
          type={type}
          ref={ref}
          disabled={disabled || isLoading}
          {...props}
        >
          {content}
        </Comp>
      )
    }

    return (
      <Comp
        className={cn('cursor-pointer', ...variants[variant], className)}
        type={type}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <LoaderCircle className="h-5 w-5 animate-spin text-white" />
        ) : (
          <>
            {icon}
            {children}
          </>
        )}
      </Comp>
    )
  },
)

export { Button }

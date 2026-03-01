'use client'

import * as AvatarPrimitive from '@radix-ui/react-avatar'
import * as React from 'react'

import { generateInitials } from '@/shared/helpers/name-manipulator.helper'
import { cn } from '@/shared/libs/tw-merge'

function AvatarContainer({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        'relative flex size-8 shrink-0 overflow-hidden rounded-full',
        className,
      )}
      {...props}
    />
  )
}

function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn('aspect-square size-full', className)}
      {...props}
    />
  )
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        'flex size-full items-center justify-center bg-primary/10 text-primary font-semibold text-xs',
        className,
      )}
      {...props}
    />
  )
}

export type AvatarProps = {
  className?: string
  imageUrl?: string | null
  name?: string | null
  size?: 'base' | 'md' | 'lg'
  roundedFull?: boolean
}

function Avatar({
  className,
  size = 'base',
  roundedFull = true,
  imageUrl,
  name,
}: AvatarProps) {
  return (
    <AvatarContainer
      className={cn(
        {
          'size-10': size === 'base',
          'size-14': size === 'md',
          'size-16': size === 'lg',
          'rounded-full': roundedFull,
          'rounded-xl': !roundedFull,
        },
        className,
      )}
    >
      <AvatarImage
        className={cn({
          'rounded-full': roundedFull,
          'rounded-xl': !roundedFull,
        })}
        src={imageUrl ?? undefined}
        alt={name ?? undefined}
      />
      <AvatarFallback
        className={cn({
          'rounded-full': roundedFull,
          'rounded-xl': !roundedFull,
        })}
      >
        {generateInitials(name ?? undefined)}
      </AvatarFallback>
    </AvatarContainer>
  )
}

export { Avatar }

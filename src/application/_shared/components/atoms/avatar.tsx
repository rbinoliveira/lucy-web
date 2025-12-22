'use client'

import * as AvatarPrimitive from '@radix-ui/react-avatar'
import * as React from 'react'

import { generateInitials } from '@/application/_shared/helpers/name-manipulator.helper'
import { cn } from '@/application/_shared/libs/tw-merge'

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
        'flex size-full items-center justify-center rounded-full bg-neutral-100',
        className,
      )}
      {...props}
    />
  )
}

export type AvatarProps = {
  className?: string
  imageUrl?: string
  name?: string
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
          'rounded-radius': !roundedFull,
        },
        className,
      )}
    >
      <AvatarImage
        className={cn({
          'rounded-full': roundedFull,
          'rounded-radius': !roundedFull,
        })}
        src={imageUrl}
        alt={name}
      />
      <AvatarFallback
        className={cn({
          'rounded-full': roundedFull,
          'rounded-radius': !roundedFull,
        })}
      >
        {generateInitials(name)}
      </AvatarFallback>
    </AvatarContainer>
  )
}

export { Avatar }

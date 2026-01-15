'use client'

import * as SidebarSheetPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import * as React from 'react'

import { cn } from '@/application/_shared/libs/tw-merge'

function SidebarSheet({
  ...props
}: React.ComponentProps<typeof SidebarSheetPrimitive.Root>) {
  return <SidebarSheetPrimitive.Root data-slot="Sidebarsheet" {...props} />
}

function SidebarSheetTrigger({
  ...props
}: React.ComponentProps<typeof SidebarSheetPrimitive.Trigger>) {
  return (
    <SidebarSheetPrimitive.Trigger
      data-slot="Sidebarsheet-trigger"
      {...props}
    />
  )
}

function SidebarSheetClose({
  ...props
}: React.ComponentProps<typeof SidebarSheetPrimitive.Close>) {
  return (
    <SidebarSheetPrimitive.Close data-slot="Sidebarsheet-close" {...props} />
  )
}

function SidebarSheetPortal({
  ...props
}: React.ComponentProps<typeof SidebarSheetPrimitive.Portal>) {
  return (
    <SidebarSheetPrimitive.Portal data-slot="Sidebarsheet-portal" {...props} />
  )
}

function SidebarSheetOverlay({
  className,
  ...props
}: React.ComponentProps<typeof SidebarSheetPrimitive.Overlay>) {
  return (
    <SidebarSheetPrimitive.Overlay
      data-slot="Sidebarsheet-overlay"
      className={cn(
        'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-amber-900 bg-black/80',
        className,
      )}
      {...props}
    />
  )
}

function SidebarSheetContent({
  className,
  children,
  side = 'right',
  ...props
}: React.ComponentProps<typeof SidebarSheetPrimitive.Content> & {
  side?: 'top' | 'right' | 'bottom' | 'left'
}) {
  return (
    <SidebarSheetPortal>
      <SidebarSheetOverlay />
      <SidebarSheetPrimitive.Content
        data-slot="Sidebarsheet-content"
        className={cn(
          'data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-50 flex flex-col gap-4 bg-white shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500',
          side === 'right' &&
            'data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm',
          side === 'left' &&
            'data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm',
          side === 'top' &&
            'data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 h-auto border-b',
          side === 'bottom' &&
            'data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 h-auto border-t',
          className,
        )}
        {...props}
      >
        {children}
        <SidebarSheetPrimitive.Close className="absolute top-4 right-4 rounded-xs opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none data-[state=open]:bg-neutral-100">
          <X className="size-4" />
          <span className="sr-only">Close</span>
        </SidebarSheetPrimitive.Close>
      </SidebarSheetPrimitive.Content>
    </SidebarSheetPortal>
  )
}

function SidebarSheetHeader({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="Sidebarsheet-header"
      className={cn('flex flex-col gap-1.5 p-4', className)}
      {...props}
    />
  )
}

function SidebarSheetFooter({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="Sidebarsheet-footer"
      className={cn('mt-auto flex flex-col gap-2 p-4', className)}
      {...props}
    />
  )
}

function SidebarSheetTitle({
  className,
  ...props
}: React.ComponentProps<typeof SidebarSheetPrimitive.Title>) {
  return (
    <SidebarSheetPrimitive.Title
      data-slot="Sidebarsheet-title"
      className={cn('font-semibold tracking-tight text-neutral-950', className)}
      {...props}
    />
  )
}

function SidebarSheetDescription({
  className,
  ...props
}: React.ComponentProps<typeof SidebarSheetPrimitive.Description>) {
  return (
    <SidebarSheetPrimitive.Description
      data-slot="Sidebarsheet-description"
      className={cn('text-sm text-neutral-500', className)}
      {...props}
    />
  )
}

export {
  SidebarSheet,
  SidebarSheetClose,
  SidebarSheetContent,
  SidebarSheetDescription,
  SidebarSheetFooter,
  SidebarSheetHeader,
  SidebarSheetTitle,
  SidebarSheetTrigger,
}

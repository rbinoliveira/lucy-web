import * as PrimitiveDialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import React, { ReactNode, useState } from 'react'

import { Button } from '@/application/_shared/components/atoms/button'
import { Separator } from '@/application/_shared/components/atoms/separator'
import { useDialog } from '@/application/_shared/hooks/dialog.hook'
import { cn } from '@/application/_shared/libs/tw-merge'

const PrimitiveDialog = PrimitiveDialogPrimitive.Root

const PrimitiveDialogPortal = PrimitiveDialogPrimitive.Portal

const PrimitiveDialogClose = PrimitiveDialogPrimitive.Close

const PrimitiveDialogOverlay = React.forwardRef<
  React.ElementRef<typeof PrimitiveDialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof PrimitiveDialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <PrimitiveDialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'fixed inset-0 z-50 bg-black/40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      className,
    )}
    {...props}
  />
))
PrimitiveDialogOverlay.displayName =
  PrimitiveDialogPrimitive.Overlay.displayName

const PrimitiveDialogContent = React.forwardRef<
  React.ElementRef<typeof PrimitiveDialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PrimitiveDialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <PrimitiveDialogPortal>
    <PrimitiveDialogOverlay />
    <PrimitiveDialogPrimitive.Content
      ref={ref}
      className={cn(
        'fixed left-[50%] top-[50%] z-50 grid rounded-lg w-full max-w-[633px] translate-x-[-50%] translate-y-[-50%] border border-neutral-200 bg-white px-[1.875rem] pt-6 pb-[1.875rem] shadow-md duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]',
        className,
      )}
      {...props}
    >
      {children}
    </PrimitiveDialogPrimitive.Content>
  </PrimitiveDialogPortal>
))
PrimitiveDialogContent.displayName =
  PrimitiveDialogPrimitive.Content.displayName

const PrimitiveDialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('flex flex-col gap-2 items-start', className)}
    {...props}
  />
)
PrimitiveDialogHeader.displayName = 'PrimitiveDialogHeader'

const PrimitiveDialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2',
      className,
    )}
    {...props}
  />
)
PrimitiveDialogFooter.displayName = 'PrimitiveDialogFooter'

const PrimitiveDialogTitle = React.forwardRef<
  React.ElementRef<typeof PrimitiveDialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof PrimitiveDialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <PrimitiveDialogPrimitive.Title
    ref={ref}
    className={cn(
      'text-[1.063rem] font-normal leading-[1.375rem] text-black',
      className,
    )}
    {...props}
  />
))
PrimitiveDialogTitle.displayName = PrimitiveDialogPrimitive.Title.displayName

const PrimitiveDialogDescription = React.forwardRef<
  React.ElementRef<typeof PrimitiveDialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof PrimitiveDialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <PrimitiveDialogPrimitive.Description
    ref={ref}
    className={cn(
      'text-[0.813rem] text-text-seven font-normal leading-[1.375rem]',
      className,
    )}
    {...props}
  />
))

PrimitiveDialogDescription.displayName =
  PrimitiveDialogPrimitive.Description.displayName

export type DialogProps = {
  title?: string
  description?: string
  customBody?: ReactNode
  cancelButton?: {
    label: string
    onClick?: () => void
  }
  confirmButton: {
    isLoading?: boolean
    label: string
    onClick: () => Promise<void>
    disabled?: boolean
  }
}

export function Dialog() {
  const { closeDialog, dialogProps } = useDialog()
  const [isLoading, setIsLoading] = useState(false)

  if (!dialogProps) {
    return null
  }

  const { confirmButton, cancelButton, customBody, description, title } =
    dialogProps

  function cancelDialog() {
    if (cancelButton?.onClick) {
      cancelButton.onClick()
    }
    closeDialog()
  }

  async function confirmDialog() {
    setIsLoading(true)
    await confirmButton.onClick()
    setIsLoading(false)
  }

  return (
    <PrimitiveDialog open={true}>
      <PrimitiveDialogContent>
        <PrimitiveDialogClose
          onClick={closeDialog}
          className="absolute right-4 top-4 opacity-70 transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none"
        >
          <X />
          <span className="sr-only">Close</span>
        </PrimitiveDialogClose>
        {(title || description) && (
          <PrimitiveDialogHeader>
            {title && <PrimitiveDialogTitle>{title}</PrimitiveDialogTitle>}
            {description && (
              <PrimitiveDialogDescription>
                {description}
              </PrimitiveDialogDescription>
            )}
          </PrimitiveDialogHeader>
        )}
        {customBody}
        <PrimitiveDialogFooter className="flex !flex-col">
          <Separator className="mt-5" />
          <div className="flex items-center gap-6 mt-5 justify-end w-full">
            {cancelButton && (
              <Button
                onClick={cancelDialog}
                variant={'secondary'}
                className="max-w-[130px]"
                isLoading={isLoading}
              >
                {cancelButton.label}
              </Button>
            )}
            <Button
              onClick={confirmDialog}
              className="max-w-[130px]"
              disabled={confirmButton.disabled}
              isLoading={isLoading}
            >
              {confirmButton.label}
            </Button>
          </div>
        </PrimitiveDialogFooter>
      </PrimitiveDialogContent>
    </PrimitiveDialog>
  )
}

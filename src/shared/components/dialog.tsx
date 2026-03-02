import * as PrimitiveDialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import React, { ReactNode, useState } from 'react'

import { Button } from '@/shared/components/button'
import { Separator } from '@/shared/components/separator'
import { useDialog } from '@/shared/hooks/dialog.hook'
import { cn } from '@/shared/libs/tw-merge'

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
      'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/40',
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
        'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] fixed top-[50%] left-[50%] z-50 grid w-full max-w-[633px] translate-x-[-50%] translate-y-[-50%] rounded-lg border border-neutral-200 bg-white px-[1.875rem] pt-6 pb-[1.875rem] shadow-md duration-200',
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
    className={cn('flex flex-col items-start gap-2', className)}
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
      'text-[1.063rem] leading-[1.375rem] font-normal text-black',
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
      'text-text-seven text-[0.813rem] leading-[1.375rem] font-normal',
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
          className="absolute top-4 right-4 opacity-70 transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none"
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
          <div className="mt-5 flex w-full items-center justify-end gap-6">
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

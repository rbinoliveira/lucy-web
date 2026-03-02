'use client'
import { Check, TriangleAlert } from 'lucide-react'
import { Toaster as Sonner, ToasterProps } from 'sonner'

import { cn } from '@/shared/libs/tw-merge'

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      {...props}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: cn(
            '!p-4 !gap-3 !border !bg-white [&>div:nth-child(2)]:!gap-1',
            '!rounded-xl [&>div:nth-child(1)]:!h-8 [&>div:nth-child(1)]:!w-8',
          ),
          error: '!border-danger-three shadow-two',
          success: '!border-green-two shadow-two',
          title: '!font-semibold !text-sm !text-text-one',
          description: '!text-text-two !text-xs',
        },
      }}
      icons={{
        error: (
          <div className="bg-danger-four flex h-full w-full items-center justify-center rounded-full">
            <TriangleAlert size={16} className="text-danger-one" />
          </div>
        ),
        success: (
          <div className="bg-green-three flex h-full w-full items-center justify-center rounded-full">
            <Check size={16} className="text-green-four" />
          </div>
        ),
      }}
      position="top-right"
    />
  )
}

export { Toaster }

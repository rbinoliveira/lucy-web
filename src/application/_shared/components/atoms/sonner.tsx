'use client'
import { Check, TriangleAlert } from 'lucide-react'
import { Toaster as Sonner, ToasterProps } from 'sonner'

import { cn } from '@/application/_shared/libs/tw-merge'

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
          title: '!font-semibold !text-sm !font-inter !text-text-one',
          description: '!text-text-two !font-inter !text-xs',
        },
      }}
      icons={{
        error: (
          <div className="w-full h-full bg-danger-four rounded-full flex items-center justify-center">
            <TriangleAlert size={16} className="text-danger-one" />
          </div>
        ),
        success: (
          <div className="w-full h-full bg-green-three rounded-full flex items-center justify-center">
            <Check size={16} className="text-green-four" />
          </div>
        ),
      }}
      position="top-right"
    />
  )
}

export { Toaster }

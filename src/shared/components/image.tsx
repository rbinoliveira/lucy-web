'use client'

import NextImage, { ImageProps as NextImageProps } from 'next/image'
import { useEffect, useState } from 'react'

import { Skeleton } from '@/shared/components/skeleton'
import { cn } from '@/shared/libs/tw-merge'

type ImageProps = NextImageProps & {
  imageClassName?: string
  isLoading?: boolean
}

function Img({
  className,
  alt,
  src,
  priority,
  imageClassName,
  isLoading,
}: ImageProps) {
  const [isValidating, setIsValidating] = useState(true)
  const [isValid, setIsValid] = useState(false)

  useEffect(() => {
    const img = new Image()
    img.onload = () => {
      setIsValid(true)
      setIsValidating(false)
    }
    img.onerror = () => {
      setIsValid(false)
      setIsValidating(false)
    }
    img.src = src as string
  }, [src])

  if (isValidating || isLoading) {
    return <Skeleton className={cn('bg-primary-light', className)} />
  }

  if (!isValid) {
    return null
  }

  return (
    <div className={`relative ${className}`}>
      <NextImage
        alt={alt}
        src={src}
        className={imageClassName}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        priority={priority}
      />
    </div>
  )
}

export { Img as Image }

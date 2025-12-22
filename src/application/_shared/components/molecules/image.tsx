'use client'

import NextImage, { ImageProps as NextImageProps } from 'next/image'
import { useEffect, useState } from 'react'

import { Skeleton } from '@/application/_shared/components/atoms/skeleton'
import { cn } from '@/application/_shared/libs/tw-merge'

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
  const [isValidatting, setIsValidatting] = useState(true)
  const [isValid, setIsValid] = useState(false)

  useEffect(() => {
    const img = new Image()
    img.onload = () => {
      setIsValid(true)
    }
    img.onerror = () => {
      setIsValid(false)
    }
    img.src = src as string
    setIsValidatting(false)
  }, [src])

  if (isValidatting || isLoading) {
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

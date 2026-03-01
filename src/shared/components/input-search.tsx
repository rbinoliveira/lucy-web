import { Search } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'

import { useTable } from '@/shared/hooks/table.hook'
import { cn } from '@/shared/libs/tw-merge'

type InputSearchProps = {
  placeholder?: string
  className?: string
}

export type ExtendedInputSearchProps = {
  label?: string
  className?: string
  inputSize?: 'base' | 'lg'
}

export interface PrimitiveInputSearchProps extends React.ComponentProps<'input'> {
  isErrored?: boolean
  iconBefore?: React.ReactNode
  iconAfter?: React.ReactNode
  inputSize?: ExtendedInputSearchProps['inputSize']
  debounceMs?: number
}

const svgClassName = cn(
  'mx-3 absolute top-1/2 -translate-y-1/2',
  '[&>*]:h-[1.125rem] [&>*]:w-[1.125rem] text-icon',
)

const PrimitiveInputSearch = React.forwardRef<
  HTMLInputElement,
  PrimitiveInputSearchProps
>(
  (
    { className, inputSize, isErrored, disabled, debounceMs = 400, ...props },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false)
    const { updateSearch, search } = useTable()

    const [localValue, setLocalValue] = useState(search ?? '')

    const updateSearchRef = useRef(updateSearch)
    useEffect(() => {
      updateSearchRef.current = updateSearch
    }, [updateSearch])

    const prevSearchRef = useRef(search)
    useEffect(() => {
      if (
        !isFocused &&
        prevSearchRef.current !== search &&
        search !== localValue
      ) {
        prevSearchRef.current = search
        requestAnimationFrame(() => {
          setLocalValue(search ?? '')
        })
      }
    }, [search, isFocused, localValue])

    useEffect(() => {
      const t = setTimeout(() => {
        if (localValue !== search) {
          updateSearchRef.current(localValue)
        }
      }, debounceMs)

      return () => clearTimeout(t)
    }, [localValue, debounceMs, search])

    return (
      <div
        className={cn(
          'text-text-one flex w-full rounded-xl bg-white',
          'border-border-one relative h-[60px]',
          inputSize === 'lg' ? 'h-[60px] border-2' : 'h-[50px] border',
          isErrored && 'border-danger-one',
          isFocused && 'border-primary',
          disabled && 'border-border-one cursor-not-allowed opacity-50',
          className,
        )}
      >
        <span className={cn(svgClassName, 'pointer-events-none left-0')}>
          <Search size={16} className="text-icon" />
        </span>
        <input
          {...props}
          disabled={disabled}
          ref={ref}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false)
            if (localValue !== search) updateSearchRef.current(localValue)
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              ;(e.target as HTMLInputElement).blur()
              if (localValue !== search) updateSearchRef.current(localValue)
            }
          }}
          type="text"
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          className={cn(
            'flex-1 px-3 pl-10 focus:outline-none',
            'placeholder:text-placeholder',
            disabled && 'cursor-not-allowed opacity-50',
          )}
        />
      </div>
    )
  },
)

export function InputSearch({ placeholder, className }: InputSearchProps) {
  return (
    <PrimitiveInputSearch placeholder={placeholder} className={className} />
  )
}

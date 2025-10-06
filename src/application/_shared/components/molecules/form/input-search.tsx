import { Search } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'

import { useTable } from '@/application/_shared/hooks/table.hook'
import { cn } from '@/application/_shared/libs/tw-merge'

type InputSearchProps = {
  placeholder?: string
  className?: string
}

export type ExtendedInputSearchProps = {
  label?: string
  className?: string
  inputSize?: 'base' | 'lg'
}

export interface PrimitiveInputSearchProps
  extends React.ComponentProps<'input'> {
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

    useEffect(() => {
      if (!isFocused && search !== localValue) {
        setLocalValue(search ?? '')
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search, isFocused])

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
          'bg-white rounded-xl text-text-one flex w-full',
          'border-border-one h-[60px] relative',
          inputSize === 'lg' ? 'h-[60px] border-2' : 'h-[50px] border',
          isErrored && 'border-danger-one',
          isFocused && 'border-primary',
          disabled && 'opacity-50 cursor-not-allowed border-border-one',
          className,
        )}
      >
        <span className={cn(svgClassName, 'left-0 pointer-events-none')}>
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
            'focus:outline-none flex-1 px-3 pl-10',
            'placeholder:text-placeholder',
            disabled && 'opacity-50 cursor-not-allowed',
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

'use client'

import { Plus } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/application/_shared/components/atoms/button'
import { InputSearch } from '@/application/_shared/components/molecules/form/input-search'
import { InputSelect } from '@/application/_shared/components/molecules/form/input-select'
import { useTable } from '@/application/_shared/hooks/table.hook'
import { cn } from '@/application/_shared/libs/tw-merge'

export type TableFilterProps = {
  search: {
    placeholder: string
  }
  add: {
    label: string
    href: string
  }
  className?: string
}

export function TableFilter({ search, add, className }: TableFilterProps) {
  const {
    form: { control },
  } = useTable()

  return (
    <div className={cn('flex items-center justify-between', className)}>
      <div className="flex items-center gap-4">
        <InputSearch
          placeholder={search.placeholder}
          className="max-w-[320px]"
        />
        <div className="flex items-center gap-2">
          Mostrar:
          <InputSelect
            control={control}
            name="itemsPerPage"
            className="max-w-[150px]"
            variant="sm"
            options={[
              {
                label: '1',
                value: 1,
              },
              {
                label: '10',
                value: 10,
              },
              {
                label: '20',
                value: 20,
              },
              {
                label: '50',
                value: 50,
              },
              {
                label: '100',
                value: 100,
              },
            ]}
          />
          itens
        </div>
      </div>
      <Button className="max-w-[213px]" asChild>
        <Link href={add.href}>
          <Plus size={16} />
          {add.label}
        </Link>
      </Button>
    </div>
  )
}

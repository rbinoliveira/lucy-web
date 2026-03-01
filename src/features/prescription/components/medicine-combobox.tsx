'use client'

import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Field,
  Label,
} from '@headlessui/react'
import { ChevronDown, Pill } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Control, Controller } from 'react-hook-form'

import { MedicineModel } from '@/features/medicine/models/medicine.model'
import { ListMedicinesService } from '@/features/medicine/service/list-medicines.service'
import { SavePrescriptionFormSchema } from '@/features/prescription/schemas/save-prescription.schema'
import { cn } from '@/shared/libs/tw-merge'

type MedicineComboboxProps = {
  control: Control<SavePrescriptionFormSchema>
  onMedicineSelect?: (medicine: MedicineModel | null) => void
}

export function MedicineCombobox({
  control,
  onMedicineSelect,
}: MedicineComboboxProps) {
  const [query, setQuery] = useState('')
  const [selectedMedicine, setSelectedMedicine] =
    useState<MedicineModel | null>(null)

  const { data: medicinesData } = ListMedicinesService({
    page: 1,
    itemsPerPage: 100,
    search: query || undefined,
  })

  const medicines = useMemo(
    () => medicinesData?.items ?? [],
    [medicinesData?.items],
  )

  const filteredMedicines = useMemo(() => {
    if (query === '') {
      return medicines
    }
    return medicines.filter((medicine) => {
      return medicine.name.toLowerCase().includes(query.toLowerCase())
    })
  }, [medicines, query])

  return (
    <Controller
      name="medicineId"
      control={control}
      render={({ field, fieldState }) => (
        <Field>
          <Label className="text-text-one text-sm font-medium">
            Medicamento
          </Label>
          <Combobox
            value={selectedMedicine}
            onChange={(medicine: MedicineModel | null) => {
              setSelectedMedicine(medicine)
              field.onChange(medicine?.id ?? '')
              if (onMedicineSelect) {
                onMedicineSelect(medicine)
              }
            }}
            onClose={() => {
              if (!selectedMedicine) {
                setQuery('')
              } else {
                setQuery(selectedMedicine.name)
              }
            }}
          >
            <div className="relative">
              <ComboboxInput
                displayValue={(medicine: MedicineModel | null) =>
                  medicine?.name ?? field.value ?? ''
                }
                onChange={(event) => {
                  const value = event.target.value
                  setQuery(value)
                  field.onChange(value)
                  if (value === '') {
                    setSelectedMedicine(null)
                    if (onMedicineSelect) {
                      onMedicineSelect(null)
                    }
                  } else {
                    const matchingMedicine = medicines.find(
                      (m) => m.name.toLowerCase() === value.toLowerCase(),
                    )
                    if (!matchingMedicine) {
                      setSelectedMedicine(null)
                    }
                  }
                }}
                className={cn(
                  'border-border-one text-text-one placeholder:text-placeholder',
                  'focus:border-primary focus:ring-primary',
                  'h-[56px] w-full rounded-xl border px-4 pr-10',
                  'text-sm outline-none transition-colors',
                  fieldState.error && 'border-danger-one',
                )}
                placeholder="Buscar medicamento..."
              />
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                <ChevronDown className="text-text-three h-5 w-5" />
              </div>
            </div>
            <ComboboxOptions
              anchor="bottom"
              className={cn(
                'border-border-one bg-white',
                'mt-2 max-h-60 overflow-auto rounded-xl border shadow-one',
                'empty:invisible',
              )}
            >
              {filteredMedicines.length === 0 && query !== '' ? (
                <div className="text-text-two px-4 py-3 text-sm">
                  Nenhum medicamento encontrado
                </div>
              ) : (
                filteredMedicines.map((medicine) => (
                  <ComboboxOption
                    key={medicine.id}
                    value={medicine}
                    className={cn(
                      'text-text-one cursor-pointer px-4 py-3 text-sm',
                      'data-focus:bg-primary data-focus:text-primary-contrast',
                      'transition-colors',
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Pill className="h-4 w-4" />
                      <div className="flex flex-col">
                        <span>{medicine.name}</span>
                        <span className="text-text-two text-xs">
                          {medicine.dose} - {medicine.pharmaceuticalForm}
                        </span>
                      </div>
                    </div>
                  </ComboboxOption>
                ))
              )}
            </ComboboxOptions>
          </Combobox>
          {fieldState.error && (
            <p className="text-danger-one mt-1 text-xs">
              {fieldState.error.message}
            </p>
          )}
        </Field>
      )}
    />
  )
}

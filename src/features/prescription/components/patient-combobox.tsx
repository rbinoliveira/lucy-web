'use client'

import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Field,
  Label,
} from '@headlessui/react'
import { ChevronDown, User } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Control, Controller } from 'react-hook-form'

import { useAuth } from '@/features/auth/hooks/auth.hook'
import { PatientModel } from '@/features/patient/models/patient.model'
import { ListPatientsService } from '@/features/patient/service/list-patients.service'
import { SavePrescriptionFormSchema } from '@/features/prescription/schemas/save-prescription.schema'
import { cn } from '@/shared/libs/tw-merge'

type PatientComboboxProps = {
  control: Control<SavePrescriptionFormSchema>
  onPatientSelect?: (patient: PatientModel | null) => void
  initialPatientName?: string
}

export function PatientCombobox({
  control,
  onPatientSelect,
  initialPatientName,
}: PatientComboboxProps) {
  const { user } = useAuth()
  const [query, setQuery] = useState('')
  const [selectedPatient, setSelectedPatient] = useState<PatientModel | null>(
    null,
  )

  const { data: patientsData } = ListPatientsService({
    ownerId: user?.id ?? '',
    page: 1,
    itemsPerPage: 100,
    search: query || undefined,
  })

  const patients = useMemo(
    () => patientsData?.items ?? [],
    [patientsData?.items],
  )

  const filteredPatients = useMemo(() => {
    if (query === '') {
      return patients
    }
    return patients.filter((patient) => {
      return patient.name.toLowerCase().includes(query.toLowerCase())
    })
  }, [patients, query])

  useEffect(() => {
    if (initialPatientName && patients.length > 0 && !selectedPatient) {
      const patient = patients.find(
        (p) => p.name.toLowerCase() === initialPatientName.toLowerCase(),
      )
      if (patient) {
        setSelectedPatient(patient)
        if (onPatientSelect) {
          onPatientSelect(patient)
        }
      }
    }
  }, [initialPatientName, patients, selectedPatient, onPatientSelect])

  return (
    <Controller
      name="patientName"
      control={control}
      render={({ field, fieldState }) => (
        <Field>
          <Label className="text-text-one text-sm font-medium">Paciente</Label>
          <Combobox
            value={selectedPatient}
            onChange={(patient: PatientModel | null) => {
              setSelectedPatient(patient)
              field.onChange(patient?.name ?? '')
              if (onPatientSelect) {
                onPatientSelect(patient)
              }
            }}
            onClose={() => {
              if (!selectedPatient) {
                setQuery('')
              } else {
                setQuery(selectedPatient.name)
              }
            }}
          >
            <div className="relative">
              <ComboboxInput
                displayValue={(patient: PatientModel | null) =>
                  patient?.name ?? field.value ?? ''
                }
                onChange={(event) => {
                  const value = event.target.value
                  setQuery(value)
                  field.onChange(value)
                  if (value === '') {
                    setSelectedPatient(null)
                    if (onPatientSelect) {
                      onPatientSelect(null)
                    }
                  } else {
                    const matchingPatient = patients.find(
                      (p) => p.name.toLowerCase() === value.toLowerCase(),
                    )
                    if (!matchingPatient) {
                      setSelectedPatient(null)
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
                placeholder="Buscar paciente..."
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
              {filteredPatients.length === 0 && query !== '' ? (
                <div className="text-text-two px-4 py-3 text-sm">
                  Nenhum paciente encontrado
                </div>
              ) : (
                filteredPatients.map((patient) => (
                  <ComboboxOption
                    key={patient.id}
                    value={patient}
                    className={cn(
                      'text-text-one cursor-pointer px-4 py-3 text-sm',
                      'data-focus:bg-primary data-focus:text-primary-contrast',
                      'transition-colors',
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <User className="h-4 w-4" />
                      <span>{patient.name}</span>
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

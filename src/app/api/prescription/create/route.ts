import { NextResponse } from 'next/server'

import { savePrescriptionUseCaseSchema } from '@/features/prescription/schemas/save-prescription.schema'
import { getCurrentUserApi } from '@/shared/helpers/get-current-user-api.helper'
import { normalizeName } from '@/shared/helpers/normalize-string.helper'
import { dbAdmin } from '@/shared/libs/firebase-admin'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const parsed = savePrescriptionUseCaseSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { errors: parsed.error.flatten().fieldErrors },
        { status: 400 },
      )
    }

    const data = parsed.data

    const currentUser = await getCurrentUserApi()
    if (!currentUser) {
      return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 })
    }

    if (currentUser.role !== 'admin' && data.ownerId !== currentUser.id) {
      return NextResponse.json({ error: 'Não autorizado.' }, { status: 403 })
    }

    const prescriptionsRef = dbAdmin.collection('prescriptions')
    const newDocRef = prescriptionsRef.doc()

    await newDocRef.set({
      id: newDocRef.id,
      patientId: data.patientId,
      patientEmail: data.patientEmail,
      patientName: data.patientName,
      patientNameNormalized: normalizeName(data.patientName),
      medicineId: data.medicineId,
      medicineName: data.medicineName,
      medicineNameNormalized: normalizeName(data.medicineName),
      dosage: data.dosage,
      durationDays: data.durationDays ?? null,
      durationDescription: data.durationDescription ?? null,
      notes: data.notes ?? null,
      ownerId: currentUser.role === 'admin' ? data.ownerId : currentUser.id,
      status: data.status || 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })

    return NextResponse.json({
      message: 'Prescrição registrada com sucesso.',
      id: newDocRef.id,
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Ocorreu um erro interno, tente novamente mais tarde.' },
      { status: 500 },
    )
  }
}

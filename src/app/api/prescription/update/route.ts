import { NextResponse } from 'next/server'

import { savePrescriptionUseCaseSchema } from '@/features/prescription/schemas/save-prescription.schema'
import { getCurrentUserApi } from '@/shared/helpers/get-current-user-api.helper'
import { normalizeName } from '@/shared/helpers/normalize-string.helper'
import { dbAdmin } from '@/shared/libs/firebase-admin'

export async function PUT(req: Request) {
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
    const prescriptionId = data.id

    if (!prescriptionId) {
      return NextResponse.json(
        { error: 'Prescrição não encontrada.' },
        { status: 404 },
      )
    }

    const prescriptionRef = dbAdmin
      .collection('prescriptions')
      .doc(prescriptionId)
    const prescriptionSnap = await prescriptionRef.get()

    if (!prescriptionSnap.exists) {
      return NextResponse.json(
        { error: 'Prescrição não encontrada.' },
        { status: 404 },
      )
    }

    const prescriptionData = prescriptionSnap.data()
    const user = await getCurrentUserApi()

    if (!user) {
      return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 })
    }

    if (prescriptionData?.ownerId !== user.id && user.role !== 'admin') {
      return NextResponse.json({ error: 'Não autorizado.' }, { status: 403 })
    }

    await prescriptionRef.update({
      patientId: data.patientId,
      patientEmail: data.patientEmail,
      patientName: data.patientName,
      patientNameNormalized: normalizeName(data.patientName),
      medicineId: data.medicineId ?? '',
      medicineName: data.medicineName,
      medicineNameNormalized: normalizeName(data.medicineName),
      dosage: data.dosage,
      durationDays: data.durationDays ?? null,
      durationDescription: data.durationDescription ?? null,
      notes: data.notes ?? null,
      ownerId: data.ownerId,
      status: data.status || prescriptionData?.status || 'active',
      updatedAt: new Date().toISOString(),
    })

    return NextResponse.json({
      message: 'Prescrição atualizada com sucesso.',
      id: prescriptionId,
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Ocorreu um erro interno, tente novamente mais tarde.' },
      { status: 500 },
    )
  }
}

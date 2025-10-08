import { NextResponse } from 'next/server'

import {
  normalizeName,
  normalizePhone,
} from '@/application/_shared/helpers/normalize-string.helper'
import { dbAdmin } from '@/application/_shared/libs/firebase-admin'
import { savePrescriptionUseCaseSchema } from '@/application/prescription/schemas/save-prescription.schema'

export async function PUT(req: Request) {
  try {
    const body = await req.json()

    // ✅ Validação dos dados recebidos
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

    // ✅ Verifica se o documento existe
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

    // ✅ Atualiza os campos no Firestore
    await prescriptionRef.update({
      name: data.name,
      phone: data.phone,
      dob: data.dob,
      email: data.email,
      ownerId: data.ownerId,
      nameNormalized: normalizeName(data.name),
      phoneNormalized: normalizePhone(data.phone),
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

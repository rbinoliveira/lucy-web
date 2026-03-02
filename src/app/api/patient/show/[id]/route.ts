import { NextResponse } from 'next/server'

import { getCurrentUserApi } from '@/shared/helpers/get-current-user-api.helper'
import { dbAdmin } from '@/shared/libs/firebase-admin'

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const user = await getCurrentUserApi()

    if (!user) {
      return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 })
    }

    const docRef = dbAdmin.collection('users').doc(id)
    const docSnap = await docRef.get()

    if (!docSnap.exists) {
      return NextResponse.json(
        { error: 'Paciente não encontrado.' },
        { status: 404 },
      )
    }

    const data = docSnap.data()

    if (!data) {
      return NextResponse.json(
        { error: 'Paciente não encontrado.' },
        { status: 404 },
      )
    }

    if (data.ownerId !== user.id && user.role !== 'admin') {
      return NextResponse.json({ error: 'Não autorizado.' }, { status: 403 })
    }

    const dob = data.dob
    let dobFormatted: string | Date

    if (dob && typeof dob === 'object' && 'toDate' in dob) {
      dobFormatted = dob.toDate().toISOString()
    } else if (dob && typeof dob === 'object' && 'seconds' in dob) {
      dobFormatted = new Date(
        (dob as { seconds: number }).seconds * 1000,
      ).toISOString()
    } else if (dob instanceof Date) {
      dobFormatted = dob.toISOString()
    } else {
      dobFormatted = dob as string
    }

    return NextResponse.json({
      id: docSnap.id,
      ...data,
      dob: dobFormatted,
    })
  } catch {
    return NextResponse.json(
      { error: 'Ocorreu um erro interno, tente novamente mais tarde.' },
      { status: 500 },
    )
  }
}

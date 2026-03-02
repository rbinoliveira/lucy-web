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

    const docRef = dbAdmin.collection('prescriptions').doc(id)
    const docSnap = await docRef.get()

    if (!docSnap.exists) {
      return NextResponse.json(
        { error: 'Prescrição não encontrada.' },
        { status: 404 },
      )
    }

    const data = docSnap.data()

    if (data?.ownerId !== user.id && user.role !== 'admin') {
      return NextResponse.json({ error: 'Não autorizado.' }, { status: 403 })
    }

    return NextResponse.json({
      id: docSnap.id,
      ...data,
    })
  } catch {
    return NextResponse.json(
      { error: 'Ocorreu um erro interno, tente novamente mais tarde.' },
      { status: 500 },
    )
  }
}

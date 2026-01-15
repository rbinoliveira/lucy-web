import { NextResponse } from 'next/server'

import { dbAdmin } from '@/application/_shared/libs/firebase-admin'

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params

    const docRef = dbAdmin.collection('users').doc(id)
    const docSnap = await docRef.get()

    if (!docSnap.exists) {
      return NextResponse.json(
        { error: 'Paciente não encontrado.' },
        { status: 404 },
      )
    }

    return NextResponse.json({
      id: docSnap.id,
      ...docSnap.data(),
    })
  } catch {
    return NextResponse.json(
      { error: 'Ocorreu um erro interno, tente novamente mais tarde.' },
      { status: 500 },
    )
  }
}

import { NextResponse } from 'next/server'

import { dbAdmin } from '@/application/_shared/libs/firebase-admin'

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params

    const docRef = dbAdmin.collection('prescriptions').doc(id)
    const docSnap = await docRef.get()

    if (!docSnap.exists) {
      return NextResponse.json(
        { error: 'Prescrição não encontrada.' },
        { status: 404 },
      )
    }

    return NextResponse.json({
      id: docSnap.id,
      ...docSnap.data(),
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Ocorreu um erro interno, tente novamente mais tarde.' },
      { status: 500 },
    )
  }
}

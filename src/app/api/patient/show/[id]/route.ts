import { NextResponse } from 'next/server'

import { dbAdmin } from '@/application/_shared/libs/firebase-admin'

type Params = {
  params: {
    id: string
  }
}

export async function GET(_: Request, context: Promise<Params>) {
  try {
    const { params } = await context
    const { id } = params

    const docRef = dbAdmin.collection('users').doc(id)
    const docSnap = await docRef.get()

    if (!docSnap.exists) {
      return NextResponse.json(
        { error: 'Usuário não encontrado no Firestore.' },
        { status: 404 },
      )
    }

    return NextResponse.json({
      id: docSnap.id,
      ...docSnap.data(),
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro interno do servidor.' },
      { status: 500 },
    )
  }
}

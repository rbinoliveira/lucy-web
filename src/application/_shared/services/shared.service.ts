import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from 'firebase/firestore'

import { db } from '@/application/_shared/libs/firebase'

export async function createDocument<T extends Record<string, any>>(
  collectionName: string,
  data: T,
): Promise<string> {
  const colRef = collection(db, collectionName)
  const docRef = await addDoc(colRef, data as any)
  return docRef.id
}

export async function getDocuments<T extends Record<string, any>>(
  collectionName: string,
): Promise<Array<{ id: string } & T>> {
  const snapshot = await getDocs(collection(db, collectionName))
  return snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as T) }))
}

export async function getDocument<T extends Record<string, any>>(
  collectionName: string,
  id: string,
): Promise<({ id: string } & T) | null> {
  const docRef = doc(db, collectionName, id)
  const snap = await getDoc(docRef)
  if (!snap.exists()) return null
  return { id: snap.id, ...(snap.data() as T) }
}

export async function updateDocument<T extends Partial<Record<string, any>>>(
  collectionName: string,
  id: string,
  data: T,
): Promise<void> {
  const docRef = doc(db, collectionName, id)
  await updateDoc(docRef, data as any)
}

export async function upsertDocument<T extends Record<string, any>>(
  collectionName: string,
  id: string,
  data: T,
): Promise<void> {
  console.log(data)
  const docRef = doc(db, collectionName, id)

  await setDoc(docRef, data, { merge: true })
}

export async function deleteDocument(
  collectionName: string,
  id: string,
): Promise<void> {
  const docRef = doc(db, collectionName, id)
  await deleteDoc(docRef)
}

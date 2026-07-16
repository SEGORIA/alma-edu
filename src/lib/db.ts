import {
  collection, doc, getDoc, getDocs, setDoc, query, orderBy, where, serverTimestamp,
} from 'firebase/firestore'
import { db, firebaseReady } from './firebase'
import type { Curso, Recurso, Inscripcion, EstudiantePerfil } from './types'

/* ── Recursos gratis (home) ─────────────────────────────────── */
export async function getRecursosPublicados(): Promise<Recurso[]> {
  if (!firebaseReady || !db) return []
  try {
    const snap = await getDocs(query(collection(db, 'recursos'), orderBy('orden', 'asc')))
    return snap.docs
      .map(d => ({ ...(d.data() as Recurso), _id: d.id }))
      .filter(r => r.estado === 'publicado')
  } catch { return [] }
}

/* ── Cursos ─────────────────────────────────────────────────── */
export async function getCursosPublicados(): Promise<Curso[]> {
  if (!firebaseReady || !db) return []
  try {
    const snap = await getDocs(collection(db, 'cursos'))
    return snap.docs
      .map(d => ({ ...(d.data() as Curso), _id: d.id }))
      .filter(c => c.estado === 'publicado')
  } catch { return [] }
}

export async function getCursoBySlug(slug: string): Promise<Curso | null> {
  if (!firebaseReady || !db) return null
  try {
    const snap = await getDocs(query(collection(db, 'cursos'), where('slug', '==', slug)))
    const found = snap.docs.find(d => (d.data() as Curso).estado === 'publicado')
    if (!found) return null
    return { ...(found.data() as Curso), _id: found.id }
  } catch { return null }
}

/* ── Perfil de estudiante ───────────────────────────────────── */
export async function ensureEstudiante(uid: string, perfil: EstudiantePerfil): Promise<void> {
  if (!firebaseReady || !db) return
  await setDoc(doc(db, 'estudiantes', uid), { ...perfil, updatedAt: serverTimestamp() }, { merge: true })
}

export async function getEstudiante(uid: string): Promise<EstudiantePerfil | null> {
  if (!firebaseReady || !db) return null
  try {
    const snap = await getDoc(doc(db, 'estudiantes', uid))
    if (!snap.exists()) return null
    return snap.data() as EstudiantePerfil
  } catch { return null }
}

/* ── Inscripciones / progreso ───────────────────────────────── */
export async function getInscripciones(uid: string): Promise<Inscripcion[]> {
  if (!firebaseReady || !db) return []
  try {
    const snap = await getDocs(collection(db, 'estudiantes', uid, 'inscripciones'))
    return snap.docs.map(d => d.data() as Inscripcion)
  } catch { return [] }
}

export async function getInscripcion(uid: string, cursoId: string): Promise<Inscripcion | null> {
  if (!firebaseReady || !db) return null
  try {
    const snap = await getDoc(doc(db, 'estudiantes', uid, 'inscripciones', cursoId))
    if (!snap.exists()) return null
    return snap.data() as Inscripcion
  } catch { return null }
}

export async function inscribir(uid: string, cursoId: string): Promise<void> {
  if (!firebaseReady || !db) return
  await setDoc(
    doc(db, 'estudiantes', uid, 'inscripciones', cursoId),
    { cursoId, leccionesCompletadas: [], inscritoEn: serverTimestamp() },
    { merge: true },
  )
}

export async function setLeccionCompletada(
  uid: string, cursoId: string, leccionesCompletadas: string[], completado: boolean,
): Promise<void> {
  if (!firebaseReady || !db) return
  await setDoc(
    doc(db, 'estudiantes', uid, 'inscripciones', cursoId),
    {
      cursoId,
      leccionesCompletadas,
      ...(completado ? { completadoEn: serverTimestamp() } : {}),
    },
    { merge: true },
  )
}

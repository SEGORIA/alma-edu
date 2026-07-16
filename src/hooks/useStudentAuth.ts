import { useState, useEffect } from 'react'
import {
  onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword,
  updateProfile, signOut, type User,
} from 'firebase/auth'
import { auth, firebaseReady } from '../lib/firebase'
import { ensureEstudiante } from '../lib/db'

/* Auth de estudiantes de la Academia. Usa la misma instancia de Firebase Auth
   del proyecto de Alma; el rol "estudiante" se materializa en el documento
   estudiantes/{uid} (creado al registrarse). El acceso a /admin sigue
   protegido aparte por la allowlist admins/{uid} en alma-web. */
export function useStudentAuth() {
  const [user, setUser]       = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!firebaseReady || !auth) { setLoading(false); return }
    const unsub = onAuthStateChanged(auth, u => {
      setUser(u)
      setLoading(false)
    })
    return unsub
  }, [])

  const login = (email: string, password: string) => {
    if (!auth) throw new Error('Firebase no configurado')
    return signInWithEmailAndPassword(auth, email.trim(), password)
  }

  const registrar = async (nombre: string, email: string, password: string) => {
    if (!auth) throw new Error('Firebase no configurado')
    const cred = await createUserWithEmailAndPassword(auth, email.trim(), password)
    await updateProfile(cred.user, { displayName: nombre.trim() })
    await ensureEstudiante(cred.user.uid, { nombre: nombre.trim(), email: email.trim() })
    return cred
  }

  const logout = () => {
    if (!auth) return Promise.resolve()
    return signOut(auth)
  }

  return { user, loading, login, registrar, logout }
}

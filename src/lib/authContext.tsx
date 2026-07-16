import { createContext, useContext, type ReactNode } from 'react'
import { useStudentAuth } from '../hooks/useStudentAuth'

type AuthValue = ReturnType<typeof useStudentAuth>

const AuthContext = createContext<AuthValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useStudentAuth()
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  return ctx
}

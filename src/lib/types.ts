/* Tipos del LMS — espejo de alma-web/src/data/academia.ts.
   Los dos repos son despliegues separados sobre el mismo Firestore, así que
   estas definiciones se mantienen en paralelo (no comparten código). */

export type LeccionTipo = 'video' | 'texto'
export type LeccionRecurso = { nombre: string; url: string }

export type Leccion = {
  id:              string
  titulo:          string
  tipo:            LeccionTipo
  video_url?:      string
  contenido_html?: string
  recursos?:       LeccionRecurso[]
  duracion_min?:   number
  orden:           number
}

export type Modulo = {
  id:        string
  titulo:    string
  lecciones: Leccion[]
  orden:     number
}

export type CursoCategoria = 'diseno_branding' | 'marketing_digital' | 'emprendimiento' | 'fotografia_video'
export type CursoNivel     = 'principiante' | 'intermedio' | 'avanzado'
export type CursoEstado    = 'borrador' | 'publicado'

export const CURSO_CATEGORIAS: { value: CursoCategoria; label: string; icon: string }[] = [
  { value: 'diseno_branding',   label: 'Diseño & Branding',    icon: '🎨' },
  { value: 'marketing_digital', label: 'Marketing Digital',    icon: '📲' },
  { value: 'emprendimiento',    label: 'Emprendimiento',       icon: '💼' },
  { value: 'fotografia_video',  label: 'Fotografía & Video',   icon: '📸' },
]

export const NIVEL_LABEL: Record<CursoNivel, string> = {
  principiante: 'Principiante',
  intermedio:   'Intermedio',
  avanzado:     'Avanzado',
}

export type Curso = {
  _id:             string
  titulo:          string
  slug:            string
  descripcion:     string
  categoria:       CursoCategoria
  imagen_portada?: string
  instructor?:     string
  nivel?:          CursoNivel
  modulos:         Modulo[]
  estado:          CursoEstado
}

export type RecursoTipo = 'prompt' | 'pdf' | 'plantilla' | 'video' | 'checklist' | 'otro'

export const RECURSO_TIPOS: Record<RecursoTipo, { label: string; icon: string }> = {
  prompt:    { label: 'Prompt', icon: '🤖' },
  pdf:       { label: 'PDF', icon: '📄' },
  plantilla: { label: 'Plantilla', icon: '🧩' },
  video:     { label: 'Video', icon: '🎬' },
  checklist: { label: 'Checklist', icon: '✅' },
  otro:      { label: 'Recurso', icon: '🎁' },
}

export type Recurso = {
  _id:         string
  titulo:      string
  descripcion: string
  tipo:        RecursoTipo
  contenido?:  string
  url?:        string
  orden:       number
  estado:      CursoEstado
}

/* Progreso del estudiante — subcolección estudiantes/{uid}/inscripciones/{cursoId} */
export type Inscripcion = {
  cursoId:             string
  leccionesCompletadas: string[]
  inscritoEn?:         unknown
  completadoEn?:       unknown
}

export type EstudiantePerfil = {
  nombre: string
  email:  string
}

export function totalLecciones(curso: Curso): number {
  return curso.modulos.reduce((n, m) => n + m.lecciones.length, 0)
}

/**
 * API client — typed fetch wrapper with JWT auth.
 * All backend communication goes through this module.
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001'

let _token: string | null = localStorage.getItem('auth_token')

export function setToken(token: string | null) {
  _token = token
  if (token) localStorage.setItem('auth_token', token)
  else localStorage.removeItem('auth_token')
}

export function getToken(): string | null { return _token }

async function request<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(opts.headers as Record<string, string> ?? {}),
  }
  if (_token) headers['Authorization'] = `Bearer ${_token}`

  const res = await fetch(`${API_BASE}${path}`, { ...opts, headers })

  if (res.status === 401) {
    // Token expired or invalid — clear auth
    setToken(null)
    window.dispatchEvent(new Event('auth:expired'))
  }

  const data = await res.json()
  if (!res.ok) throw new ApiError(res.status, data.error || 'Request failed', data)
  return data as T
}

export class ApiError extends Error {
  constructor(public status: number, message: string, public data?: any) {
    super(message)
  }
}

// ── Auth ─────────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string
  email: string
  displayName: string
}

export async function apiRegister(email: string, password: string, displayName: string) {
  return request<{ token: string; user: AuthUser }>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, displayName }),
  })
}

export async function apiLogin(email: string, password: string) {
  return request<{ token: string; user: AuthUser }>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export async function apiGetMe() {
  return request<{ user: AuthUser }>('/api/auth/me')
}

// ── Exercises ────────────────────────────────────────────────────────────────

export interface DbExercise {
  id: string
  title: string
  description: string
  patternData: any
  config: any
  category: string
  difficulty: number
  bpm: number
  timeSignature: number[]
  bars: number
  tags: string[]
  isBuiltin: boolean
  isAiGenerated: boolean
  createdAt: string
  _count?: { sessions: number }
  sessions?: { id: string; score: number; stars: number; accuracy: number; bpm: number; startedAt: string }[]
}

export async function apiListExercises(params?: { category?: string; limit?: number }) {
  const q = new URLSearchParams()
  if (params?.category) q.set('category', params.category)
  if (params?.limit) q.set('limit', String(params.limit))
  return request<{ exercises: DbExercise[] }>(`/api/exercises?${q}`)
}

export async function apiGetExercise(id: string) {
  return request<{ exercise: DbExercise }>(`/api/exercises/${id}`)
}

export async function apiSaveExercise(data: {
  title: string; description?: string; patternData: any; config?: any
  category?: string; difficulty?: number; bpm?: number
  timeSignature?: number[]; bars?: number; tags?: string[]
  isAiGenerated?: boolean
}) {
  return request<{ exercise: DbExercise }>('/api/exercises', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function apiDeleteExercise(id: string) {
  return request<{ deleted: boolean }>(`/api/exercises/${id}`, { method: 'DELETE' })
}

// ── Practice Sessions ────────────────────────────────────────────────────────

export interface DbSession {
  id: string
  exerciseId: string | null
  bpm: number
  score: number
  stars: number
  accuracy: number
  missedNotes: number
  totalNotes: number
  hitNotes: number
  practiceMode: string
  startedAt: string
  completedAt: string | null
  exercise?: { id: string; title: string; category: string } | null
}

export async function apiRecordSession(data: {
  exerciseId?: string; bpm: number; score: number; stars: number; accuracy: number
  timingData?: any; velocityData?: any; missedNotes?: number; totalNotes?: number
  hitNotes?: number; practiceMode?: string
}) {
  return request<{ session: DbSession }>('/api/sessions', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function apiListSessions(params?: { limit?: number; practiceMode?: string }) {
  const q = new URLSearchParams()
  if (params?.limit) q.set('limit', String(params.limit))
  if (params?.practiceMode) q.set('practiceMode', params.practiceMode)
  return request<{ sessions: DbSession[]; total: number }>(`/api/sessions?${q}`)
}

export async function apiGetSessionStats() {
  return request<{
    totalSessions: number
    totalByMode: any[]
    bestScores: any[]
    recentActivity: any[]
  }>('/api/sessions/stats')
}

export async function apiGetBestScore(exerciseId: string) {
  return request<{ best: DbSession | null }>(`/api/sessions/best/${exerciseId}`)
}

// ── Progress ─────────────────────────────────────────────────────────────────

export interface DbProgress {
  id: string
  currentModule: string
  completedLessons: string[]
  skillTiming: number
  skillDynamics: number
  skillIndependence: number
  skillSpeed: number
  skillMusicality: number
}

export async function apiGetProgress() {
  return request<{ progress: DbProgress }>('/api/progress')
}

export async function apiUpdateProgress(data: Partial<{
  currentModule: string; skillTiming: number; skillDynamics: number
  skillIndependence: number; skillSpeed: number; skillMusicality: number
}>) {
  return request<{ progress: DbProgress }>('/api/progress', {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
}

export async function apiCompleteLesson(lessonId: string) {
  return request<{ progress: DbProgress }>('/api/progress/complete-lesson', {
    method: 'POST',
    body: JSON.stringify({ lessonId }),
  })
}

function normalizeBaseUrl(value) {
  if (!value) {
    return ''
  }

  return value.endsWith('/') ? value.slice(0, -1) : value
}

const defaultBase = import.meta.env.DEV ? 'http://localhost:8000' : ''

export const API_BASE = normalizeBaseUrl(
  import.meta.env.VITE_API_BASE || defaultBase,
)

export function buildApiUrl(path) {
  if (/^https?:\/\//.test(path)) {
    return path
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${API_BASE}${normalizedPath}`
}

export async function apiFetch(path, options = {}) {
  return fetch(buildApiUrl(path), {
    credentials: 'include',
    ...options,
  })
}

export function getCookie(name) {
  const cookie = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${name}=`))

  return cookie ? decodeURIComponent(cookie.split('=')[1]) : ''
}

export async function ensureCsrfCookie() {
  await apiFetch('/api/accounts/csrf/')
}

export async function readJson(response) {
  return response.json().catch(() => null)
}

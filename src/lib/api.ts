type ApiOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: unknown
}

class ApiError extends Error {
  status: number
  data: unknown

  constructor(status: number, message: string, data: unknown = null) {
    super(message)
    this.status = status
    this.data = data
  }
}

function getCookie(name: string) {
  return document.cookie
    .split('; ')
    .find((cookie) => cookie.startsWith(`${name}=`))
    ?.slice(name.length + 1)
}

async function getCsrfToken() {
  if (!getCookie('csrftoken')) {
    await fetch('/api/auth/csrf/', { credentials: 'same-origin' })
  }
  return getCookie('csrftoken')
}

function getErrorMessage(status: number, data: unknown) {
  if (status === 429) {
    return 'Za dużo prób. Spróbuj ponownie za jakiś czas.'
  }
  if (data && typeof data === 'object') {
    if ('detail' in data && typeof data.detail === 'string') {
      return data.detail
    }
    const firstError = Object.values(data)[0]
    if (typeof firstError === 'string') {
      return firstError
    }
    if (Array.isArray(firstError) && typeof firstError[0] === 'string') {
      return firstError[0]
    }
  }
  return 'Coś poszło nie tak. Spróbuj ponownie.'
}

async function api<T>(path: string, { method = 'GET', body }: ApiOptions = {}) {
  const isFormData = body instanceof FormData
  const headers: Record<string, string> = { Accept: 'application/json' }
  if (body !== undefined && !isFormData) {
    headers['Content-Type'] = 'application/json'
  }
  if (method !== 'GET') {
    const csrfToken = await getCsrfToken()
    if (csrfToken) {
      headers['X-CSRFToken'] = csrfToken
    }
  }

  const response = await fetch(`/api/${path}`, {
    method,
    headers,
    credentials: 'same-origin',
    body: body === undefined || isFormData ? body : JSON.stringify(body),
  })
  const data: unknown =
    response.status === 204 ? null : await response.json().catch(() => null)

  if (!response.ok) {
    throw new ApiError(
      response.status,
      getErrorMessage(response.status, data),
      data,
    )
  }
  return data as T
}

export { api, ApiError }

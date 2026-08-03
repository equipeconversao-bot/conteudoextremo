/**
 * Better Auth Client & RBAC Manager for Content Hub
 * Roles: 'admin' | 'editor' | 'visualizador'
 * Status: 'approved' | 'pending' | 'rejected'
 * Centralized API Integration with fallback to LocalStorage
 */

const AUTH_USERS_KEY = 'content_hub_auth_users_v2'
const AUTH_SESSION_KEY = 'content_hub_auth_session_v2'

export function getLocalSession() {
  try {
    const data = localStorage.getItem(AUTH_SESSION_KEY)
    if (data) return JSON.parse(data)
  } catch (e) {
    console.error('Error reading local session:', e)
  }
  return null
}

export function saveLocalSession(user) {
  try {
    if (user) {
      localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(user))
    } else {
      localStorage.removeItem(AUTH_SESSION_KEY)
    }
  } catch (e) {
    console.error('Error saving local session:', e)
  }
}

export function getLocalUsers() {
  try {
    const data = localStorage.getItem(AUTH_USERS_KEY)
    if (data) return JSON.parse(data)
  } catch (e) {
    console.error('Error reading local users:', e)
  }
  return []
}

export function saveLocalUsers(users) {
  try {
    localStorage.setItem(AUTH_USERS_KEY, JSON.stringify(users))
  } catch (e) {
    console.error('Error saving local users:', e)
  }
}

async function apiFetch(endpoint, options = {}) {
  try {
    const res = await fetch(endpoint, {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options,
    })
    const data = await res.json()
    if (!res.ok) {
      throw new Error(data.error || 'Erro na requisição')
    }
    return data
  } catch (err) {
    console.warn(`API call to ${endpoint} failed, falling back:`, err.message)
    throw err
  }
}

export async function fetchUsersList() {
  try {
    const res = await apiFetch('/api/auth/users')
    if (res && res.users) {
      saveLocalUsers(res.users)
      return res.users
    }
  } catch (err) {
    // Fallback to local
  }
  return getLocalUsers()
}

export async function registerUser({ name, email, password }) {
  const normalizedEmail = email.trim().toLowerCase()

  try {
    const res = await apiFetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email: normalizedEmail, password }),
    })
    
    if (res && res.user) {
      const currentList = getLocalUsers()
      saveLocalUsers([...currentList.filter(u => u.id !== res.user.id), res.user])
      if (res.user.status === 'approved') {
        saveLocalSession(res.user)
      }
      return res.user
    }
  } catch (err) {
    // Fallback local logic if API is unreachable
    const users = getLocalUsers()
    const existing = users.find(u => u.email.toLowerCase() === normalizedEmail)
    if (existing) {
      throw new Error(err.message || 'Já existe uma conta com este e-mail.')
    }

    const isFirstUser = users.length === 0
    const role = isFirstUser ? 'admin' : 'visualizador'
    const status = isFirstUser ? 'approved' : 'pending'

    const newUser = {
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: name.trim(),
      email: normalizedEmail,
      password,
      role,
      status,
      createdAt: new Date().toISOString(),
    }

    const updated = [...users, newUser]
    saveLocalUsers(updated)
    if (status === 'approved') saveLocalSession(newUser)
    return newUser
  }
}

export async function loginUser({ email, password }) {
  const normalizedEmail = email.trim().toLowerCase()

  try {
    const res = await apiFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: normalizedEmail, password }),
    })

    if (res) {
      if (!res.isPending && res.user) {
        saveLocalSession(res.user)
      }
      return res
    }
  } catch (err) {
    // Fallback local check
    const users = getLocalUsers()
    const user = users.find(u => u.email.toLowerCase() === normalizedEmail)
    if (!user || user.password !== password) {
      throw new Error(err.message || 'E-mail ou senha incorretos.')
    }

    if (user.status === 'pending') {
      return { isPending: true, user }
    }
    if (user.status === 'rejected') {
      throw new Error('Sua solicitação de acesso foi recusada pelo administrador.')
    }

    saveLocalSession(user)
    return { isPending: false, user }
  }
}

export function logoutUser() {
  saveLocalSession(null)
}

export async function adminApproveUser(userId) {
  try {
    const res = await apiFetch('/api/auth/admin/approve', {
      method: 'POST',
      body: JSON.stringify({ userId }),
    })
    if (res && res.users) {
      saveLocalUsers(res.users)
      return res.users
    }
  } catch (err) {}

  const users = getLocalUsers()
  const updated = users.map(u => u.id === userId ? { ...u, status: 'approved' } : u)
  saveLocalUsers(updated)
  return updated
}

export async function adminRejectUser(userId) {
  try {
    const res = await apiFetch('/api/auth/admin/reject', {
      method: 'POST',
      body: JSON.stringify({ userId }),
    })
    if (res && res.users) {
      saveLocalUsers(res.users)
      return res.users
    }
  } catch (err) {}

  const users = getLocalUsers()
  const updated = users.map(u => u.id === userId ? { ...u, status: 'rejected' } : u)
  saveLocalUsers(updated)
  return updated
}

export async function adminChangeRole(userId, newRole) {
  try {
    const res = await apiFetch('/api/auth/admin/role', {
      method: 'POST',
      body: JSON.stringify({ userId, newRole }),
    })
    if (res && res.users) {
      saveLocalUsers(res.users)
      return res.users
    }
  } catch (err) {}

  const users = getLocalUsers()
  const updated = users.map(u => u.id === userId ? { ...u, role: newRole } : u)
  saveLocalUsers(updated)
  return updated
}

export async function adminCreateUser({ name, email, password, role }) {
  const normalizedEmail = email.trim().toLowerCase()

  try {
    const res = await apiFetch('/api/auth/admin/create-user', {
      method: 'POST',
      body: JSON.stringify({ name, email: normalizedEmail, password, role }),
    })
    if (res && res.users) {
      saveLocalUsers(res.users)
      return res.user
    }
  } catch (err) {}

  const users = getLocalUsers()
  const existing = users.find(u => u.email.toLowerCase() === normalizedEmail)
  if (existing) {
    throw new Error('Já existe uma conta com este e-mail.')
  }

  const newUser = {
    id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    name: name.trim(),
    email: normalizedEmail,
    password,
    role: role || 'editor',
    status: 'approved',
    createdAt: new Date().toISOString(),
  }

  const updated = [...users, newUser]
  saveLocalUsers(updated)
  return newUser
}

export async function adminDeleteUser(userId) {
  try {
    const res = await apiFetch('/api/auth/admin/delete', {
      method: 'POST',
      body: JSON.stringify({ userId }),
    })
    if (res && res.users) {
      saveLocalUsers(res.users)
      return res.users
    }
  } catch (err) {}

  const users = getLocalUsers()
  const updated = users.filter(u => u.id !== userId)
  saveLocalUsers(updated)
  return updated
}

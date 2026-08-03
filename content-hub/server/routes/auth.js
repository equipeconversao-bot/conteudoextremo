import { Router } from 'express'
import fs from 'fs'
import path from 'path'

export const authRouter = Router()

const DATA_FILE = path.join('/tmp', 'content_hub_users_db.json')

function loadUsersServer() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf8')
      if (content) return JSON.parse(content)
    }
  } catch (err) {
    console.error('Error reading server users file:', err)
  }
  return []
}

function saveUsersServer(users) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2), 'utf8')
  } catch (err) {
    console.error('Error saving server users file:', err)
  }
}

let memoryUsers = loadUsersServer()

function getUsers() {
  if (!memoryUsers || memoryUsers.length === 0) {
    memoryUsers = loadUsersServer()
  }
  return memoryUsers
}

function setUsers(users) {
  memoryUsers = users
  saveUsersServer(users)
}

// GET /api/auth/users
authRouter.get('/users', (req, res) => {
  res.json({ users: getUsers() })
})

// POST /api/auth/register
authRouter.post('/register', (req, res) => {
  const { name, email, password } = req.body || {}
  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Nome, e-mail e senha são obrigatórios.' })
  }

  const users = getUsers()
  const normalizedEmail = email.trim().toLowerCase()

  const existing = users.find(u => u.email.toLowerCase() === normalizedEmail)
  if (existing) {
    return res.status(400).json({ error: 'Já existe uma conta cadastrada com este e-mail.' })
  }

  // FIRST USER ON SERVER IS ADMIN AND APPROVED! SUBSEQUENT ARE PENDING!
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
  setUsers(updated)

  res.json({ user: newUser, isPending: status === 'pending' })
})

// POST /api/auth/login
authRouter.post('/login', (req, res) => {
  const { email, password } = req.body || {}
  if (!email || !password) {
    return res.status(400).json({ error: 'E-mail e senha são obrigatórios.' })
  }

  const users = getUsers()
  const normalizedEmail = email.trim().toLowerCase()

  const user = users.find(u => u.email.toLowerCase() === normalizedEmail)
  if (!user) {
    return res.status(401).json({ error: 'E-mail ou senha incorretos.' })
  }

  if (user.password !== password) {
    return res.status(401).json({ error: 'E-mail ou senha incorretos.' })
  }

  if (user.status === 'pending') {
    return res.json({ isPending: true, user })
  }

  if (user.status === 'rejected') {
    return res.status(403).json({ error: 'Sua solicitação de acesso foi recusada pelo administrador.' })
  }

  res.json({ isPending: false, user })
})

// POST /api/auth/admin/create-user
authRouter.post('/admin/create-user', (req, res) => {
  const { name, email, password, role } = req.body || {}
  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Nome, e-mail e senha são obrigatórios.' })
  }

  const users = getUsers()
  const normalizedEmail = email.trim().toLowerCase()

  const existing = users.find(u => u.email.toLowerCase() === normalizedEmail)
  if (existing) {
    return res.status(400).json({ error: 'Já existe uma conta com este e-mail.' })
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
  setUsers(updated)

  res.json({ user: newUser, users: updated })
})

// POST /api/auth/admin/approve
authRouter.post('/admin/approve', (req, res) => {
  const { userId } = req.body || {}
  const users = getUsers()
  const updated = users.map(u => u.id === userId ? { ...u, status: 'approved' } : u)
  setUsers(updated)
  res.json({ users: updated })
})

// POST /api/auth/admin/reject
authRouter.post('/admin/reject', (req, res) => {
  const { userId } = req.body || {}
  const users = getUsers()
  const updated = users.map(u => u.id === userId ? { ...u, status: 'rejected' } : u)
  setUsers(updated)
  res.json({ users: updated })
})

// POST /api/auth/admin/role
authRouter.post('/admin/role', (req, res) => {
  const { userId, newRole } = req.body || {}
  const users = getUsers()
  const updated = users.map(u => u.id === userId ? { ...u, role: newRole } : u)
  setUsers(updated)
  res.json({ users: updated })
})

// POST /api/auth/admin/delete
authRouter.post('/admin/delete', (req, res) => {
  const { userId } = req.body || {}
  const users = getUsers()
  const updated = users.filter(u => u.id !== userId)
  setUsers(updated)
  res.json({ users: updated })
})

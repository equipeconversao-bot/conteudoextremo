import express from 'express'
import fs from 'fs'
import path from 'path'

export const dataRouter = express.Router()

const STORE_FILE = process.env.DATA_STORE_PATH || path.join('/tmp', 'content_hub_global_store.json')

// Initial in-memory global state fallback
let globalStore = {
  criativos: [],
  videosLongos: [],
  videosCurtos: [],
  cortes: [],
  frases: [],
  calendario: [],
  updatedAt: new Date().toISOString(),
}

// Load from file if exists
function loadGlobalStore() {
  try {
    if (fs.existsSync(STORE_FILE)) {
      const raw = fs.readFileSync(STORE_FILE, 'utf8')
      const data = JSON.parse(raw)
      if (data && typeof data === 'object') {
        globalStore = { ...globalStore, ...data }
      }
    }
  } catch (err) {
    console.error('Error loading global data store file:', err)
  }
}

// Save to file helper
function saveGlobalStore() {
  try {
    const dir = path.dirname(STORE_FILE)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    fs.writeFileSync(STORE_FILE, JSON.stringify(globalStore, null, 2), 'utf8')
  } catch (err) {
    console.error('Error saving global data store file:', err)
  }
}

// Initialize
loadGlobalStore()

// GET /api/data - Retrieve all global synced data
dataRouter.get('/', (req, res) => {
  loadGlobalStore()
  res.json({
    success: true,
    data: globalStore,
  })
})

// POST /api/data - Save global synced data
dataRouter.post('/', (req, res) => {
  try {
    const { criativos, videosLongos, videosCurtos, cortes, frases, calendario } = req.body || {}

    if (Array.isArray(criativos)) globalStore.criativos = criativos
    if (Array.isArray(videosLongos)) globalStore.videosLongos = videosLongos
    if (Array.isArray(videosCurtos)) globalStore.videosCurtos = videosCurtos
    if (Array.isArray(cortes)) globalStore.cortes = cortes
    if (Array.isArray(frases)) globalStore.frases = frases
    if (Array.isArray(calendario)) globalStore.calendario = calendario

    globalStore.updatedAt = new Date().toISOString()
    saveGlobalStore()

    res.json({
      success: true,
      data: globalStore,
    })
  } catch (err) {
    console.error('Error updating global data store:', err)
    res.status(500).json({ success: false, error: err.message })
  }
})

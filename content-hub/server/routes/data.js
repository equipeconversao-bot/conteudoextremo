import express from 'express'
import fs from 'fs'
import path from 'path'

export const dataRouter = express.Router()

const STORE_FILE = process.env.DATA_STORE_PATH || path.join('/tmp', 'content_hub_global_store.json')

const DEFAULT_CRIATIVOS = [
  {
    id: 'cria-1',
    nomeArquivo: 'CRIATIVO_01_DESTAQUE_CONVERSAO',
    status: 'Em Edição',
    editor: 'Ruan',
    gravacao: 'Estúdio / Tráfego',
    tag: 'Meta Ads',
    linkPastaBase: 'https://drive.google.com',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cria-2',
    nomeArquivo: 'CRIATIVO_02_UAI_VEICULOS_OFERTA',
    status: 'Aprovado',
    editor: 'Rafael',
    gravacao: 'Uai Veículos',
    tag: 'Google Ads',
    linkPastaBase: 'https://drive.google.com',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cria-3',
    nomeArquivo: 'CRIATIVO_03_DEPOIMENTO_ALUNOS',
    status: 'Fila',
    editor: 'Ruan',
    gravacao: 'Depoimentos',
    tag: 'Instagram',
    linkPastaBase: 'https://drive.google.com',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cria-4',
    nomeArquivo: 'CRIATIVO_04_ANALISE_DE_ANUNCIOS',
    status: 'Finalizado',
    editor: 'Rafael',
    gravacao: 'Tráfego Pago',
    tag: 'YouTube',
    linkPastaBase: 'https://drive.google.com',
    createdAt: new Date().toISOString(),
  },
]

const DEFAULT_VIDEOS_LONGOS = [
  {
    id: 'vl-1',
    tema: 'Como Escolher o Melhor Carro Usado em 2026',
    ondeQuem: 'Uai Veículos',
    editor: 'Rafael',
    gravado: true,
    editado: true,
    aprovado: true,
    publicado: true,
    linkFinalizado: 'https://youtube.com',
  },
  {
    id: 'vl-2',
    tema: 'Estratégia Completa de Tráfego Pago para Vendas',
    ondeQuem: 'Conversão Extrema',
    editor: 'Ruan',
    gravado: true,
    editado: true,
    aprovado: true,
    publicado: false,
    linkFinalizado: 'https://drive.google.com',
  },
]

const DEFAULT_VIDEOS_CURTOS = [
  {
    id: 'vc-1',
    titulo: 'O novo filme do Homem-Aranha',
    plataforma: 'Reels / Shorts',
    editor: 'Ruan',
    editado: true,
    aprovado: true,
    publicado: false,
  },
  {
    id: 'vc-2',
    titulo: 'Dica Rápida de Anúncios no Meta',
    plataforma: 'Instagram Reels',
    editor: 'Rafael',
    editado: true,
    aprovado: true,
    publicado: true,
  },
]

let globalStore = {
  criativos: DEFAULT_CRIATIVOS,
  videosLongos: DEFAULT_VIDEOS_LONGOS,
  videosCurtos: DEFAULT_VIDEOS_CURTOS,
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
        if (Array.isArray(data.criativos) && data.criativos.length > 0) globalStore.criativos = data.criativos
        if (Array.isArray(data.videosLongos) && data.videosLongos.length > 0) globalStore.videosLongos = data.videosLongos
        if (Array.isArray(data.videosCurtos) && data.videosCurtos.length > 0) globalStore.videosCurtos = data.videosCurtos
        if (Array.isArray(data.cortes)) globalStore.cortes = data.cortes
        if (Array.isArray(data.frases)) globalStore.frases = data.frases
        if (Array.isArray(data.calendario)) globalStore.calendario = data.calendario
      }
    }
  } catch (err) {
    console.error('Error loading global data store file:', err)
  }
}

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

    if (Array.isArray(criativos) && criativos.length > 0) globalStore.criativos = criativos
    if (Array.isArray(videosLongos) && videosLongos.length > 0) globalStore.videosLongos = videosLongos
    if (Array.isArray(videosCurtos) && videosCurtos.length > 0) globalStore.videosCurtos = videosCurtos
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

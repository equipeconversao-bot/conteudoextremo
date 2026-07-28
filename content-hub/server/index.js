import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, '.env') })

import express from 'express'
import cors from 'cors'
import https from 'https'
import { aiRouter } from './routes/ai.js'
import { claudeRouter } from './routes/claude.js'
import { instagramRouter } from './routes/instagram.js'
import { youtubeRouter } from './routes/youtube.js'
import { mineracaoRouter } from './routes/mineracao.js'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

app.use('/api/ai', aiRouter)
app.use('/api/claude', claudeRouter)
app.use('/api/instagram', instagramRouter)
app.use('/api/youtube', youtubeRouter)
app.use('/api/mineracao', mineracaoRouter)

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

const keyPath = path.join(__dirname, 'localhost.key')
const certPath = path.join(__dirname, 'localhost.crt')

if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
  https.createServer({ key: fs.readFileSync(keyPath), cert: fs.readFileSync(certPath) }, app).listen(PORT, () => {
    console.log(`Content Hub API running on https://localhost:${PORT}`)
  })
} else {
  app.listen(PORT, () => {
    console.log(`Content Hub API running on http://localhost:${PORT}`)
  })
}

import express from 'express'
import cors from 'cors'
import { authRouter } from '../server/routes/auth.js'
import { aiRouter } from '../server/routes/ai.js'
import { claudeRouter } from '../server/routes/claude.js'
import { instagramRouter } from '../server/routes/instagram.js'
import { youtubeRouter } from '../server/routes/youtube.js'
import { mineracaoRouter } from '../server/routes/mineracao.js'

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRouter)
app.use('/api/ai', aiRouter)
app.use('/api/claude', claudeRouter)
app.use('/api/instagram', instagramRouter)
app.use('/api/youtube', youtubeRouter)
app.use('/api/mineracao', mineracaoRouter)

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

export default app

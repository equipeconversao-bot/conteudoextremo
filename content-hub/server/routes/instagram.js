import { Router } from 'express'

export const instagramRouter = Router()

const IG_GRAPH = 'https://graph.facebook.com/v21.0'

function getToken() {
  return process.env.INSTAGRAM_ACCESS_TOKEN || ''
}

function getIgUserId() {
  return process.env.INSTAGRAM_USER_ID || ''
}

instagramRouter.get('/auth-url', (req, res) => {
  const clientId = process.env.FACEBOOK_APP_ID || ''
  const redirectUri = process.env.REDIRECT_URI || 'http://localhost:3001/api/instagram/callback'

  if (!clientId) {
    return res.json({ error: 'FACEBOOK_APP_ID não configurada' })
  }

  const url = `https://www.facebook.com/v21.0/dialog/oauth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=pages_show_list,pages_read_engagement,instagram_basic,instagram_content_publish&response_type=code`
  res.redirect(url)
})

instagramRouter.get('/callback', async (req, res) => {
  const { code } = req.query
  if (!code) return res.status(400).send('Missing code')

  const clientId = process.env.FACEBOOK_APP_ID || ''
  const clientSecret = process.env.FACEBOOK_APP_SECRET || ''
  const redirectUri = process.env.REDIRECT_URI || 'http://localhost:3001/api/instagram/callback'

  try {
    const tokenRes = await fetch(`https://graph.facebook.com/v21.0/oauth/access_token?client_id=${clientId}&redirect_uri=${redirectUri}&client_secret=${clientSecret}&code=${code}`)
    const tokenData = await tokenRes.json()

    if (tokenData.error) {
      return res.status(400).json({ error: tokenData.error })
    }

    const longTokenRes = await fetch(`https://graph.facebook.com/v21.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${clientId}&client_secret=${clientSecret}&fb_exchange_token=${tokenData.access_token}`)
    const longTokenData = await longTokenRes.json()

    res.json({
      message: 'Autenticação realizada!',
      hint: 'Copie o access_token abaixo para o arquivo .env',
      access_token: longTokenData.access_token || tokenData.access_token,
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

instagramRouter.post('/publish', async (req, res) => {
  const token = getToken()
  const userId = getIgUserId()

  if (!token || !userId) {
    return res.json({ error: 'Instagram não conectado. Configure INSTAGRAM_ACCESS_TOKEN e INSTAGRAM_USER_ID no .env' })
  }

  const { imageUrl, caption } = req.body

  try {
    const mediaRes = await fetch(`${IG_GRAPH}/${userId}/media?image_url=${encodeURIComponent(imageUrl)}&caption=${encodeURIComponent(caption)}&access_token=${token}`, { method: 'POST' })
    const mediaData = await mediaRes.json()

    if (mediaData.error) {
      return res.json({ error: `Erro ao criar media: ${mediaData.error.message}` })
    }

    const publishRes = await fetch(`${IG_GRAPH}/${userId}/media_publish?creation_id=${mediaData.id}&access_token=${token}`, { method: 'POST' })
    const publishData = await publishRes.json()

    if (publishData.error) {
      return res.json({ error: `Erro ao publicar: ${publishData.error.message}` })
    }

    res.json({ success: true, mediaId: publishData.id })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

instagramRouter.get('/insights', async (req, res) => {
  const token = getToken()
  const userId = getIgUserId()

  if (!token || !userId) {
    return res.json({ error: 'Instagram não conectado' })
  }

  try {
    const metrics = 'impressions,reach,profile_views,follower_count,email_contacts,phone_call_clicks,text_message_clicks,get_directions_clicks,website_clicks'
    const insightsRes = await fetch(`${IG_GRAPH}/${userId}/insights?metric=${metrics}&period=day&access_token=${token}`)
    const insightsData = await insightsRes.json()

    if (insightsData.error) {
      return res.json({ error: insightsData.error.message })
    }

    res.json({ data: insightsData.data })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

instagramRouter.get('/media', async (req, res) => {
  const token = getToken()
  const userId = getIgUserId()

  if (!token || !userId) {
    return res.json({ error: 'Instagram não conectado' })
  }

  try {
    const mediaRes = await fetch(`${IG_GRAPH}/${userId}/media?fields=id,caption,media_type,media_url,permalink,timestamp,like_count,comments_count,insights.metric(impressions,reach)&access_token=${token}`)
    const mediaData = await mediaRes.json()

    if (mediaData.error) {
      return res.json({ error: mediaData.error.message })
    }

    res.json({ data: mediaData.data })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

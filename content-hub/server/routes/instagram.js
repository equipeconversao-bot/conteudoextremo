import { Router } from 'express'

export const instagramRouter = Router()

const IG_GRAPH = 'https://graph.facebook.com/v21.0'

let runtimeConfig = {
  accessToken: '',
  userId: '',
}

function getToken() {
  return runtimeConfig.accessToken || process.env.INSTAGRAM_ACCESS_TOKEN || ''
}

function getIgUserId() {
  return runtimeConfig.userId || process.env.INSTAGRAM_USER_ID || ''
}

instagramRouter.post('/configure', (req, res) => {
  const { accessToken, userId } = req.body
  if (!accessToken || !userId) {
    return res.json({ error: 'accessToken e userId são obrigatórios' })
  }
  runtimeConfig.accessToken = accessToken
  runtimeConfig.userId = userId
  res.json({ success: true, message: 'Credenciais salvas (validade: até reiniciar o servidor)' })
})

instagramRouter.get('/auth-url', (req, res) => {
  const clientId = process.env.FACEBOOK_APP_ID || ''
  const redirectUri = process.env.REDIRECT_URI || 'http://localhost:3001/api/instagram/callback'

  if (!clientId) {
    return res.json({ error: 'FACEBOOK_APP_ID não configurada' })
  }

  const url = `https://www.facebook.com/v21.0/dialog/oauth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=pages_show_list,pages_read_engagement,instagram_basic,instagram_content_publish&response_type=code`
  res.json({ url })
})

instagramRouter.get('/callback', async (req, res) => {
  const { code, error } = req.query
  if (error) {
    return res.send(`<script>window.close()</script><p>Autenticação cancelada. Feche esta aba.</p>`)
  }
  if (!code) return res.status(400).send('Missing code')

  const clientId = process.env.FACEBOOK_APP_ID || ''
  const clientSecret = process.env.FACEBOOK_APP_SECRET || ''
  const redirectUri = process.env.REDIRECT_URI || 'http://localhost:3001/api/instagram/callback'

  try {
    const tokenRes = await fetch(`https://graph.facebook.com/v21.0/oauth/access_token?client_id=${clientId}&redirect_uri=${redirectUri}&client_secret=${clientSecret}&code=${code}`)
    const tokenData = await tokenRes.json()

    if (tokenData.error) {
      return res.status(400).send(`<p>Erro: ${tokenData.error.message}</p>`)
    }

    const longTokenRes = await fetch(`https://graph.facebook.com/v21.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${clientId}&client_secret=${clientSecret}&fb_exchange_token=${tokenData.access_token}`)
    const longTokenData = await longTokenRes.json()

    const accessToken = longTokenData.access_token || tokenData.access_token

    // Busca o user ID do Instagram
    const accountsRes = await fetch(`https://graph.facebook.com/v21.0/me/accounts?fields=instagram_business_account{id,username}&access_token=${accessToken}`)
    const accountsData = await accountsRes.json()
    const igAccount = accountsData?.data?.[0]?.instagram_business_account

    res.send(`<!DOCTYPE html>
<html lang="pt-BR"><head><meta charset="UTF-8"><title>Instagram Conectado</title>
<style>
  body { font-family: system-ui, sans-serif; background: #0a0a0a; color: #fafafa; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
  .card { background: #171717; border: 1px solid #262626; border-radius: 16px; padding: 32px; max-width: 560px; width: 90%; }
  h2 { margin-top: 0; font-size: 20px; }
  .field { margin: 16px 0; }
  .field label { display: block; font-size: 12px; color: #a1a1a1; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.05em; }
  .field code { display: block; background: #262626; padding: 12px; border-radius: 8px; font-size: 13px; word-break: break-all; color: #34d399; }
  .btn { display: inline-block; margin-top: 8px; padding: 10px 20px; background: #10b981; color: #fff; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; }
  .btn:hover { background: #059669; }
  .success { color: #34d399; font-weight: 600; margin-bottom: 16px; }
  .note { font-size: 12px; color: #737373; margin-top: 16px; }
</style></head><body>
<div class="card">
  <div class="success">✓ Autenticação realizada com sucesso!</div>
  <h2>Instagram @${igAccount?.username || 'conectado'}</h2>
  <p style="color: #a1a1a1; font-size: 14px;">Copie os valores abaixo para o arquivo <code style="font-size: 12px; background: #262626; padding: 2px 6px; border-radius: 4px;">server/.env</code></p>
  <div class="field">
    <label>INSTAGRAM_ACCESS_TOKEN</label>
    <code id="token">${accessToken}</code>
    <button class="btn" onclick="navigator.clipboard.writeText(document.getElementById('token').textContent).then(() => this.textContent='Copiado!')">Copiar Token</button>
  </div>
  <div class="field">
    <label>INSTAGRAM_USER_ID</label>
    <code id="userId">${igAccount?.id || ''}</code>
    <button class="btn" onclick="navigator.clipboard.writeText(document.getElementById('userId').textContent).then(() => this.textContent='Copiado!')">Copiar User ID</button>
  </div>
  <div class="note">Após configurar o .env, reinicie o servidor e recarregue o app.</div>
  <button class="btn" onclick="window.close()" style="background: #525252; margin-left: 8px;">Fechar</button>
</div>
</body></html>`)
  } catch (err) {
    res.status(500).send(`<p>Erro no servidor: ${err.message}</p>`)
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

instagramRouter.get('/user', async (req, res) => {
  const token = getToken()
  const userId = getIgUserId()

  if (!token || !userId) {
    return res.json({ error: 'Instagram não conectado' })
  }

  try {
    const userRes = await fetch(`${IG_GRAPH}/${userId}?fields=id,username,name,profile_picture_url&access_token=${token}`)
    const userData = await userRes.json()

    if (userData.error) {
      return res.json({ error: userData.error.message })
    }

    res.json({ data: userData })
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

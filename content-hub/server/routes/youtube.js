import { Router } from 'express'

export const youtubeRouter = Router()

const YT_API = 'https://www.googleapis.com/youtube/v3'

function getKey() {
  return process.env.YOUTUBE_API_KEY || ''
}

function getChannelId() {
  return process.env.YOUTUBE_CHANNEL_ID || ''
}

youtubeRouter.get('/channel-stats', async (req, res) => {
  const key = getKey()
  const channelId = getChannelId()

  if (!key || !channelId) {
    return res.json({ error: 'YouTube não configurado. Crie .env com YOUTUBE_API_KEY e YOUTUBE_CHANNEL_ID' })
  }

  try {
    const statsRes = await fetch(`${YT_API}/channels?part=statistics,snippet&id=${channelId}&key=${key}`)
    const statsData = await statsRes.json()

    if (statsData.error) {
      return res.json({ error: statsData.error.message })
    }

    if (!statsData.items?.length) {
      return res.json({ error: 'Canal não encontrado' })
    }

    const channel = statsData.items[0]
    res.json({
      data: {
        title: channel.snippet.title,
        thumbnail: channel.snippet.thumbnails.default.url,
        subscribers: parseInt(channel.statistics.subscriberCount),
        videoCount: parseInt(channel.statistics.videoCount),
        viewCount: parseInt(channel.statistics.viewCount),
      },
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

youtubeRouter.get('/videos', async (req, res) => {
  const key = getKey()
  const channelId = getChannelId()

  if (!key || !channelId) {
    return res.json({ error: 'YouTube não configurado' })
  }

  try {
    const searchRes = await fetch(`${YT_API}/search?part=snippet&channelId=${channelId}&order=date&maxResults=20&key=${key}`)
    const searchData = await searchRes.json()

    if (searchData.error) {
      return res.json({ error: searchData.error.message })
    }

    const videoIds = searchData.items.map(i => i.id.videoId).filter(Boolean).join(',')

    let stats = []
    if (videoIds) {
      const statsRes = await fetch(`${YT_API}/videos?part=statistics&id=${videoIds}&key=${key}`)
      const statsData = await statsRes.json()
      stats = statsData.items || []
    }

    const videos = searchData.items.map(item => {
      const stat = stats.find(s => s.id === item.id.videoId)
      return {
        id: item.id.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.medium.url,
        publishedAt: item.snippet.publishedAt,
        views: stat ? parseInt(stat.statistics.viewCount) : 0,
        likes: stat ? parseInt(stat.statistics.likeCount) : 0,
        comments: stat ? parseInt(stat.statistics.commentCount) : 0,
      }
    })

    res.json({ data: videos })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

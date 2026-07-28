import { useState } from 'react'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import { toast } from '../ui/Toast'
import { api } from '../../lib/api'
import { InstagramConnect, YoutubeConnect } from '../social/InstagramConnect'
import { BarChart3, RefreshCw, Loader2, Eye, Heart, UserPlus, Video, TrendingUp, Users, ThumbsUp, MessageCircle } from 'lucide-react'

export function ConnectedAccounts() {
  return (
    <Card>
      <h3 className="text-base font-semibold text-ink mb-4 flex items-center gap-2">
        <BarChart3 size={18} className="text-emerald" /> Contas Conectadas
      </h3>
      <div className="space-y-3">
        <InstagramConnect />
        <YoutubeConnect />
      </div>
    </Card>
  )
}

export function InstagramAnalytics() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function fetchData() {
    setLoading(true)
    setError(null)
    const res = await api.instagramInsights()
    setLoading(false)

    if (res.error) {
      setError(res.error)
    } else {
      setData(res.data)
    }
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-ink flex items-center gap-2">
          <Eye size={18} className="text-purple-500" /> Instagram Insights
        </h3>
        <Button variant="ghost" size="xs" onClick={fetchData} disabled={loading}
          icon={loading ? <Loader2 size={12} className="animate-spin" /> : <RefreshCw size={12} />}>
          Atualizar
        </Button>
      </div>

      {!data && !error && (
        <p className="text-sm text-mute">Clique em "Atualizar" para buscar dados do Instagram.</p>
      )}

      {error && <p className="text-sm text-danger">{error}</p>}

      {data && (
        <div className="grid grid-cols-2 gap-3">
          {data.map(metric => (
            <div key={metric.name} className="rounded-lg bg-elevated/50 p-3 border border-hairline">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-mute">{metric.name}</p>
              <p className="text-lg font-bold text-ink">{metric.values?.[0]?.value ?? 0}</p>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}

export function InstagramMediaFeed() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function fetchData() {
    setLoading(true)
    setError(null)
    const res = await api.instagramMedia()
    setLoading(false)

    if (res.error) {
      setError(res.error)
    } else {
      setData(res.data)
    }
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-ink flex items-center gap-2">
          <Video size={18} className="text-purple-500" /> Posts Recentes
        </h3>
        <Button variant="ghost" size="xs" onClick={fetchData} disabled={loading}
          icon={loading ? <Loader2 size={12} className="animate-spin" /> : <RefreshCw size={12} />}>
          Carregar
        </Button>
      </div>

      {!data && !error && <p className="text-sm text-mute">Clique em "Carregar" para ver seus posts.</p>}
      {error && <p className="text-sm text-danger">{error}</p>}

      {data && (
        <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar">
          {data.map(post => (
            <div key={post.id} className="flex items-start gap-3 p-3 rounded-lg border border-hairline bg-elevated/30">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface overflow-hidden">
                {post.media_type === 'VIDEO' ? (
                  <Video size={18} className="text-purple-500" />
                ) : (
                  <img src={post.media_url} alt="" className="w-full h-full object-cover" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-ink truncate">{post.caption || 'Sem legenda'}</p>
                <div className="flex items-center gap-3 mt-1 text-xs text-mute">
                  <span className="flex items-center gap-1"><Heart size={11} /> {post.like_count || 0}</span>
                  <span className="flex items-center gap-1"><MessageCircle size={11} /> {post.comments_count || 0}</span>
                  <span>{new Date(post.timestamp).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}

export function YoutubeAnalytics() {
  const [channelStats, setChannelStats] = useState(null)
  const [videos, setVideos] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function fetchData() {
    setLoading(true)
    setError(null)

    const [statsRes, videosRes] = await Promise.all([
      api.youtubeChannelStats(),
      api.youtubeVideos(),
    ])

    setLoading(false)

    if (statsRes.error) {
      setError(statsRes.error)
    } else {
      setChannelStats(statsRes.data)
      setVideos(videosRes.data)
    }
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-ink flex items-center gap-2">
          <TrendingUp size={18} className="text-red-500" /> YouTube Analytics
        </h3>
        <Button variant="ghost" size="xs" onClick={fetchData} disabled={loading}
          icon={loading ? <Loader2 size={12} className="animate-spin" /> : <RefreshCw size={12} />}>
          Atualizar
        </Button>
      </div>

      {!channelStats && !error && <p className="text-sm text-mute">Clique em "Atualizar" para buscar dados do YouTube.</p>}
      {error && <p className="text-sm text-danger">{error}</p>}

      {channelStats && (
        <>
          <div className="flex items-center gap-3 mb-4 p-3 rounded-lg bg-elevated/50 border border-hairline">
            <img src={channelStats.thumbnail} alt="" className="w-10 h-10 rounded-full" />
            <div>
              <p className="text-sm font-medium text-ink">{channelStats.title}</p>
              <p className="text-xs text-mute">{channelStats.subscribers} inscritos</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="text-center p-3 rounded-lg bg-elevated/30">
              <p className="text-lg font-bold text-ink">{channelStats.subscribers}</p>
              <p className="text-[10px] text-mute uppercase tracking-wider">Inscritos</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-elevated/30">
              <p className="text-lg font-bold text-ink">{channelStats.videoCount}</p>
              <p className="text-[10px] text-mute uppercase tracking-wider">Vídeos</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-elevated/30">
              <p className="text-lg font-bold text-ink">{channelStats.viewCount}</p>
              <p className="text-[10px] text-mute uppercase tracking-wider">Views</p>
            </div>
          </div>

          {videos && (
            <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar">
              <p className="text-xs font-semibold text-mute uppercase tracking-wider">Últimos vídeos</p>
              {videos.map(v => (
                <div key={v.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-elevated/50 transition-colors">
                  <img src={v.thumbnail} alt="" className="w-16 h-9 rounded object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-ink truncate">{v.title}</p>
                    <div className="flex items-center gap-2 text-xs text-mute">
                      <span className="flex items-center gap-1"><Eye size={10} /> {v.views}</span>
                      <span className="flex items-center gap-1"><ThumbsUp size={10} /> {v.likes}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </Card>
  )
}

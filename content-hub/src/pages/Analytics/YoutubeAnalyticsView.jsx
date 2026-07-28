import { useState } from 'react'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { toast } from '../../components/ui/Toast'
import { api } from '../../lib/api'
import { cn } from '../../lib/cn'
import { RefreshCw, Loader2, Eye, ThumbsUp, MessageCircle, Users, Video, TrendingUp, BarChart3 } from 'lucide-react'

function formatNumber(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M'
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K'
  return String(n)
}

function calcEngagement(video) {
  const total = (video.likes || 0) + (video.comments || 0)
  const views = video.views || 1
  return ((total / views) * 100).toFixed(1)
}

export function YoutubeAnalyticsView() {
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
      toast(statsRes.error, 'danger')
    } else {
      setChannelStats(statsRes.data)
      setVideos(videosRes.data)
    }
  }

  const recentVideos = (videos || []).slice(0, 5)
  const avgEngagement = recentVideos.length > 0
    ? (recentVideos.reduce((s, v) => s + Number(calcEngagement(v)), 0) / recentVideos.length).toFixed(1)
    : '0.0'

  return (
    <div className="space-y-4 max-w-3xl">
      <div className="flex items-center justify-between">
        <p className="text-sm text-mute">Visão geral do canal + últimos vídeos</p>
        <Button
          variant="primary" size="sm"
          onClick={fetchData} disabled={loading}
          icon={loading ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
        >
          {loading ? 'Carregando...' : 'Atualizar'}
        </Button>
      </div>

      {error && (
        <Card>
          <p className="text-sm text-danger py-4 text-center">{error}</p>
        </Card>
      )}

      {channelStats && (
        <>
          {/* Quick stats */}
          <div className="grid grid-cols-4 gap-3">
            <QuickStat label="Inscritos" value={formatNumber(channelStats.subscribers)} icon={Users} color="text-blue-500" />
            <QuickStat label="Vídeos" value={formatNumber(channelStats.videoCount)} icon={Video} color="text-red-500" />
            <QuickStat label="Views Total" value={formatNumber(channelStats.viewCount)} icon={Eye} color="text-emerald" />
            <QuickStat label="Engajamento" value={`${avgEngagement}%`} icon={BarChart3} color="text-amber-500" />
          </div>

          {/* Recent videos */}
          {recentVideos.length > 0 && (
            <Card>
              <h3 className="text-base font-semibold text-ink mb-4 flex items-center gap-2">
                <TrendingUp size={16} className="text-red-500" /> Últimos Vídeos
              </h3>
              <div className="space-y-3">
                {recentVideos.map(v => (
                  <div key={v.id} className="flex items-start gap-4 p-3 rounded-xl border border-hairline bg-elevated/30">
                    <img src={v.thumbnail} alt="" className="w-24 h-14 rounded-lg object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-ink truncate">{v.title}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="flex items-center gap-1 text-xs text-emerald"><Eye size={12} /> {formatNumber(v.views)}</span>
                        <span className="flex items-center gap-1 text-xs text-blue-500"><ThumbsUp size={12} /> {formatNumber(v.likes)}</span>
                        <span className="flex items-center gap-1 text-xs text-rose-500"><MessageCircle size={12} /> {v.comments}</span>
                        <span className="flex items-center gap-1 text-xs text-amber-500"><BarChart3 size={12} /> {calcEngagement(v)}%</span>
                        <span className="text-[11px] text-mute ml-auto">{new Date(v.publishedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </>
      )}

      {!channelStats && !error && (
        <Card>
          <div className="text-center py-8">
            <TrendingUp size={40} className="mx-auto mb-3 text-mute/30" />
            <p className="text-sm text-mute">Clique em "Atualizar" para ver dados do YouTube</p>
          </div>
        </Card>
      )}
    </div>
  )
}

function QuickStat({ label, value, icon: Icon, color }) {
  return (
    <div className="rounded-xl border border-hairline bg-surface p-4 text-center">
      <Icon size={18} className={cn('mx-auto mb-1.5', color)} />
      <p className="text-lg font-bold text-ink">{value}</p>
      <p className="text-[10px] text-mute uppercase tracking-wider">{label}</p>
    </div>
  )
}

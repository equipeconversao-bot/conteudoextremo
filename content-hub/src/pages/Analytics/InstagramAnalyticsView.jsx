import { useState } from 'react'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { toast } from '../../components/ui/Toast'
import { api } from '../../lib/api'
import { cn } from '../../lib/cn'
import { RefreshCw, Loader2, Heart, MessageCircle, Eye, TrendingUp, Users, BarChart3 } from 'lucide-react'

function formatNumber(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M'
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K'
  return String(n)
}

function calcEngagement(post) {
  const total = (post.like_count || 0) + (post.comments_count || 0)
  // approximate engagement using impressions if available
  const impressions = post.insights?.impressions || post.impressions || total * 10 || 1
  return ((total / impressions) * 100).toFixed(1)
}

export function InstagramAnalyticsView() {
  const [insights, setInsights] = useState(null)
  const [media, setMedia] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function fetchData() {
    setLoading(true)
    setError(null)

    const [insightsRes, mediaRes] = await Promise.all([
      api.instagramInsights(),
      api.instagramMedia(),
    ])

    setLoading(false)

    if (insightsRes.error) {
      setError(insightsRes.error)
      if (!insightsRes.error.includes('não conectado')) toast(insightsRes.error, 'danger')
    } else {
      setInsights(insightsRes.data)
      setMedia(mediaRes.data)
    }
  }

  const insightsMap = {};
  (insights || []).forEach(m => { insightsMap[m.name] = m.values?.[0]?.value ?? 0 })

  const recentPosts = (media || []).slice(0, 3)
  const avgEngagement = recentPosts.length > 0
    ? (recentPosts.reduce((s, p) => s + Number(calcEngagement(p)), 0) / recentPosts.length).toFixed(1)
    : '0.0'

  return (
    <div className="space-y-4 max-w-3xl">
      <div className="flex items-center justify-between">
        <p className="text-sm text-mute">Últimos 3 posts com engajamento</p>
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
          <div className="text-center py-6">
            <TrendingUp size={36} className="mx-auto mb-3 text-mute/30" />
            <p className="text-sm text-mute">{error}</p>
          </div>
        </Card>
      )}

      {insights && (
        <>
          {/* Quick stats */}
          <div className="grid grid-cols-4 gap-3">
            <QuickStat label="Seguidores" value={formatNumber(insightsMap.follower_count)} icon={Users} color="text-purple-500" />
            <QuickStat label="Impressões" value={formatNumber(insightsMap.impressions)} icon={Eye} color="text-blue-500" />
            <QuickStat label="Alcance" value={formatNumber(insightsMap.reach)} icon={BarChart3} color="text-emerald" />
            <QuickStat label="Engajamento" value={`${avgEngagement}%`} icon={Heart} color="text-rose-500" />
          </div>

          {/* Last 3 posts */}
          {recentPosts.length > 0 && (
            <Card>
              <h3 className="text-base font-semibold text-ink mb-4 flex items-center gap-2">
                <TrendingUp size={16} className="text-purple-500" /> Últimos 3 Posts
              </h3>
              <div className="space-y-3">
                {recentPosts.map(post => (
                  <div key={post.id} className="flex items-start gap-4 p-3 rounded-xl border border-hairline bg-elevated/30">
                    <div className="w-14 h-14 rounded-xl bg-elevated flex items-center justify-center overflow-hidden shrink-0">
                      {post.media_url ? (
                        <img src={post.media_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-xs text-mute">{post.media_type === 'VIDEO' ? '🎬' : '📷'}</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-ink truncate">{post.caption?.slice(0, 80) || 'Sem legenda'}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="flex items-center gap-1 text-xs text-rose-500"><Heart size={12} /> {formatNumber(post.like_count || 0)}</span>
                        <span className="flex items-center gap-1 text-xs text-blue-500"><MessageCircle size={12} /> {post.comments_count || 0}</span>
                        <span className="flex items-center gap-1 text-xs text-emerald"><BarChart3 size={12} /> {calcEngagement(post)}%</span>
                        <span className="text-[11px] text-mute ml-auto">{new Date(post.timestamp).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </>
      )}

      {!insights && !error && (
        <Card>
          <div className="text-center py-8">
            <TrendingUp size={40} className="mx-auto mb-3 text-mute/30" />
            <p className="text-sm text-mute">Clique em "Atualizar" para ver dados do Instagram</p>
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

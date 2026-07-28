import { useMemo, useState, useEffect, useCallback } from 'react'
import { useStore } from '../../store/useStore'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { cn } from '../../lib/cn'
import { api } from '../../lib/api'
import {
  Video, Film, Scissors, MessageSquareQuote, Calendar,
  Eye, Heart, UserPlus, Activity, AlertTriangle,
  TrendingUp, Clock, CheckCircle, BarChart3,
  Loader2, RefreshCw, ThumbsUp, MessageCircle,
} from 'lucide-react'

function formatNumber(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M'
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K'
  return String(n)
}

function daysAgo(dateStr) {
  if (!dateStr) return 999
  const then = new Date(dateStr)
  const now = new Date()
  return Math.floor((now - then) / (1000 * 60 * 60 * 24))
}

export function DashboardPage() {
  const state = useStore()

  const stats = useMemo(() => {
    const vl = state.videosLongos || []
    const vc = state.videosCurtos || []
    const co = state.cortes || []
    const fr = state.frases || []
    const cal = state.calendario || []

    // Content counts
    const totalContent = vl.length + vc.length + co.length
    const published = vl.filter(i => i.publicado).length + vc.filter(i => i.publicado).length
    const approved = vl.filter(i => i.aprovado && !i.publicado).length + vc.filter(i => i.aprovado && !i.publicado).length
    const inProgress = totalContent - published - approved - (vl.filter(i => !i.gravado && !i.editado).length + vc.filter(i => !i.editado).length + co.filter(i => !i.editado).length)

    // Pending items (approved but no link)
    const pendingItems = [
      ...vl.filter(i => i.aprovado && !i.linkFinalizado).map(i => ({ ...i, type: 'Vídeo Longo', title: i.tema })),
      ...vc.filter(i => i.aprovado && !i.linkFinalizado).map(i => ({ ...i, type: 'Vídeo Curto', title: i.titulo })),
      ...co.filter(i => i.aprovado && !i.linkFinalizado).map(i => ({ ...i, type: 'Corte', title: i.titulo })),
    ]

    // Stalled items (>7 days without stage change)
    const stalledItems = [
      ...vl.filter(i => !i.publicado && daysAgo(i.updatedAt) > 7).map(i => ({ ...i, type: 'Vídeo Longo', title: i.tema, days: daysAgo(i.updatedAt) })),
      ...vc.filter(i => !i.publicado && daysAgo(i.updatedAt) > 7).map(i => ({ ...i, type: 'Vídeo Curto', title: i.titulo, days: daysAgo(i.updatedAt) })),
      ...co.filter(i => !i.aprovado && daysAgo(i.updatedAt) > 7).map(i => ({ ...i, type: 'Corte', title: i.titulo, days: daysAgo(i.updatedAt) })),
    ].sort((a, b) => b.days - a.days)

    // Frases performance
    const topFrases = [...fr].sort((a, b) => (b.visualizacoes || 0) - (a.visualizacoes || 0)).slice(0, 5)
    const totalViews = fr.reduce((s, i) => s + (i.visualizacoes || 0), 0)
    const totalInteractions = fr.reduce((s, i) => s + (i.interacoes || 0), 0)
    const totalFollowers = fr.reduce((s, i) => s + (i.novosSeguidores || 0), 0)

    // Calendar stats
    const upcoming = cal.filter(i => i.agenda >= new Date().toISOString().split('T')[0] && i.status !== 'Publicado').length
    const calPublished = cal.filter(i => i.status === 'Publicado').length

    // Partners/brands
    const partners = {}
    vl.forEach(i => {
      if (i.ondeQuem) {
        if (!partners[i.ondeQuem]) partners[i.ondeQuem] = { name: i.ondeQuem, total: 0, published: 0 }
        partners[i.ondeQuem].total++
        if (i.publicado) partners[i.ondeQuem].published++
      }
    })

    return {
      totalContent, published, approved, inProgress,
      pendingItems, stalledItems,
      topFrases, totalViews, totalInteractions, totalFollowers,
      upcoming, calPublished,
      partners: Object.values(partners).sort((a, b) => b.total - a.total),
      vlCount: vl.length, vcCount: vc.length, coCount: co.length, frCount: fr.length,
    }
  }, [state])

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-heading-lg text-ink">Dashboard</h1>
        <p className="text-sm text-mute mt-1">Visão geral de todo seu conteúdo</p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={Video} label="Vídeos Longos" value={stats.vlCount} color="blue" />
        <StatCard icon={Film} label="Vídeos Curtos" value={stats.vcCount} color="purple" />
        <StatCard icon={Scissors} label="Cortes" value={stats.coCount} color="amber" />
        <StatCard icon={MessageSquareQuote} label="Frases" value={stats.frCount} color="emerald" />
      </div>

      {/* Pipeline + Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <Card className="lg:col-span-2">
          <h3 className="text-base font-semibold text-ink mb-4 flex items-center gap-2">
            <BarChart3 size={18} className="text-emerald" /> Pipeline de Conteúdo
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <PipelineStat label="Em progresso" value={stats.inProgress} color="bg-blue-400" />
            <PipelineStat label="Aprovados" value={stats.approved} color="bg-amber-400" />
            <PipelineStat label="Publicados" value={stats.published} color="bg-emerald" />
          </div>
          {/* Progress bar */}
          <div className="mt-4 flex h-2 rounded-full overflow-hidden bg-elevated">
            {stats.totalContent > 0 && (
              <>
                <div className="bg-blue-400 transition-all" style={{ width: `${(stats.inProgress / stats.totalContent) * 100}%` }} />
                <div className="bg-amber-400 transition-all" style={{ width: `${(stats.approved / stats.totalContent) * 100}%` }} />
                <div className="bg-emerald transition-all" style={{ width: `${(stats.published / stats.totalContent) * 100}%` }} />
              </>
            )}
          </div>
        </Card>

        <Card>
          <h3 className="text-base font-semibold text-ink mb-4 flex items-center gap-2">
            <Calendar size={18} className="text-emerald" /> Calendário
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-mute">Posts agendados</span>
              <span className="text-lg font-bold text-ink">{stats.upcoming}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-mute">Publicados</span>
              <span className="text-lg font-bold text-emerald">{stats.calPublished}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Alerts & Performance side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Pending Items */}
        <Card>
          <h3 className="text-base font-semibold text-ink mb-4 flex items-center gap-2">
            <AlertTriangle size={18} className="text-warning" /> Pendências ({stats.pendingItems.length})
          </h3>
          {stats.pendingItems.length === 0 ? (
            <p className="text-sm text-mute flex items-center gap-2"><CheckCircle size={14} className="text-emerald" /> Nenhuma pendência!</p>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
              {stats.pendingItems.map(item => (
                <div key={item.id} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-amber-50/50 dark:bg-amber-950/10 border border-amber-100 dark:border-amber-900/30">
                  <Badge tone="warning" className="shrink-0 text-[9px]">{item.type}</Badge>
                  <span className="text-sm text-ink truncate flex-1">{item.title}</span>
                  <span className="text-[10px] text-mute shrink-0">Sem link</span>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Stalled Items */}
        <Card>
          <h3 className="text-base font-semibold text-ink mb-4 flex items-center gap-2">
            <Clock size={18} className="text-danger" /> Travados ({stats.stalledItems.length})
          </h3>
          {stats.stalledItems.length === 0 ? (
            <p className="text-sm text-mute flex items-center gap-2"><CheckCircle size={14} className="text-emerald" /> Tudo em dia!</p>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
              {stats.stalledItems.map(item => (
                <div key={item.id} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-red-50/50 dark:bg-red-950/10 border border-red-100 dark:border-red-900/30">
                  <Badge tone="danger" className="shrink-0 text-[9px]">{item.days}d</Badge>
                  <span className="text-sm text-ink truncate flex-1">{item.title}</span>
                  <span className="text-[10px] text-mute shrink-0">{item.type}</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Top Frases + Partners */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top Frases */}
        <Card>
          <h3 className="text-base font-semibold text-ink mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-emerald" /> Top Frases
          </h3>
          <div className="space-y-3">
            {stats.topFrases.map((frase, idx) => (
              <div key={frase.id} className="flex items-start gap-3">
                <span className={cn(
                  'flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-bold',
                  idx === 0 ? 'bg-emerald/10 text-emerald-deep' : 'bg-elevated text-mute',
                )}>
                  {idx + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-ink truncate">"{frase.frase}"</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[11px] text-mute flex items-center gap-1"><Eye size={10} /> {formatNumber(frase.visualizacoes)}</span>
                    <span className="text-[11px] text-mute flex items-center gap-1"><Heart size={10} /> {formatNumber(frase.interacoes)}</span>
                    <span className="text-[11px] text-mute flex items-center gap-1"><UserPlus size={10} /> {formatNumber(frase.novosSeguidores)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-hairline grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-lg font-bold text-ink">{formatNumber(stats.totalViews)}</p>
              <p className="text-[10px] text-mute uppercase tracking-wider">Views</p>
            </div>
            <div>
              <p className="text-lg font-bold text-ink">{formatNumber(stats.totalInteractions)}</p>
              <p className="text-[10px] text-mute uppercase tracking-wider">Interações</p>
            </div>
            <div>
              <p className="text-lg font-bold text-ink">{formatNumber(stats.totalFollowers)}</p>
              <p className="text-[10px] text-mute uppercase tracking-wider">Seguidores</p>
            </div>
          </div>
        </Card>

        {/* Partners */}
        <Card>
          <h3 className="text-base font-semibold text-ink mb-4 flex items-center gap-2">
            <Activity size={18} className="text-emerald" /> Parceiros / Marcas
          </h3>
          {stats.partners.length === 0 ? (
            <p className="text-sm text-mute">Nenhum parceiro registrado.</p>
          ) : (
            <div className="space-y-3">
              {stats.partners.map(p => (
                <div key={p.name} className="flex items-center gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-elevated text-sm font-bold text-mute">
                    {p.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-ink">{p.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[11px] text-mute">{p.total} vídeos</span>
                      <span className="text-[11px] text-emerald">{p.published} publicados</span>
                    </div>
                  </div>
                  <div className="w-16 h-1.5 rounded-full bg-elevated overflow-hidden">
                    <div
                      className="h-full rounded-full bg-emerald transition-all"
                      style={{ width: `${p.total > 0 ? (p.published / p.total) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
      {/* Social Media */}
      <SocialSection />
    </div>
  )
}

function SocialSection() {
  const [igData, setIgData] = useState(null)
  const [ytData, setYtData] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchAll = useCallback(async () => {
    setLoading(true)
    const [igInsights, igMedia, ytStats] = await Promise.all([
      api.instagramInsights().catch(() => ({ error: true })),
      api.instagramMedia().catch(() => ({ error: true })),
      api.youtubeChannelStats().catch(() => ({ error: true })),
    ])
    if (!igInsights.error) {
      const map = {}
      ;(igInsights.data || []).forEach(m => { map[m.name] = m.values?.[0]?.value ?? 0 })
      setIgData({
        followers: map.follower_count || 0,
        impressions: map.impressions || 0,
        reach: map.reach || 0,
        recentPosts: (igMedia.data || []).slice(0, 3).map(p => ({
          likes: p.like_count || 0, comments: p.comments_count || 0, date: p.timestamp, caption: p.caption,
        })),
      })
    }
    if (!ytStats.error) {
      setYtData({
        subscribers: ytStats.data.subscribers,
        videos: ytStats.data.videoCount,
        views: ytStats.data.viewCount,
      })
    }
    setLoading(false)
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  const hasData = igData || ytData

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-ink flex items-center gap-2">
          <TrendingUp size={18} className="text-emerald" /> Redes Sociais
        </h3>
        <Button variant="ghost" size="xs" onClick={fetchAll} disabled={loading}
          icon={loading ? <Loader2 size={12} className="animate-spin" /> : <RefreshCw size={12} />}>
          Atualizar
        </Button>
      </div>

      {!hasData && !loading && (
        <p className="text-sm text-mute">Nenhuma rede conectada. Vá em Analytics para configurar.</p>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Instagram */}
        <Card className={!igData ? 'opacity-50' : ''}>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white">
              <Heart size={16} />
            </div>
            <h4 className="text-sm font-semibold text-ink">Instagram</h4>
            {!igData && <Badge tone="neutral">Não conectado</Badge>}
          </div>
          {igData && (
            <>
              <div className="grid grid-cols-3 gap-2 mb-4">
                <SocialStat label="Seguidores" value={formatNumber(igData.followers)} />
                <SocialStat label="Impressões" value={formatNumber(igData.impressions)} />
                <SocialStat label="Alcance" value={formatNumber(igData.reach)} />
              </div>
              {igData.recentPosts.length > 0 && (
                <div className="border-t border-hairline pt-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-mute mb-2">Últimos 3 posts</p>
                  <div className="space-y-2">
                    {igData.recentPosts.map((p, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs">
                        <span className="flex items-center gap-1 text-rose-500"><Heart size={10} /> {p.likes}</span>
                        <span className="flex items-center gap-1 text-blue-500"><MessageCircle size={10} /> {p.comments}</span>
                        <span className="text-mute ml-auto">{new Date(p.date).toLocaleDateString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </Card>

        {/* YouTube */}
        <Card className={!ytData ? 'opacity-50' : ''}>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-500 text-white">
              <Video size={16} />
            </div>
            <h4 className="text-sm font-semibold text-ink">YouTube</h4>
            {!ytData && <Badge tone="neutral">Não conectado</Badge>}
          </div>
          {ytData && (
            <div className="grid grid-cols-3 gap-2">
              <SocialStat label="Inscritos" value={formatNumber(ytData.subscribers)} />
              <SocialStat label="Vídeos" value={formatNumber(ytData.videos)} />
              <SocialStat label="Views" value={formatNumber(ytData.views)} />
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

function SocialStat({ label, value }) {
  return (
    <div className="text-center p-2 rounded-lg bg-elevated/50 border border-hairline">
      <p className="text-sm font-bold text-ink">{value}</p>
      <p className="text-[9px] text-mute uppercase tracking-wider">{label}</p>
    </div>
  )
}

function StatCard({ icon: Icon, label, value, color }) {
  const colors = {
    blue: 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400',
    purple: 'bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400',
    amber: 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400',
    emerald: 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400',
  }
  return (
    <div className="rounded-xl border border-hairline bg-surface p-4 flex items-center gap-4">
      <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', colors[color])}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-mute">{label}</p>
        <p className="text-heading-md text-ink">{value}</p>
      </div>
    </div>
  )
}

function PipelineStat({ label, value, color }) {
  return (
    <div className="text-center">
      <div className={cn('inline-flex h-2 w-2 rounded-full mb-1', color)} />
      <p className="text-2xl font-bold text-ink">{value}</p>
      <p className="text-[11px] text-mute">{label}</p>
    </div>
  )
}

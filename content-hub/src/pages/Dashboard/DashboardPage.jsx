import { useMemo, useState, useEffect } from 'react'
import { useStore } from '../../store/useStore'
import { useSpotlight } from '../../lib/useSpotlight'
import { Button } from '../../components/ui/Button'
import {
  Video, Film, LayoutGrid, Sparkles, MessageSquareQuote, Calendar,
  Clock, CheckCircle2, AlertCircle, ArrowRight, ExternalLink,
  Users, Layers, FileVideo, Filter, Search, ChevronRight, Folder, Eye
} from 'lucide-react'

const CRIATIVOS_STORAGE_KEY = 'content_hub_criativos_data'

export function DashboardPage({ onNavigate }) {
  // Load Criativos from storage
  const [criativos, setCriativos] = useState(() => {
    try {
      const saved = localStorage.getItem(CRIATIVOS_STORAGE_KEY)
      if (saved) return JSON.parse(saved)
    } catch (e) {
      console.error('Error loading criativos for dashboard:', e)
    }
    return []
  })

  useEffect(() => {
    try {
      const saved = localStorage.getItem(CRIATIVOS_STORAGE_KEY)
      if (saved) setCriativos(JSON.parse(saved))
    } catch (e) {}
  }, [])

  const state = useStore()

  // Filters state
  const [activeSectorTab, setActiveSectorTab] = useState('todos') // 'todos' | 'criativos' | 'longos' | 'curtos' | 'cortes'
  const [editorFilter, setEditorFilter] = useState('Todos')
  const [searchTerm, setSearchTerm] = useState('')

  // Spotlight hooks for cards
  const kpiSpotlight1 = useSpotlight()
  const kpiSpotlight2 = useSpotlight()
  const kpiSpotlight3 = useSpotlight()
  const kpiSpotlight4 = useSpotlight()

  // Calculate stats & pending items across ALL sectors
  const dashboardData = useMemo(() => {
    const vl = state?.videosLongos || []
    const vc = state?.videosCurtos || []
    const co = state?.cortes || []
    const fr = state?.frases || []
    const cal = state?.calendario || []

    // Sector 1: Criativos (não editados/finalizados)
    const criativosAFazer = criativos.filter(c => c.status !== 'Finalizado')

    // Sector 2: Vídeos Longos (não editados/gravados)
    const vlAFazer = vl.filter(i => !i.editado || !i.publicado).map(i => ({
      id: `vl-${i.id}`,
      sector: 'Vídeos Longos',
      sectorKey: 'longos',
      icon: Video,
      title: i.tema || i.titulo || 'Vídeo Longo sem título',
      status: !i.gravado ? 'Não Gravado' : !i.editado ? 'Em Edição' : 'Fila',
      editor: i.editor || i.ondeQuem || '—',
      gravacao: i.ondeQuem || 'YouTube',
      linkDrive: i.linkPasta || i.linkFinalizado || '',
      origemTab: 'videos-longos',
    }))

    // Sector 3: Vídeos Curtos / Reels / TikTok (não editados)
    const vcAFazer = vc.filter(i => !i.editado || !i.publicado).map(i => ({
      id: `vc-${i.id}`,
      sector: 'Vídeos Curtos',
      sectorKey: 'curtos',
      icon: Film,
      title: i.titulo || 'Vídeo Curto sem título',
      status: !i.editado ? 'Em Edição' : 'Fila',
      editor: i.editor || '—',
      gravacao: i.plataforma || 'Reels / Shorts',
      linkDrive: i.linkFinalizado || '',
      origemTab: 'videos-curtos',
    }))

    // Sector 4: Carrosséis / Cortes (não editados)
    const coAFazer = co.filter(i => !i.editado || !i.aprovado).map(i => ({
      id: `co-${i.id}`,
      sector: 'Carrossel / Cortes',
      sectorKey: 'cortes',
      icon: LayoutGrid,
      title: i.titulo || 'Carrossel sem título',
      status: !i.editado ? 'Em Edição' : 'Fila',
      editor: i.editor || '—',
      gravacao: 'Instagram',
      linkDrive: i.linkFinalizado || '',
      origemTab: 'cortes',
    }))

    // Formatted Criativos list for table
    const criativosFormatted = criativosAFazer.map(c => ({
      id: c.id,
      sector: 'Criativos de Tráfego',
      sectorKey: 'criativos',
      icon: Sparkles,
      title: c.nomeArquivo,
      status: c.status || 'Fila',
      editor: c.editor || '—',
      gravacao: c.gravacao || 'Tráfego',
      tag: c.tag,
      linkDrive: c.linkPastaBase || '',
      origemTab: 'criativos',
    }))

    // Combined Pending List
    const allPendingList = [
      ...criativosFormatted,
      ...vlAFazer,
      ...vcAFazer,
      ...coAFazer,
    ]

    // Total counts
    const totalPendingCount = allPendingList.length
    const criativosPendingCount = criativosAFazer.length
    const vlPendingCount = vlAFazer.length
    const vcPendingCount = vcAFazer.length
    const coPendingCount = coAFazer.length

    // Completion percentage calculation
    const totalItemsCount = criativos.length + vl.length + vc.length + co.length
    const totalFinishedCount = (criativos.length - criativosPendingCount) +
      vl.filter(i => i.editado && i.publicado).length +
      vc.filter(i => i.editado && i.publicado).length +
      co.filter(i => i.editado && i.aprovado).length

    const completionRate = totalItemsCount > 0 ? Math.round((totalFinishedCount / totalItemsCount) * 100) : 0

    // Editors workload map
    const editorsWorkload = {}
    allPendingList.forEach(item => {
      const ed = item.editor && item.editor !== '—' ? item.editor : 'Sem Editor'
      if (!editorsWorkload[ed]) editorsWorkload[ed] = 0
      editorsWorkload[ed]++
    })

    // Calendar upcoming items
    const todayStr = new Date().toISOString().split('T')[0]
    const upcomingCalendar = cal
      .filter(i => i.agenda >= todayStr && i.status !== 'Publicado')
      .slice(0, 4)

    return {
      allPendingList,
      totalPendingCount,
      criativosPendingCount,
      vlPendingCount,
      vcPendingCount,
      coPendingCount,
      completionRate,
      editorsWorkload: Object.entries(editorsWorkload).map(([name, count]) => ({ name, count })),
      upcomingCalendar,
    }
  }, [criativos, state])

  // Filtered List
  const filteredList = useMemo(() => {
    return dashboardData.allPendingList.filter(item => {
      const matchesTab = activeSectorTab === 'todos' || item.sectorKey === activeSectorTab
      const matchesEditor = editorFilter === 'Todos' ||
        (editorFilter === 'Sem Editor' ? (item.editor === '—' || !item.editor) : item.editor === editorFilter)

      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.gravacao.toLowerCase().includes(searchTerm.toLowerCase())

      return matchesTab && matchesEditor && matchesSearch
    })
  }, [dashboardData.allPendingList, activeSectorTab, editorFilter, searchTerm])

  return (
    <div className="space-y-6">
      
      {/* Top Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-heading-lg text-ink font-bold">Dashboard Geral</h1>
          <p className="text-sm text-mute mt-1">
            Resumo dos vídeos e conteúdos a fazer em cada setor da empresa
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onNavigate && onNavigate('criativos')}
            icon={<Sparkles size={16} />}
          >
            Aba Criativos
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => onNavigate && onNavigate('criativos')}
            icon={<ArrowRight size={16} />}
          >
            Importar Planilha
          </Button>
        </div>
      </div>

      {/* Top Global KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Fila Total a Fazer */}
        <div className="premium-card p-5" {...kpiSpotlight1}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-faint uppercase tracking-wider">Conteúdos a Fazer (Total)</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
              <Clock size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-ink">{dashboardData.totalPendingCount}</span>
            <span className="text-xs font-semibold text-amber-500">pendentes de edição</span>
          </div>
        </div>

        {/* KPI 2: Criativos a Fazer */}
        <div className="premium-card p-5" {...kpiSpotlight2}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-faint uppercase tracking-wider">Criativos a Editar</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald/10 text-emerald">
              <Sparkles size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-emerald-deep dark:text-emerald-400">{dashboardData.criativosPendingCount}</span>
            <span className="text-xs text-mute">na fila de tráfego</span>
          </div>
        </div>

        {/* KPI 3: Vídeos Longos a Editar */}
        <div className="premium-card p-5" {...kpiSpotlight3}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-faint uppercase tracking-wider">Vídeos Longos a Editar</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
              <Video size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-ink">{dashboardData.vlPendingCount}</span>
            <span className="text-xs text-mute">vídeos YouTube</span>
          </div>
        </div>

        {/* KPI 4: Taxa de Conclusão */}
        <div className="premium-card p-5" {...kpiSpotlight4}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-faint uppercase tracking-wider">Concluídos (% Geral)</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald/10 text-emerald">
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-emerald-deep dark:text-emerald-400">{dashboardData.completionRate}%</span>
            <span className="text-xs text-mute">acervo editado</span>
          </div>
        </div>

      </div>

      {/* Main Section: Content To-Do List by Sector */}
      <div className="space-y-4">
        
        {/* Controls Bar & Sector Tabs */}
        <div className="premium-card p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          {/* Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 bg-elevated/60 p-1 rounded-xl border border-hairline">
            <button
              onClick={() => setActiveSectorTab('todos')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeSectorTab === 'todos' ? 'bg-surface text-ink shadow-xs' : 'text-mute hover:text-ink'
              }`}
            >
              Todos a Fazer ({dashboardData.totalPendingCount})
            </button>
            <button
              onClick={() => setActiveSectorTab('criativos')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeSectorTab === 'criativos' ? 'bg-surface text-emerald-deep dark:text-emerald-400 shadow-xs' : 'text-mute hover:text-ink'
              }`}
            >
              Criativos ({dashboardData.criativosPendingCount})
            </button>
            <button
              onClick={() => setActiveSectorTab('longos')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeSectorTab === 'longos' ? 'bg-surface text-blue-500 shadow-xs' : 'text-mute hover:text-ink'
              }`}
            >
              Longos ({dashboardData.vlPendingCount})
            </button>
            <button
              onClick={() => setActiveSectorTab('curtos')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeSectorTab === 'curtos' ? 'bg-surface text-purple-500 shadow-xs' : 'text-mute hover:text-ink'
              }`}
            >
              Reels/Curtos ({dashboardData.vcPendingCount})
            </button>
            <button
              onClick={() => setActiveSectorTab('cortes')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeSectorTab === 'cortes' ? 'bg-surface text-amber-500 shadow-xs' : 'text-mute hover:text-ink'
              }`}
            >
              Carrossel ({dashboardData.coPendingCount})
            </button>
          </div>

          {/* Search & Editor Filter */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 sm:w-48">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-faint" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar conteúdo..."
                className="w-full rounded-xl border border-hairline bg-surface pl-9 pr-3 py-1.5 text-xs text-ink placeholder:text-faint focus:border-emerald focus:outline-none"
              />
            </div>

            <select
              value={editorFilter}
              onChange={(e) => setEditorFilter(e.target.value)}
              className="rounded-xl border border-hairline bg-surface px-3 py-1.5 text-xs text-ink font-medium focus:border-emerald focus:outline-none"
            >
              <option value="Todos">Todos Editores</option>
              <option value="Sem Editor">Sem Editor</option>
              {dashboardData.editorsWorkload.map(ed => (
                <option key={ed.name} value={ed.name}>{ed.name} ({ed.count})</option>
              ))}
            </select>
          </div>

        </div>

        {/* Content Table */}
        <div className="premium-card overflow-hidden">
          <div className="p-4 border-b border-hairline flex items-center justify-between">
            <h2 className="text-xs font-bold text-ink uppercase tracking-wider flex items-center gap-2">
              <Layers size={16} className="text-emerald" /> Fila de Conteúdos a Fazer ({filteredList.length})
            </h2>
            <span className="text-[11px] text-mute">Ordenado por prioridade de produção</span>
          </div>

          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-xs">
              <thead className="bg-elevated/70 border-b border-hairline text-faint font-semibold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-4 py-3 min-w-[140px]">Setor</th>
                  <th className="px-4 py-3 min-w-[280px]">Título / Nome do Conteúdo</th>
                  <th className="px-4 py-3 min-w-[120px]">Status</th>
                  <th className="px-4 py-3 min-w-[120px]">Editor</th>
                  <th className="px-4 py-3 min-w-[130px]">Gravação / Origem</th>
                  <th className="px-4 py-3 text-right min-w-[120px]">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline text-ink">
                {filteredList.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-mute">
                      <CheckCircle2 size={24} className="mx-auto text-emerald mb-2" />
                      Nenhum conteúdo a fazer encontrado nesta categoria!
                    </td>
                  </tr>
                ) : (
                  filteredList.map(item => {
                    const IconComponent = item.icon
                    return (
                      <tr key={item.id} className="table-row-hover">
                        
                        {/* Sector Badge */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-surface border border-hairline text-ink">
                            <IconComponent size={13} className="text-emerald shrink-0" />
                            {item.sector}
                          </span>
                        </td>

                        {/* Title */}
                        <td className="px-4 py-3 font-medium text-ink">
                          {item.title}
                          {item.tag && (
                            <span className="ml-2 px-1.5 py-0.5 rounded bg-emerald/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                              {item.tag}
                            </span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                            item.status === 'Em Edição'
                              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                              : item.status === 'Não Gravado'
                              ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                              : 'bg-surface text-mute border border-hairline'
                          }`}>
                            {item.status}
                          </span>
                        </td>

                        {/* Editor */}
                        <td className="px-4 py-3 font-semibold text-mute whitespace-nowrap">
                          {item.editor}
                        </td>

                        {/* Gravação / Origem */}
                        <td className="px-4 py-3 font-mono text-[11px] text-mute whitespace-nowrap">
                          {item.gravacao}
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            {item.linkDrive ? (
                              <a
                                href={item.linkDrive}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 text-[11px] font-medium transition-colors"
                              >
                                <Folder size={12} /> Drive <ExternalLink size={10} />
                              </a>
                            ) : null}
                            <button
                              onClick={() => onNavigate && onNavigate(item.origemTab)}
                              className="p-1.5 text-mute hover:bg-ink/5 hover:text-ink rounded-lg transition-colors"
                              title="Abrir no Setor"
                            >
                              <ChevronRight size={16} />
                            </button>
                          </div>
                        </td>

                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Bottom Grid: Editors Workload & Upcoming Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Editors Workload Card */}
        <div className="premium-card p-5 lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-hairline pb-3">
            <h3 className="text-xs font-bold text-ink uppercase tracking-wider flex items-center gap-2">
              <Users size={16} className="text-emerald" /> Carga de Trabalho por Editor (Pendente)
            </h3>
            <span className="text-[11px] text-mute">{dashboardData.editorsWorkload.length} responsáveis</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {dashboardData.editorsWorkload.map(ed => (
              <div key={ed.name} className="p-3 rounded-xl bg-elevated/50 border border-hairline flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-ink">{ed.name}</p>
                  <p className="text-[11px] text-mute mt-0.5">conteúdos a fazer</p>
                </div>
                <span className="text-lg font-bold text-emerald-deep dark:text-emerald-400 bg-emerald/10 px-2.5 py-0.5 rounded-lg">
                  {ed.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Calendar Card */}
        <div className="premium-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-hairline pb-3">
            <h3 className="text-xs font-bold text-ink uppercase tracking-wider flex items-center gap-2">
              <Calendar size={16} className="text-emerald" /> Próximos Lançamentos
            </h3>
            <button
              onClick={() => onNavigate && onNavigate('calendario')}
              className="text-xs text-emerald font-semibold hover:underline"
            >
              Ver tudo
            </button>
          </div>

          <div className="space-y-2.5">
            {dashboardData.upcomingCalendar.length === 0 ? (
              <p className="text-xs text-mute text-center py-4">Nenhum lançamento agendado para os próximos dias.</p>
            ) : (
              dashboardData.upcomingCalendar.map(calItem => (
                <div key={calItem.id} className="p-2.5 rounded-xl bg-elevated/40 border border-hairline flex items-center justify-between">
                  <div className="overflow-hidden pr-2">
                    <p className="text-xs font-medium text-ink truncate">{calItem.titulo}</p>
                    <p className="text-[10px] font-mono text-mute">{calItem.agenda}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-500 shrink-0">
                    {calItem.canal || 'Geral'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  )
}

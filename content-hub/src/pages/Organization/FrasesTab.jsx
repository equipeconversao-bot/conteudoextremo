import { useState, useMemo } from 'react'
import { useCollection } from '../../store/useStore'
import { Button } from '../../components/ui/Button'
import { SearchBar } from '../../components/ui/SearchBar'
import { EmptyState } from '../../components/ui/EmptyState'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { Modal } from '../../components/ui/Modal'
import { Field, Input } from '../../components/ui/Input'
import { toast } from '../../components/ui/Toast'
import { exportToCSV } from '../../store/storage'
import { cn } from '../../lib/cn'
import { AiButton } from '../../components/ai/AiPanel'
import { ClaudeButton } from '../../components/claude/ClaudePanel'
import { Plus, Pencil, Trash2, MessageSquareQuote, Download, TrendingUp, Eye, Heart, UserPlus, Activity, Upload, ChevronDown, CheckCircle, XCircle } from 'lucide-react'

function formatNumber(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M'
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K'
  return String(n)
}

const emptyItem = {
  frase: '', visualizacoes: 0, interacoes: 0, atividadePerfil: 0, novosSeguidores: 0, publicado: false,
}

export function FrasesTab() {
  const { items, addItem, updateItem, deleteItem } = useCollection('frases')
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('visualizacoes')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [importOpen, setImportOpen] = useState(false)
  const [importText, setImportText] = useState('')
  const [importing, setImporting] = useState(false)
  const [pubFilter, setPubFilter] = useState('todas')

  const filtered = useMemo(() => {
    let result = [...items]
    if (pubFilter === 'publicadas') result = result.filter(i => i.publicado)
    if (pubFilter === 'rascunhos') result = result.filter(i => !i.publicado)
    if (search) {
      const s = search.toLowerCase()
      result = result.filter(item => item.frase?.toLowerCase().includes(s))
    }
    result.sort((a, b) => (b[sortBy] || 0) - (a[sortBy] || 0))
    return result
  }, [items, search, sortBy, pubFilter])

  const maxViz = useMemo(() => Math.max(...items.map(i => i.visualizacoes || 0), 1), [items])

  function openAdd() { setEditing(null); setModalOpen(true) }
  function openEdit(item) { setEditing(item); setModalOpen(true) }

  function handleSave(data) {
    if (editing) {
      updateItem(editing.id, { ...data, visualizacoes: Number(data.visualizacoes), interacoes: Number(data.interacoes), atividadePerfil: Number(data.atividadePerfil), novosSeguidores: Number(data.novosSeguidores) })
      toast('Frase atualizada')
    } else {
      addItem({ ...data, visualizacoes: Number(data.visualizacoes), interacoes: Number(data.interacoes), atividadePerfil: Number(data.atividadePerfil), novosSeguidores: Number(data.novosSeguidores) })
      toast('Frase adicionada')
    }
    setModalOpen(false)
  }

  function handleDelete() {
    if (deleteTarget) {
      deleteItem(deleteTarget.id)
      toast('Frase excluída')
      setDeleteTarget(null)
    }
  }

  function handleImportFromSheet() {
    if (!importText.trim()) return
    setImporting(true)
    const lines = importText.trim().split('\n').filter(Boolean)
    let count = 0
    for (const line of lines) {
      const parts = line.split('\t').map(s => s.trim())
      if (parts.length < 1 || !parts[0]) continue
      const item = { frase: parts[0], visualizacoes: 0, interacoes: 0, atividadePerfil: 0, novosSeguidores: 0 }
      const clean = v => Number(String(v).replace(/[^0-9]/g, '')) || 0
      if (parts[1]) item.visualizacoes = clean(parts[1])
      if (parts[2]) item.interacoes = clean(parts[2])
      if (parts[3]) item.atividadePerfil = clean(parts[3])
      if (parts[4]) item.novosSeguidores = clean(parts[4])
      addItem(item)
      count++
    }
    setImporting(false)
    toast(`${count} frases importadas!`)
    setImportText('')
    setImportOpen(false)
  }

  // Summary stats
  const totalViews = items.reduce((sum, i) => sum + (i.visualizacoes || 0), 0)
  const totalInteractions = items.reduce((sum, i) => sum + (i.interacoes || 0), 0)
  const totalFollowers = items.reduce((sum, i) => sum + (i.novosSeguidores || 0), 0)

  return (
    <div>
      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="rounded-xl border border-hairline bg-surface p-4 flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/30 text-info">
            <Eye size={20} />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-mute">Total Visualizações</p>
            <p className="text-heading-sm text-ink">{formatNumber(totalViews)}</p>
          </div>
        </div>
        <div className="rounded-xl border border-hairline bg-surface p-4 flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-deep">
            <Heart size={20} />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-mute">Total Interações</p>
            <p className="text-heading-sm text-ink">{formatNumber(totalInteractions)}</p>
          </div>
        </div>
        <div className="rounded-xl border border-hairline bg-surface p-4 flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 dark:bg-purple-950/30 text-purple-600">
            <UserPlus size={20} />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-mute">Novos Seguidores</p>
            <p className="text-heading-sm text-ink">{formatNumber(totalFollowers)}</p>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <SearchBar value={search} onChange={setSearch} placeholder="Buscar frase..." className="w-64" />
        <div className="flex items-center gap-2 text-sm text-mute">
          <TrendingUp size={14} />
          <span>Ordenar por:</span>
          {[
            { key: 'visualizacoes', label: 'Views' },
            { key: 'interacoes', label: 'Interações' },
            { key: 'novosSeguidores', label: 'Seguidores' },
          ].map(s => (
            <button
              key={s.key}
              onClick={() => setSortBy(s.key)}
              className={cn(
                'px-3 py-1 rounded-full text-xs font-medium transition-all',
                sortBy === s.key
                  ? 'bg-emerald/10 text-emerald-deep dark:text-emerald-400'
                  : 'text-mute hover:text-ink hover:bg-ink/5',
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
        <div className="flex gap-1">
          {[{ k: 'todas', l: 'Todas' }, { k: 'publicadas', l: 'Publicadas' }, { k: 'rascunhos', l: 'Rascunhos' }].map(f => (
            <button key={f.k} onClick={() => setPubFilter(f.k)}
              className={cn('px-3 py-1.5 rounded-lg text-xs font-medium transition-all', pubFilter === f.k ? 'bg-ink text-on-inverse' : 'text-mute hover:text-ink hover:bg-ink/5 border border-hairline')}
            >{f.l}</button>
          ))}
        </div>
        <div className="flex-1" />
        <Button variant="ghost" size="sm" onClick={() => setImportOpen(!importOpen)} icon={importOpen ? <ChevronDown size={14} /> : <Upload size={14} />}>
          Sheets
        </Button>
        <Button variant="ghost" size="sm" onClick={() => exportToCSV(items, 'frases')} icon={<Download size={14} />}>
          CSV
        </Button>
        <Button variant="primary" size="sm" onClick={openAdd} icon={<Plus size={16} />}>
          Nova Frase
        </Button>
      </div>

      {importOpen && (
        <div className="mb-5 rounded-xl border border-hairline bg-elevated/50 p-4">
          <p className="text-xs text-mute mb-3">Cole os dados copiados do Sheets (separados por tab) — formato: <span className="font-mono text-ink">frase <span className="text-faint">[tab]</span> visualizações <span className="text-faint">[tab]</span> interações <span className="text-faint">[tab]</span> atividade <span className="text-faint">[tab]</span> seguidores</span></p>
          <textarea
            value={importText}
            onChange={e => setImportText(e.target.value)}
            placeholder="Cole aqui os dados do Google Sheets..."
            rows={6}
            className="w-full rounded-lg border border-hairline bg-surface px-4 py-3 text-sm text-ink placeholder:text-faint focus:outline-none focus:ring-2 focus:ring-emerald/40 custom-scrollbar resize-y font-mono"
          />
          <div className="flex justify-end gap-3 mt-3">
            <Button variant="ghost" size="sm" onClick={() => { setImportText(''); setImportOpen(false) }}>Cancelar</Button>
            <Button variant="brand" size="sm" onClick={handleImportFromSheet} icon={importing ? null : <Upload size={14} />} disabled={!importText.trim() || importing}>
              {importing ? 'Importando...' : 'Importar'}
            </Button>
          </div>
        </div>
      )}

      {/* List */}
      {filtered.length === 0 ? (
        <EmptyState icon={MessageSquareQuote} title="Nenhuma frase encontrada" description="Adicione uma nova frase ou ajuste a busca." />
      ) : (
        <div className="space-y-4">
          {filtered.map((item, idx) => (
            <div
              key={item.id}
              className={cn('group rounded-xl border p-5 transition-all duration-fast hover:shadow-sm', item.publicado ? 'border-emerald/30 bg-emerald-50/30 dark:bg-emerald-950/10 hover:border-emerald/50' : 'border-hairline bg-surface hover:border-hairline-strong')}
            >
              <div className="flex items-start gap-3">
                <div className="flex flex-col items-center gap-2 pt-1">
                  <button
                    onClick={() => updateItem(item.id, { publicado: !item.publicado })}
                    className={cn(
                      'p-1 rounded-md transition-colors',
                      item.publicado ? 'text-emerald hover:text-emerald-deep' : 'text-faint hover:text-mute'
                    )}
                    title={item.publicado ? 'Publicado' : 'Não publicado'}
                  >
                    {item.publicado ? <CheckCircle size={18} /> : <XCircle size={18} />}
                  </button>
                  <span className="text-[10px] font-medium text-mute">{item.publicado ? 'Postado' : 'Rascunho'}</span>
                </div>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-elevated text-sm font-bold text-mute">
                  #{idx + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-ink font-medium leading-relaxed">"{item.frase}"</p>

                  <div className="mt-3 grid grid-cols-4 gap-3">
                    <div className="rounded-lg border border-hairline bg-elevated/50 p-3">
                      <div className="flex items-center gap-1.5 text-[11px] text-mute mb-1">
                        <Eye size={13} />
                        <span>Visualizações</span>
                      </div>
                      <p className="text-lg font-bold text-ink">{formatNumber(item.visualizacoes)}</p>
                      <div className="mt-1.5 h-1 rounded-full bg-elevated overflow-hidden">
                        <div className="h-full rounded-full bg-blue-400" style={{ width: `${(item.visualizacoes / maxViz) * 100}%` }} />
                      </div>
                    </div>
                    <div className="rounded-lg border border-hairline bg-elevated/50 p-3">
                      <div className="flex items-center gap-1.5 text-[11px] text-mute mb-1">
                        <Heart size={13} />
                        <span>Interações</span>
                      </div>
                      <p className="text-lg font-bold text-ink">{formatNumber(item.interacoes)}</p>
                    </div>
                    <div className="rounded-lg border border-hairline bg-elevated/50 p-3">
                      <div className="flex items-center gap-1.5 text-[11px] text-mute mb-1">
                        <Activity size={13} />
                        <span>Ativ. Perfil</span>
                      </div>
                      <p className="text-lg font-bold text-ink">{formatNumber(item.atividadePerfil)}</p>
                    </div>
                    <div className="rounded-lg border border-hairline bg-elevated/50 p-3">
                      <div className="flex items-center gap-1.5 text-[11px] text-mute mb-1">
                        <UserPlus size={13} />
                        <span>Seguidores</span>
                      </div>
                      <p className="text-lg font-bold text-ink">{formatNumber(item.novosSeguidores)}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ClaudeButton context={item} title="Claude — Frase" />
                  <AiButton context={item} title="IA — Frase" />
                  <button onClick={() => openEdit(item)} className="p-1.5 rounded-md text-mute hover:text-ink hover:bg-ink/5 transition-colors">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => setDeleteTarget(item)} className="p-1.5 rounded-md text-mute hover:text-danger hover:bg-danger/5 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Editar Frase' : 'Nova Frase'}>
        <FrasesForm initialData={editing} onSave={handleSave} onClose={() => setModalOpen(false)} />
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Excluir frase?"
        message="Esta frase e suas métricas serão excluídas permanentemente."
      />
    </div>
  )
}

function FrasesForm({ initialData, onSave, onClose }) {
  const [form, setForm] = useState(initialData || emptyItem)
  const set = (f, v) => setForm(prev => ({ ...prev, [f]: v }))

  if (initialData && form.id !== initialData.id) setForm(initialData)

  return (
    <form onSubmit={e => { e.preventDefault(); onSave(form) }} className="space-y-4">
      <Field label="Frase">
        <Input value={form.frase} onChange={e => set('frase', e.target.value)} placeholder="Escreva a frase..." required />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Visualizações">
          <Input type="number" value={form.visualizacoes} onChange={e => set('visualizacoes', e.target.value)} placeholder="0" />
        </Field>
        <Field label="Interações">
          <Input type="number" value={form.interacoes} onChange={e => set('interacoes', e.target.value)} placeholder="0" />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Atividade do Perfil">
          <Input type="number" value={form.atividadePerfil} onChange={e => set('atividadePerfil', e.target.value)} placeholder="0" />
        </Field>
        <Field label="Novos Seguidores">
          <Input type="number" value={form.novosSeguidores} onChange={e => set('novosSeguidores', e.target.value)} placeholder="0" />
        </Field>
      </div>
      <div className="flex justify-end gap-3 pt-4 border-t border-hairline">
        <Button variant="ghost" size="sm" type="button" onClick={onClose}>Cancelar</Button>
        <Button variant="primary" size="sm" type="submit">{initialData ? 'Salvar' : 'Adicionar'}</Button>
      </div>
    </form>
  )
}

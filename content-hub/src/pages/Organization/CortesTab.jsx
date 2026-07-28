import { useState, useMemo } from 'react'
import { useCollection } from '../../store/useStore'
import { Checkbox } from '../../components/ui/Checkbox'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { SearchBar } from '../../components/ui/SearchBar'
import { EmptyState } from '../../components/ui/EmptyState'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { Modal } from '../../components/ui/Modal'
import { Field, Input, Textarea } from '../../components/ui/Input'
import { toast } from '../../components/ui/Toast'
import { exportToCSV } from '../../store/storage'
import { cn } from '../../lib/cn'
import { AiButton } from '../../components/ai/AiPanel'
import { ClaudeButton } from '../../components/claude/ClaudePanel'
import { ScheduleModal } from '../../components/calendar/ScheduleModal'
import { Plus, Pencil, Trash2, ExternalLink, AlertCircle, Scissors, Download } from 'lucide-react'

const STAGES = ['editado', 'aprovado']
const STAGE_LABELS = { editado: 'Editado', aprovado: 'Aprovado' }

const emptyItem = {
  conteudoOriginal: '', editado: false, aprovado: false,
  observacao: '', titulo: '', tituloMelhor: '', linkFinalizado: '',
}

export function CortesTab({ onNavigate }) {
  const { items, addItem, updateItem, deleteItem, toggleStage } = useCollection('cortes')
  const { addItem: addCalendarItem } = useCollection('calendario')

  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [scheduleTarget, setScheduleTarget] = useState(null)

  const filtered = useMemo(() => {
    if (!search) return items
    const s = search.toLowerCase()
    return items.filter(item =>
      item.titulo?.toLowerCase().includes(s) ||
      item.conteudoOriginal?.toLowerCase().includes(s) ||
      item.tituloMelhor?.toLowerCase().includes(s)
    )
  }, [items, search])

  function openAdd() { setEditing(null); setModalOpen(true) }
  function openEdit(item) { setEditing(item); setModalOpen(true) }

  function handleStageClick(item, stage) {
    const isBecomingApproved = stage === 'aprovado' && !item.aprovado
    toggleStage(item.id, stage, STAGES)

    if (isBecomingApproved) {
      setScheduleTarget({
        id: item.id,
        title: item.titulo,
        type: 'Corte',
        defaultFormat: 'Reels',
      })
    }
  }

  function handleSave(data) {
    let savedId = editing?.id
    const wasApprovedBefore = editing?.aprovado

    if (editing) {
      updateItem(editing.id, data)
      toast('Corte atualizado')
    } else {
      addItem(data)
      toast('Corte adicionado')
    }
    setModalOpen(false)

    if (data.aprovado && !wasApprovedBefore) {
      setScheduleTarget({
        id: savedId || 'new',
        title: data.titulo,
        type: 'Corte',
        defaultFormat: 'Reels',
      })
    }
  }

  function handleConfirmSchedule({ date, horario, formato }) {
    if (scheduleTarget) {
      addCalendarItem({
        agenda: date,
        horario,
        formato,
        conteudo: scheduleTarget.title,
        conteudoRef: scheduleTarget.id,
        status: 'Finalizado',
      })
      toast('Post agendado no calendário!')
      setScheduleTarget(null)
      if (onNavigate) onNavigate('calendario')
    }
  }

  function handleDelete() {
    if (deleteTarget) {
      deleteItem(deleteTarget.id)
      toast('Corte excluído')
      setDeleteTarget(null)
    }
  }

  const isPending = (item) => item.aprovado && !item.linkFinalizado

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <SearchBar value={search} onChange={setSearch} placeholder="Buscar por título ou conteúdo original..." className="w-72" />
        <div className="flex-1" />
        <Button variant="ghost" size="sm" onClick={() => exportToCSV(items, 'cortes')} icon={<Download size={14} />}>
          CSV
        </Button>
        <Button variant="primary" size="sm" onClick={openAdd} icon={<Plus size={16} />}>
          Novo Corte
        </Button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Scissors} title="Nenhum corte encontrado" description="Adicione um novo corte ou ajuste a busca." />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-hairline">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-hairline bg-elevated/50">
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-mute">Conteúdo Original</th>
                {STAGES.map(s => (
                  <th key={s} className="px-3 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-mute w-20">
                    {STAGE_LABELS[s]}
                  </th>
                ))}
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-mute">Título</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-mute">Título Melhor</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-mute w-24">Link</th>
                <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-mute w-20">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(item => (
                <tr key={item.id} className={cn(
                  'border-b border-hairline-soft table-row-hover',
                  isPending(item) && 'bg-amber-50/30 dark:bg-amber-950/10',
                )}>
                  <td className="px-4 py-4">
                    <span className="text-xs text-mute bg-elevated px-2 py-1 rounded-md">{item.conteudoOriginal}</span>
                  </td>
                  {STAGES.map(stage => (
                    <td key={stage} className="px-3 py-4 text-center">
                      <Checkbox checked={item[stage]} onChange={() => handleStageClick(item, stage)} />
                    </td>
                  ))}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-ink font-medium">{item.titulo}</span>
                      {isPending(item) && (
                        <span title="Aprovado sem link" className="pending-pulse">
                          <AlertCircle size={14} className="text-warning" />
                        </span>
                      )}
                    </div>
                    {item.observacao && <p className="text-xs text-mute mt-0.5">{item.observacao}</p>}
                  </td>
                  <td className="px-4 py-4 text-body text-sm">
                    {item.tituloMelhor || <span className="text-faint">—</span>}
                  </td>
                  <td className="px-4 py-4">
                    {item.linkFinalizado ? (
                      <a
                        href={item.linkFinalizado}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-emerald hover:text-emerald-deep underline underline-offset-2 transition-colors max-w-[200px] truncate"
                      >
                        <ExternalLink size={12} className="shrink-0" />
                        <span className="truncate">{item.linkFinalizado.replace(/^https?:\/\//, '')}</span>
                      </a>
                    ) : <span className="text-faint">—</span>}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <ClaudeButton context={item} title="Claude — Corte" />
                      <AiButton context={item} title="IA — Corte" />
                      <button onClick={() => openEdit(item)} className="p-1.5 rounded-md text-mute hover:text-ink hover:bg-ink/5 transition-colors">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => setDeleteTarget(item)} className="p-1.5 rounded-md text-mute hover:text-danger hover:bg-danger/5 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Editar Corte' : 'Novo Corte'} size="lg">
        <CortesForm initialData={editing} onSave={handleSave} onClose={() => setModalOpen(false)} />
      </Modal>

      <ScheduleModal
        isOpen={!!scheduleTarget}
        onClose={() => setScheduleTarget(null)}
        item={scheduleTarget}
        onConfirm={handleConfirmSchedule}
      />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Excluir corte?"
        message={`"${deleteTarget?.titulo}" será excluído permanentemente.`}
      />
    </div>
  )
}

function CortesForm({ initialData, onSave, onClose }) {
  const [form, setForm] = useState(initialData || emptyItem)
  const set = (f, v) => setForm(prev => ({ ...prev, [f]: v }))

  if (initialData && form.id !== initialData.id) setForm(initialData)

  return (
    <form onSubmit={e => { e.preventDefault(); onSave(form) }} className="space-y-4">
      <Field label="Conteúdo Original">
        <Input value={form.conteudoOriginal} onChange={e => set('conteudoOriginal', e.target.value)} placeholder="Nome do vídeo de onde o corte foi tirado" required />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Título">
          <Input value={form.titulo} onChange={e => set('titulo', e.target.value)} placeholder="Título do corte" required />
        </Field>
        <Field label="Título Melhor">
          <Input value={form.tituloMelhor} onChange={e => set('tituloMelhor', e.target.value)} placeholder="Variação de teste A/B" />
        </Field>
      </div>
      <Field label="Observação">
        <Textarea value={form.observacao} onChange={e => set('observacao', e.target.value)} placeholder="Observações..." />
      </Field>
      <Field label="Link Finalizado">
        <Input value={form.linkFinalizado} onChange={e => set('linkFinalizado', e.target.value)} placeholder="https://..." />
      </Field>
      <div className="flex items-center gap-6 pt-2">
        {STAGES.map(s => <Checkbox key={s} checked={form[s]} onChange={v => set(s, v)} label={STAGE_LABELS[s]} />)}
      </div>
      <div className="flex justify-end gap-3 pt-4 border-t border-hairline">
        <Button variant="ghost" size="sm" type="button" onClick={onClose}>Cancelar</Button>
        <Button variant="primary" size="sm" type="submit">{initialData ? 'Salvar' : 'Adicionar'}</Button>
      </div>
    </form>
  )
}

import { useState } from 'react'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { EmptyState } from '../../components/ui/EmptyState'
import { Modal } from '../../components/ui/Modal'
import { Field, Input, Select } from '../../components/ui/Input'
import { SearchBar } from '../../components/ui/SearchBar'
import { toast } from '../../components/ui/Toast'
import { useCollection } from '../../store/useStore'
import { cn } from '../../lib/cn'
import {
  Users, Mail, UserPlus, Shield, ShieldCheck, ShieldHalf,
  MoreHorizontal, Trash2, RefreshCw, X, CheckCircle, Clock,
  User, ChevronRight
} from 'lucide-react'

const cargos = [
  { value: 'Admin', label: 'Admin', icon: ShieldCheck, desc: 'Acesso total ao sistema' },
  { value: 'Editor', label: 'Editor', icon: ShieldHalf, desc: 'Gerencia conteúdo e calendário' },
  { value: 'Viewer', label: 'Viewer', icon: Shield, desc: 'Apenas visualização' },
]

const roleConfig = {
  Admin: { icon: ShieldCheck, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-950/30' },
  Editor: { icon: ShieldHalf, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/30' },
  Viewer: { icon: Shield, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/30' },
}

function Avatar({ nome, className }) {
  const initials = nome.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
  const colors = [
    'bg-emerald-500', 'bg-blue-500', 'bg-purple-500', 'bg-amber-500',
    'bg-rose-500', 'bg-cyan-500', 'bg-violet-500', 'bg-pink-500',
  ]
  const color = colors[nome.length % colors.length]
  return (
    <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white text-sm font-semibold', color, className)}>
      {initials}
    </div>
  )
}

function ConviteModal({ isOpen, onClose }) {
  const { addItem } = useCollection('equipe')
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [cargo, setCargo] = useState('Editor')
  const [sending, setSending] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    if (!nome.trim() || !email.trim()) return
    setSending(true)
    setTimeout(() => {
      addItem({
        nome: nome.trim(),
        email: email.trim(),
        cargo,
        status: 'pendente',
        createdAt: new Date().toISOString(),
      })
      toast(`Convite enviado para ${nome}`)
      setNome('')
      setEmail('')
      setCargo('Editor')
      setSending(false)
      onClose()
    }, 600)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Convidar Membro" size="md">
      <form onSubmit={handleSubmit} className="space-y-5">
        <Field label="Nome">
          <Input
            placeholder="Nome completo"
            value={nome}
            onChange={e => setNome(e.target.value)}
            required
          />
        </Field>

        <Field label="E-mail">
          <Input
            type="email"
            placeholder="email@exemplo.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </Field>

        <Field label="Cargo">
          <Select value={cargo} onChange={e => setCargo(e.target.value)}>
            {cargos.map(c => (
              <option key={c.value} value={c.value}>{c.label} — {c.desc}</option>
            ))}
          </Select>
        </Field>

        <div className="rounded-xl border border-hairline bg-elevated/50 p-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-mute mb-3">Permissões do cargo</p>
          <div className="space-y-2">
            {cargos.map(c => {
              const Icon = c.icon
              const isActive = c.value === cargo
              return (
                <button
                  type="button"
                  key={c.value}
                  onClick={() => setCargo(c.value)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-all',
                    isActive ? 'bg-emerald/10 text-emerald-700 dark:text-emerald-400 ring-1 ring-emerald/20' : 'text-mute hover:bg-ink/5',
                  )}
                >
                  <Icon size={16} className={isActive ? 'text-emerald' : 'text-faint'} />
                  <div className="flex-1">
                    <span className="font-medium">{c.label}</span>
                    <span className="ml-2 text-xs text-mute">{c.desc}</span>
                  </div>
                  {isActive && <CheckCircle size={14} className="text-emerald" />}
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="brand" size="sm" icon={<Mail size={14} />} disabled={!nome.trim() || !email.trim() || sending}>
            {sending ? 'Enviando...' : 'Enviar Convite'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

function MemberCard({ member, onRemove, onResend }) {
  const RoleIcon = roleConfig[member.cargo]?.icon || Shield
  const statusLabel = member.status === 'ativo' ? 'Ativo' : 'Pendente'
  const statusTone = member.status === 'ativo' ? 'emerald' : 'warning'

  return (
    <div className="group relative rounded-xl border border-hairline bg-surface p-5 transition-all duration-300 hover:shadow-sm hover:border-emerald/20">
      <div className="flex items-start gap-4">
        <Avatar nome={member.nome} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold text-ink truncate">{member.nome}</h4>
            <Badge tone={statusTone}>{statusLabel}</Badge>
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <Mail size={12} className="text-faint" />
            <span className="text-xs text-mute truncate">{member.email}</span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <div className={cn('flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium', roleConfig[member.cargo].bg, roleConfig[member.cargo].color)}>
              <RoleIcon size={12} />
              {member.cargo}
            </div>
            {member.createdAt && (
              <span className="text-[11px] text-faint">
                {new Date(member.createdAt).toLocaleDateString('pt-BR')}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {member.status === 'pendente' && (
            <button
              onClick={() => { onResend?.(member); toast(`Convite reenviado para ${member.nome}`) }}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-mute hover:text-emerald hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-all"
              title="Reenviar convite"
            >
              <RefreshCw size={14} />
            </button>
          )}
          <button
            onClick={() => onRemove(member)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-mute hover:text-danger hover:bg-red-50 dark:hover:bg-red-950/30 transition-all"
            title="Remover membro"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}

export function TeamPage() {
  const { items: membros, deleteItem, updateItem } = useCollection('equipe')
  const [isModalOpen, setModalOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [filtroCargo, setFiltroCargo] = useState('todos')

  const filtered = membros
    .filter(m => {
      const matchSearch = !search || m.nome.toLowerCase().includes(search.toLowerCase()) || m.email.toLowerCase().includes(search.toLowerCase())
      const matchCargo = filtroCargo === 'todos' || m.cargo === filtroCargo
      return matchSearch && matchCargo
    })

  const ativos = membros.filter(m => m.status === 'ativo').length
  const pendentes = membros.filter(m => m.status === 'pendente').length

  function handleRemove(member) {
    deleteItem(member.id)
    toast(`${member.nome} removido da equipe`, 'error')
  }

  function handleResend(member) {
    // just visual feedback — re-send logic would be in the server
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-heading-lg text-ink">Equipe</h1>
        <p className="text-sm text-mute mt-1">Gerencie os membros da sua equipe e convide novos colaboradores</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card className="!p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/30">
              <Users size={18} className="text-emerald" />
            </div>
            <div>
              <p className="text-2xl font-bold text-ink">{membros.length}</p>
              <p className="text-xs text-mute">Total de membros</p>
            </div>
          </div>
        </Card>
        <Card className="!p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/30">
              <CheckCircle size={18} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-ink">{ativos}</p>
              <p className="text-xs text-mute">Ativos</p>
            </div>
          </div>
        </Card>
        <Card className="!p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-950/30">
              <Clock size={18} className="text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-ink">{pendentes}</p>
              <p className="text-xs text-mute">Pendentes</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters + Actions */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Buscar por nome ou email..."
          className="flex-1 min-w-[200px] max-w-sm"
        />
        <div className="flex gap-1">
          {['todos', 'Admin', 'Editor', 'Viewer'].map(cargo => (
            <button
              key={cargo}
              onClick={() => setFiltroCargo(cargo)}
              className={cn(
                'rounded-lg px-3 py-1.5 text-xs font-medium transition-all',
                filtroCargo === cargo
                  ? 'bg-ink text-on-inverse'
                  : 'text-mute hover:bg-ink/5 hover:text-ink border border-hairline',
              )}
            >
              {cargo === 'todos' ? 'Todos' : cargo}
            </button>
          ))}
        </div>
        <Button
          variant="brand"
          size="sm"
          icon={<UserPlus size={14} />}
          onClick={() => setModalOpen(true)}
          className="ml-auto"
        >
          Convidar
        </Button>
      </div>

      {/* Members List */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map(member => (
            <MemberCard
              key={member.id}
              member={member}
              onRemove={handleRemove}
              onResend={handleResend}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Users}
          title={search || filtroCargo !== 'todos' ? 'Nenhum resultado encontrado' : 'Nenhum membro na equipe'}
          description={search || filtroCargo !== 'todos' ? 'Tente ajustar a busca ou os filtros' : 'Convide seu primeiro membro para começar'}
          action={
            !search && filtroCargo === 'todos' ? (
              <Button variant="brand" size="sm" icon={<UserPlus size={14} />} onClick={() => setModalOpen(true)}>
                Convidar Membro
              </Button>
            ) : null
          }
        />
      )}

      <ConviteModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
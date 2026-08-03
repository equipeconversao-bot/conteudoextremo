import { useState, useRef, useEffect, useCallback } from 'react'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { toast } from '../../components/ui/Toast'
import { api } from '../../lib/api'
import { useCollection } from '../../store/useStore'
import { cn } from '../../lib/cn'
import {
  Bot, Sparkles, Send, Copy, Check, Plus, Film, Video,
  MessageSquareQuote, Loader2, Trash2, Heart, Download,
  PanelRightOpen, PanelRightClose, MessageSquare, Pin, PinOff,
  Search, Edit3, ChevronRight, Clock,
} from 'lucide-react'

const STORAGE_KEY = 'ce-conversas'
const WELCOME = 'Olá! Sou o **Claude AI Copilot**. Como posso te ajudar hoje?\n\nPosso criar **roteiros de vídeos**, **estruturas de carrosséis**, **ideias de conteúdo** ou **legendas** pra você!'

const QUICK_PROMPTS = [
  { label: 'Carrossel', type: 'carrossel', prompt: 'Crie uma estrutura de carrossel de 7 slides sobre 5 erros de criadores de conteúdo.' },
  { label: 'Roteiro Reels', type: 'roteiro', prompt: 'Crie um roteiro dinâmico de Reels sobre como aumentar a retenção dos vídeos nos primeiros 3 segundos.' },
  { label: 'Frases Impacto', type: 'chat', prompt: 'Crie 5 frases de impacto persuasivas e curtas para posts de tecnologia e carreira.' },
  { label: 'Ideias YouTube', type: 'chat', prompt: 'Dê 5 ideias de vídeos longos de alta busca no YouTube sobre React, IA e desenvolvimento web.' },
]

function gerarId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

function carregarConversas() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

function salvarConversas(conversas) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversas))
  } catch { /* quota exceeded */ }
}

function criarConversa() {
  return {
    id: gerarId(),
    titulo: 'Nova conversa',
    messages: [{ role: 'assistant', content: WELCOME }],
    pinned: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

export function ProducaoPage({ onNavigate }) {
  const [conversas, setConversas] = useState(carregarConversas)
  const [activeId, setActiveId] = useState(null)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [copiedIdx, setCopiedIdx] = useState(null)
  const [showSaved, setShowSaved] = useState(true)
  const [search, setSearch] = useState('')
  const [editingTitle, setEditingTitle] = useState(null)

  const { items: savedItems, addItem: addSaved, deleteItem: deleteSaved, updateItem: updateSaved } = useCollection('producao')
  const { addItem: addVideoLongo } = useCollection('videosLongos')
  const { addItem: addVideoCurto } = useCollection('videosCurtos')
  const { addItem: addFrase } = useCollection('frases')

  const chatEndRef = useRef(null)
  const titleInputRef = useRef(null)

  const activeConv = conversas.find(c => c.id === activeId) || null
  const messages = activeConv?.messages || []

  useEffect(() => { salvarConversas(conversas) }, [conversas])

  useEffect(() => {
    if (!activeId && conversas.length > 0) {
      const top = [...conversas].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      setActiveId(top[0].id)
    }
    if (conversas.length === 0) {
      const nova = criarConversa()
      setConversas([nova])
      setActiveId(nova.id)
    }
  }, [])

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  function atualizarConversa(id, changes) {
    setConversas(prev => prev.map(c => c.id === id ? { ...c, ...changes, updatedAt: new Date().toISOString() } : c))
  }

  function handleNovaConversa() {
    const nova = criarConversa()
    setConversas(prev => [nova, ...prev])
    setActiveId(nova.id)
    setSearch('')
  }

  function handleDeleteConversa(id) {
    setConversas(prev => {
      const next = prev.filter(c => c.id !== id)
      if (activeId === id) {
        const top = next.length > 0 ? next[0] : criarConversa()
        if (next.length === 0) {
          setActiveId(top.id)
          return [top]
        }
        setActiveId(top.id)
      }
      return next
    })
  }

  function handlePinConversa(id) {
    setConversas(prev => prev.map(c =>
      c.id === id ? { ...c, pinned: !c.pinned } : c
    ))
  }

  function handleRenameConversa(id, novoNome) {
    if (novoNome.trim()) {
      atualizarConversa(id, { titulo: novoNome.trim() })
    }
    setEditingTitle(null)
  }

  function handleSend(customPrompt, customType = 'chat') {
    const textToSend = customPrompt || input
    if (!textToSend.trim() || !activeId) return

    if (!customPrompt) setInput('')

    const userMsg = { role: 'user', content: textToSend }
    const updatedMessages = [...messages, userMsg]
    atualizarConversa(activeId, {
      messages: updatedMessages,
      titulo: activeConv.titulo === 'Nova conversa' ? textToSend.slice(0, 60) : activeConv.titulo,
    })
    setLoading(true)

    api.ai(customType, null, textToSend, updatedMessages).then(res => {
      setLoading(false)
      const reply = res.error
        ? { role: 'assistant', content: `⚠️ ${res.error}` }
        : { role: 'assistant', content: res.text }
      const finalMessages = [...updatedMessages, reply]
      atualizarConversa(activeId, { messages: finalMessages })
      if (res.error) toast(res.error, 'danger')
    })
  }

  function handleSave(msg, msgIdx) {
    const title = msg.content.split('\n')[0].replace(/[*#]/g, '').trim().slice(0, 80)
    addSaved({
      titulo: title || 'Ideia sem título',
      conteudo: msg.content,
      tipo: 'chat',
      favorito: false,
      criadoEm: new Date().toISOString(),
    })
    toast('Salvo em Produção!')
  }

  function toggleFavorito(item) { updateSaved(item.id, { favorito: !item.favorito }) }

  function handleCopy(text, idx) {
    navigator.clipboard.writeText(text)
    setCopiedIdx(idx)
    toast('Copiado!')
    setTimeout(() => setCopiedIdx(null), 2000)
  }

  function handleSendToOrg(item, targetType) {
    const firstLine = item.conteudo.split('\n')[0].replace(/[*#]/g, '').trim()
    const cleanTitle = firstLine.length > 5 ? firstLine.slice(0, 70) : 'Ideia do Claude'
    const data = targetType === 'longos'
      ? { tema: cleanTitle, descricao: item.conteudo.slice(0, 300), categoria: 'Aula', ondeQuem: 'YouTube', gravado: false, editado: false, aprovado: false, publicado: false }
      : targetType === 'curtos'
        ? { titulo: cleanTitle, categoria: 'Corte', editado: false, aprovado: false, publicado: false }
        : { frase: item.conteudo.slice(0, 200), visualizacoes: 0, interacoes: 0, atividadePerfil: 0, novosSeguidores: 0 }
    const fn = targetType === 'longos' ? addVideoLongo : targetType === 'curtos' ? addVideoCurto : addFrase
    fn(data)
    toast(`Adicionado em ${targetType === 'longos' ? 'Vídeos Longos' : targetType === 'curtos' ? 'Vídeos Curtos' : 'Frases'}!`)
  }

  function handleDeleteSaved(id) { deleteSaved(id); toast('Removido') }

  const conversasOrdenadas = [...conversas].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1
    return new Date(b.updatedAt) - new Date(a.updatedAt)
  })

  const conversasFiltradas = search
    ? conversasOrdenadas.filter(c => c.titulo.toLowerCase().includes(search.toLowerCase()))
    : conversasOrdenadas

  const sortedSaved = [...savedItems].sort((a, b) => new Date(b.criadoEm || b.createdAt) - new Date(a.criadoEm || a.createdAt))
  const favoritos = sortedSaved.filter(i => i.favorito)
  const outros = sortedSaved.filter(i => !i.favorito)

  return (
    <div className="flex h-[calc(100vh-6rem)] gap-3">
      {/* Left: Conversation list */}
      <div className="w-64 shrink-0 flex flex-col rounded-xl border border-hairline bg-surface/30 overflow-hidden">
        <div className="p-3 border-b border-hairline">
          <Button variant="primary" size="sm" className="w-full" onClick={handleNovaConversa} icon={<Plus size={14} />}>
            Nova Conversa
          </Button>
          <div className="relative mt-2">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-mute" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar conversas..."
              className="w-full rounded-lg border border-hairline bg-surface text-ink text-xs pl-7 pr-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald/30 placeholder:text-faint"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-1.5 space-y-0.5">
          {conversasFiltradas.length === 0 && (
            <div className="text-center py-8 text-mute text-xs">Nenhuma conversa encontrada</div>
          )}
          {conversasFiltradas.map(conv => {
            const isActive = conv.id === activeId
            const preview = conv.messages.length > 1
              ? conv.messages[conv.messages.length - 1]?.content?.slice(0, 50).replace(/[*#]/g, '') + '...'
              : ''
            const date = new Date(conv.updatedAt)
            const dateStr = date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
            return (
              <div
                key={conv.id}
                className={cn(
                  'group relative rounded-lg px-3 py-2 cursor-pointer transition-colors',
                  isActive ? 'bg-emerald/10 border border-emerald/20' : 'hover:bg-ink/5 border border-transparent',
                  conv.pinned && !isActive && 'border-amber/20 bg-amber/5',
                )}
                onClick={() => { setActiveId(conv.id); setSearch('') }}
              >
                <div className="flex items-start gap-2">
                  <MessageSquare size={13} className={cn('shrink-0 mt-0.5', isActive ? 'text-emerald' : 'text-mute')} />
                  <div className="flex-1 min-w-0">
                    {editingTitle === conv.id ? (
                      <input
                        ref={titleInputRef}
                        defaultValue={conv.titulo}
                        onBlur={e => handleRenameConversa(conv.id, e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleRenameConversa(conv.id, e.target.value)}
                        className="w-full text-xs font-medium bg-surface border border-hairline rounded px-1 py-0.5 text-ink focus:outline-none"
                        autoFocus
                        onClick={e => e.stopPropagation()}
                      />
                    ) : (
                      <p className={cn('text-xs font-medium truncate', isActive ? 'text-emerald-deep dark:text-emerald-400' : 'text-ink')}>
                        {conv.titulo}
                      </p>
                    )}
                    {preview && !editingTitle && (
                      <p className="text-[10px] text-mute truncate mt-0.5">{preview}</p>
                    )}
                    <p className="text-[9px] text-faint mt-0.5">{dateStr}{conv.pinned ? ' • Fixada' : ''}</p>
                  </div>
                </div>

                {isActive && (
                  <div className="absolute right-1.5 top-1/2 -translate-y-1/2">
                    <ChevronRight size={12} className="text-emerald/50" />
                  </div>
                )}

                {!isActive && (
                  <div className="absolute right-1.5 top-1.5 hidden group-hover:flex items-center gap-0.5">
                    <button onClick={e => { e.stopPropagation(); handlePinConversa(conv.id) }}
                      className="p-1 rounded text-mute hover:text-amber-500 hover:bg-amber/10 transition-colors"
                      title={conv.pinned ? 'Desfixar' : 'Fixar'}
                    >
                      {conv.pinned ? <PinOff size={11} /> : <Pin size={11} />}
                    </button>
                    <button onClick={e => { e.stopPropagation(); setEditingTitle(conv.id); setTimeout(() => titleInputRef.current?.focus(), 50) }}
                      className="p-1 rounded text-mute hover:text-ink hover:bg-ink/10 transition-colors" title="Renomear">
                      <Edit3 size={11} />
                    </button>
                    <button onClick={e => { e.stopPropagation(); handleDeleteConversa(conv.id) }}
                      className="p-1 rounded text-mute hover:text-danger hover:bg-danger/10 transition-colors" title="Excluir">
                      <Trash2 size={11} />
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Center: Chat */}
      <div className={cn('flex flex-col', showSaved ? 'flex-1' : 'flex-1')}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-gradient text-white">
              <Bot size={18} />
            </div>
            <div>
              <h1 className="text-heading-sm text-ink">Produção</h1>
              <p className="text-xs text-mute">{conversas.length} conversa{conversas.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
          <button
            onClick={() => setShowSaved(!showSaved)}
            className="flex items-center gap-1.5 text-xs text-mute hover:text-ink transition-colors px-3 py-1.5 rounded-lg hover:bg-ink/5"
          >
            {showSaved ? <PanelRightClose size={14} /> : <PanelRightOpen size={14} />}
            {showSaved ? 'Ocultar' : 'Salvos'}
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          {QUICK_PROMPTS.map((q, idx) => (
            <button
              key={idx}
              disabled={loading || !activeId}
              onClick={() => handleSend(q.prompt, q.type)}
              className="px-3 py-1.5 rounded-full text-xs font-medium bg-emerald/10 text-emerald-deep dark:text-emerald-400 hover:bg-emerald/20 transition-all border border-emerald/20 disabled:opacity-50"
            >
              {q.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-2 rounded-xl border border-hairline bg-surface/50 p-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={cn('flex gap-3', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
              {msg.role === 'assistant' && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-gradient text-white font-bold text-xs">AI</div>
              )}
              <div className={cn(
                'group relative rounded-xl px-4 py-3 max-w-[80%] text-sm leading-relaxed',
                msg.role === 'user' ? 'bg-inverse text-on-inverse' : 'bg-elevated/70 border border-hairline text-ink',
              )}>
                <div className="whitespace-pre-wrap">{msg.content}</div>
                {msg.role === 'assistant' && idx > 0 && (
                  <div className="mt-3 pt-2 border-t border-hairline/60 flex flex-wrap items-center gap-2">
                    <button onClick={() => handleCopy(msg.content, idx)}
                      className="px-2 py-1 rounded text-[11px] font-medium text-mute hover:text-ink hover:bg-surface flex items-center gap-1 transition-colors">
                      {copiedIdx === idx ? <Check size={12} className="text-emerald" /> : <Copy size={12} />} Copiar
                    </button>
                    <button onClick={() => handleSave(msg, idx)}
                      className="px-2 py-1 rounded text-[11px] font-medium text-mute hover:text-emerald-deep hover:bg-emerald/10 flex items-center gap-1 transition-colors">
                      <Download size={12} /> Salvar
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-gradient text-white"><Loader2 size={16} className="animate-spin" /></div>
              <p className="text-sm text-mute animate-pulse">Claude está pensando...</p>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <form onSubmit={e => { e.preventDefault(); handleSend() }} className="mt-3 flex gap-2">
          <Input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Peça uma ideia, roteiro, carrossel..."
            className="flex-1"
            disabled={loading || !activeId}
          />
          <Button type="submit" variant="brand" size="md" disabled={loading || !input.trim() || !activeId}>
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />} Enviar
          </Button>
        </form>
      </div>

      {/* Right: Saved panel */}
      {showSaved && (
        <div className="w-72 shrink-0 flex flex-col rounded-xl border border-hairline bg-surface/30 overflow-hidden">
          <div className="px-4 py-3 border-b border-hairline bg-elevated/30">
            <h3 className="text-sm font-semibold text-ink flex items-center gap-2">
              <Clock size={14} /> Conteúdos Salvos
              <span className="ml-auto text-xs text-mute font-normal">{savedItems.length}</span>
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
            {favoritos.length > 0 && (
              <>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-mute px-1">Favoritos</p>
                {favoritos.map(item => (
                  <SavedItemCard key={item.id} item={item}
                    onToggleFav={() => toggleFavorito(item)}
                    onSendToOrg={(t) => handleSendToOrg(item, t)}
                    onDelete={() => handleDeleteSaved(item.id)}
                  />
                ))}
              </>
            )}
            {outros.length > 0 && (
              <>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-mute px-1 pt-2">Outros</p>
                {outros.map(item => (
                  <SavedItemCard key={item.id} item={item}
                    onToggleFav={() => toggleFavorito(item)}
                    onSendToOrg={(t) => handleSendToOrg(item, t)}
                    onDelete={() => handleDeleteSaved(item.id)}
                  />
                ))}
              </>
            )}
            {savedItems.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center text-mute p-4">
                <Sparkles size={24} className="mb-2 text-faint" />
                <p className="text-xs">Nenhum conteúdo salvo ainda.</p>
                <p className="text-[11px] text-faint mt-1">Use o Claude AI ao lado e salve as melhores ideias.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function SavedItemCard({ item, onToggleFav, onSendToOrg, onDelete }) {
  const [expanded, setExpanded] = useState(false)
  const preview = item.conteudo.slice(0, 120)
  return (
    <div className={cn('rounded-xl border border-hairline bg-surface transition-all', item.favorito && 'border-emerald/30 bg-emerald/5')}>
      <button onClick={() => setExpanded(!expanded)} className="w-full text-left px-3 py-2.5">
        <p className="text-xs font-medium text-ink line-clamp-2 leading-snug">{item.titulo}</p>
        <p className="text-[11px] text-mute mt-1 line-clamp-2">{preview}...</p>
      </button>
      {expanded && (
        <div className="px-3 pb-3">
          <div className="text-[11px] text-body whitespace-pre-wrap bg-elevated/50 rounded-lg p-2.5 max-h-40 overflow-y-auto mb-2">{item.conteudo}</div>
          <div className="flex flex-wrap items-center gap-1">
            <button onClick={onToggleFav} className={cn('px-2 py-1 rounded text-[10px] font-medium flex items-center gap-1 transition-colors', item.favorito ? 'text-rose-600 bg-rose-50 dark:bg-rose-950/30' : 'text-mute hover:text-rose-500 hover:bg-rose-50')}>
              <Heart size={11} fill={item.favorito ? 'currentColor' : 'none'} />
            </button>
            <button onClick={() => onSendToOrg('longos')} className="px-2 py-1 rounded text-[10px] font-medium text-mute hover:text-emerald-deep hover:bg-emerald/10 flex items-center gap-1 transition-colors"><Video size={11} /> Longo</button>
            <button onClick={() => onSendToOrg('curtos')} className="px-2 py-1 rounded text-[10px] font-medium text-mute hover:text-purple-600 hover:bg-purple-50 flex items-center gap-1 transition-colors"><Film size={11} /> Curto</button>
            <button onClick={() => onSendToOrg('frases')} className="px-2 py-1 rounded text-[10px] font-medium text-mute hover:text-blue-600 hover:bg-blue-50 flex items-center gap-1 transition-colors"><MessageSquareQuote size={11} /> Frase</button>
            <button onClick={onDelete} className="px-2 py-1 rounded text-[10px] font-medium text-mute hover:text-danger hover:bg-danger/5 flex items-center gap-1 transition-colors ml-auto"><Trash2 size={11} /></button>
          </div>
        </div>
      )}
    </div>
  )
}

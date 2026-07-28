import { useState, useRef, useEffect } from 'react'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Card } from '../../components/ui/Card'
import { toast } from '../../components/ui/Toast'
import { api } from '../../lib/api'
import { useCollection } from '../../store/useStore'
import { cn } from '../../lib/cn'
import {
  Bot, Sparkles, Send, Copy, Check, Plus, Film, Video,
  MessageSquareQuote, Loader2, Trash2, Heart, Download, ExternalLink,
  PanelRightOpen, PanelRightClose, Clock,
} from 'lucide-react'

const QUICK_PROMPTS = [
  { label: 'Carrossel', type: 'carrossel', prompt: 'Crie uma estrutura de carrossel de 7 slides sobre 5 erros de criadores de conteúdo.' },
  { label: 'Roteiro Reels', type: 'roteiro', prompt: 'Crie um roteiro dinâmico de Reels sobre como aumentar a retenção dos vídeos nos primeiros 3 segundos.' },
  { label: 'Frases Impacto', type: 'chat', prompt: 'Crie 5 frases de impacto persuasivas e curtas para posts de tecnologia e carreira.' },
  { label: 'Ideias YouTube', type: 'chat', prompt: 'Dê 5 ideias de vídeos longos de alta busca no YouTube sobre React, IA e desenvolvimento web.' },
]

export function ProducaoPage({ onNavigate }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Olá! Sou o **Claude AI Copilot**. Como posso te ajudar hoje?\n\nPosso criar **roteiros de vídeos**, **estruturas de carrosséis**, **ideias de conteúdo** ou **legendas** pra você!',
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [copiedIdx, setCopiedIdx] = useState(null)
  const [showSaved, setShowSaved] = useState(true)

  const { items: savedItems, addItem: addSaved, deleteItem: deleteSaved, updateItem: updateSaved } = useCollection('producao')
  const { addItem: addVideoLongo } = useCollection('videosLongos')
  const { addItem: addVideoCurto } = useCollection('videosCurtos')
  const { addItem: addFrase } = useCollection('frases')

  const chatEndRef = useRef(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function handleSend(customPrompt, customType = 'chat') {
    const textToSend = customPrompt || input
    if (!textToSend.trim()) return

    const newMessages = [...messages, { role: 'user', content: textToSend }]
    setMessages(newMessages)
    if (!customPrompt) setInput('')
    setLoading(true)

    const res = await api.ai(customType, null, textToSend, newMessages)
    setLoading(false)

    if (res.error) {
      setMessages([...newMessages, { role: 'assistant', content: `⚠️ ${res.error}` }])
      toast(res.error, 'danger')
    } else {
      setMessages([...newMessages, { role: 'assistant', content: res.text }])
    }
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

  function toggleFavorito(item) {
    updateSaved(item.id, { favorito: !item.favorito })
  }

  function handleCopy(text, idx) {
    navigator.clipboard.writeText(text)
    setCopiedIdx(idx)
    toast('Copiado!')
    setTimeout(() => setCopiedIdx(null), 2000)
  }

  function handleSendToOrg(item, targetType) {
    const firstLine = item.conteudo.split('\n')[0].replace(/[*#]/g, '').trim()
    const cleanTitle = firstLine.length > 5 ? firstLine.slice(0, 70) : 'Ideia do Claude'

    if (targetType === 'longos') {
      addVideoLongo({
        tema: cleanTitle,
        descricao: item.conteudo.slice(0, 300),
        categoria: 'Aula',
        ondeQuem: 'YouTube',
        gravado: false, editado: false, aprovado: false, publicado: false,
      })
      toast('Adicionado em Vídeos Longos!')
    } else if (targetType === 'curtos') {
      addVideoCurto({
        titulo: cleanTitle,
        categoria: 'Corte',
        editado: false, aprovado: false, publicado: false,
      })
      toast('Adicionado em Vídeos Curtos!')
    } else if (targetType === 'frases') {
      addFrase({
        frase: item.conteudo.slice(0, 200),
        visualizacoes: 0, interacoes: 0, atividadePerfil: 0, novosSeguidores: 0,
      })
      toast('Adicionado em Frases!')
    }
  }

  function handleDeleteSaved(id) {
    deleteSaved(id)
    toast('Removido')
  }

  const sortedSaved = [...savedItems].sort((a, b) => new Date(b.criadoEm || b.createdAt) - new Date(a.criadoEm || a.createdAt))
  const favoritos = sortedSaved.filter(i => i.favorito)
  const outros = sortedSaved.filter(i => !i.favorito)

  return (
    <div className="flex h-[calc(100vh-6rem)] gap-4">
      {/* Left: Chat */}
      <div className={cn('flex flex-col', showSaved ? 'flex-1' : 'flex-1')}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-gradient text-white">
              <Bot size={18} />
            </div>
            <div>
              <h1 className="text-heading-sm text-ink">Produção</h1>
              <p className="text-xs text-mute">Crie conteúdos com IA e salve os melhores</p>
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

        {/* Quick prompts */}
        <div className="flex flex-wrap gap-2 mb-3">
          {QUICK_PROMPTS.map((q, idx) => (
            <button
              key={idx}
              disabled={loading}
              onClick={() => handleSend(q.prompt, q.type)}
              className="px-3 py-1.5 rounded-full text-xs font-medium bg-emerald/10 text-emerald-deep dark:text-emerald-400 hover:bg-emerald/20 transition-all border border-emerald/20 disabled:opacity-50"
            >
              {q.label}
            </button>
          ))}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-2 rounded-xl border border-hairline bg-surface/50 p-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={cn('flex gap-3', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
              {msg.role === 'assistant' && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-gradient text-white font-bold text-xs">
                  AI
                </div>
              )}
              <div
                className={cn(
                  'group relative rounded-xl px-4 py-3 max-w-[80%] text-sm leading-relaxed',
                  msg.role === 'user'
                    ? 'bg-inverse text-on-inverse'
                    : 'bg-elevated/70 border border-hairline text-ink',
                )}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>

                {msg.role === 'assistant' && idx > 0 && (
                  <div className="mt-3 pt-2 border-t border-hairline/60 flex flex-wrap items-center gap-2">
                    <button onClick={() => handleCopy(msg.content, idx)}
                      className="px-2 py-1 rounded text-[11px] font-medium text-mute hover:text-ink hover:bg-surface flex items-center gap-1 transition-colors"
                    >
                      {copiedIdx === idx ? <Check size={12} className="text-emerald" /> : <Copy size={12} />}
                      Copiar
                    </button>
                    <button onClick={() => handleSave(msg, idx)}
                      className="px-2 py-1 rounded text-[11px] font-medium text-mute hover:text-emerald-deep hover:bg-emerald/10 flex items-center gap-1 transition-colors"
                    >
                      <Download size={12} /> Salvar
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-gradient text-white">
                <Loader2 size={16} className="animate-spin" />
              </div>
              <p className="text-sm text-mute animate-pulse">Claude está pensando...</p>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <form
          onSubmit={e => { e.preventDefault(); handleSend() }}
          className="mt-3 flex gap-2"
        >
          <Input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Peça uma ideia, roteiro, carrossel..."
            className="flex-1"
            disabled={loading}
          />
          <Button type="submit" variant="brand" size="md" disabled={loading || !input.trim()}>
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            Enviar
          </Button>
        </form>
      </div>

      {/* Right: Saved panel */}
      {showSaved && (
        <div className="w-80 shrink-0 flex flex-col rounded-xl border border-hairline bg-surface/30 overflow-hidden">
          <div className="px-4 py-3 border-b border-hairline bg-elevated/30">
            <h3 className="text-sm font-semibold text-ink flex items-center gap-2">
              <Clock size={14} />
              Conteúdos Salvos
              <span className="ml-auto text-xs text-mute font-normal">{savedItems.length}</span>
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
            {favoritos.length > 0 && (
              <>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-mute px-1">Favoritos</p>
                {favoritos.map(item => (
                  <SavedItemCard
                    key={item.id}
                    item={item}
                    onToggleFav={() => toggleFavorito(item)}
                    onSendToOrg={(t) => handleSendToOrg(item, t)}
                    onDelete={() => handleDeleteSaved(item.id)}
                    onNavigate={onNavigate}
                  />
                ))}
              </>
            )}

            {outros.length > 0 && (
              <>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-mute px-1 pt-2">Outros</p>
                {outros.map(item => (
                  <SavedItemCard
                    key={item.id}
                    item={item}
                    onToggleFav={() => toggleFavorito(item)}
                    onSendToOrg={(t) => handleSendToOrg(item, t)}
                    onDelete={() => handleDeleteSaved(item.id)}
                    onNavigate={onNavigate}
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

function SavedItemCard({ item, onToggleFav, onSendToOrg, onDelete, onNavigate }) {
  const [expanded, setExpanded] = useState(false)
  const preview = item.conteudo.slice(0, 120)

  return (
    <div className={cn(
      'rounded-xl border border-hairline bg-surface transition-all',
      item.favorito && 'border-emerald/30 bg-emerald/5',
    )}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left px-3 py-2.5"
      >
        <p className="text-xs font-medium text-ink line-clamp-2 leading-snug">{item.titulo}</p>
        <p className="text-[11px] text-mute mt-1 line-clamp-2">{preview}...</p>
      </button>

      {expanded && (
        <div className="px-3 pb-3">
          <div className="text-[11px] text-body whitespace-pre-wrap bg-elevated/50 rounded-lg p-2.5 max-h-40 overflow-y-auto mb-2">
            {item.conteudo}
          </div>

          <div className="flex flex-wrap items-center gap-1">
            <button onClick={onToggleFav}
              className={cn(
                'px-2 py-1 rounded text-[10px] font-medium flex items-center gap-1 transition-colors',
                item.favorito
                  ? 'text-rose-600 bg-rose-50 dark:bg-rose-950/30'
                  : 'text-mute hover:text-rose-500 hover:bg-rose-50',
              )}
            >
              <Heart size={11} fill={item.favorito ? 'currentColor' : 'none'} />
            </button>
            <button onClick={() => onSendToOrg('longos')}
              className="px-2 py-1 rounded text-[10px] font-medium text-mute hover:text-emerald-deep hover:bg-emerald/10 flex items-center gap-1 transition-colors"
            >
              <Video size={11} /> Longo
            </button>
            <button onClick={() => onSendToOrg('curtos')}
              className="px-2 py-1 rounded text-[10px] font-medium text-mute hover:text-purple-600 hover:bg-purple-50 flex items-center gap-1 transition-colors"
            >
              <Film size={11} /> Curto
            </button>
            <button onClick={() => onSendToOrg('frases')}
              className="px-2 py-1 rounded text-[10px] font-medium text-mute hover:text-blue-600 hover:bg-blue-50 flex items-center gap-1 transition-colors"
            >
              <MessageSquareQuote size={11} /> Frase
            </button>
            <button onClick={onDelete}
              className="px-2 py-1 rounded text-[10px] font-medium text-mute hover:text-danger hover:bg-danger/5 flex items-center gap-1 transition-colors ml-auto"
            >
              <Trash2 size={11} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

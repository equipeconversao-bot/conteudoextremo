import { useState, useRef, useEffect } from 'react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { Input, Textarea, Field } from '../ui/Input'
import { toast } from '../ui/Toast'
import { api } from '../../lib/api'
import { useCollection } from '../../store/useStore'
import { Sparkles, Send, Copy, Check, Plus, Film, Video, MessageSquareQuote, Loader2, RefreshCw } from 'lucide-react'

const QUICK_PROMPTS = [
  { label: '🎨 Estrutura de Carrossel', type: 'carrossel', prompt: 'Crie uma estrutura de carrossel de 7 slides sobre 5 erros de criadores de conteúdo.' },
  { label: '🎬 Roteiro de Vídeo (Hook + Corpo + CTA)', type: 'roteiro', prompt: 'Crie um roteiro dinâmico de Reels sobre como aumentar a retenção dos vídeos nos primeiros 3 segundos.' },
  { label: '✍️ Frases de Impacto', type: 'chat', prompt: 'Crie 5 frases de impacto persuasivas e curtas para posts de tecnologia e carreira.' },
  { label: '💡 5 Ideias de Vídeos Longos', type: 'chat', prompt: 'Dê 5 ideias de vídeos longos de alta busca no YouTube sobre React, IA e desenvolvimento web.' },
]

export function ClaudeDrawer({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Olá! Sou o **Claude AI Copilot**. Como posso te ajudar hoje?\n\nPosso criar **roteiros de vídeos**, **estruturas de carrosséis**, **ideas de conteúdo** ou **legendas** pra você!',
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [copiedIdx, setCopiedIdx] = useState(null)

  const { addItem: addVideoLongo } = useCollection('videosLongos')
  const { addItem: addVideoCurto } = useCollection('videosCurtos')
  const { addItem: addFrase } = useCollection('frases')

  const chatEndRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
    }
  }, [messages, isOpen])

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

  function handleCopy(text, idx) {
    navigator.clipboard.writeText(text)
    setCopiedIdx(idx)
    toast('Copiado para a área de transferência!')
    setTimeout(() => setCopiedIdx(null), 2000)
  }

  function handleSaveToOrg(text, targetType) {
    const firstLine = text.split('\n')[0].replace(/[*#]/g, '').trim()
    const cleanTitle = firstLine.length > 5 ? firstLine.slice(0, 70) : 'Ideia do Claude AI'

    if (targetType === 'longos') {
      addVideoLongo({
        tema: cleanTitle,
        descricao: text.slice(0, 300) + '...',
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
        frase: text.slice(0, 200),
        visualizacoes: 0, interacoes: 0, atividadePerfil: 0, novosSeguidores: 0,
      })
      toast('Adicionado em Frases!')
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="🤖 Claude AI Copilot — Ideias & Roteiros" size="xl">
      <div className="flex flex-col h-[70vh]">
        {/* Quick actions header */}
        <div className="flex flex-wrap gap-2 pb-3 mb-3 border-b border-hairline shrink-0">
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

        {/* Chat message history */}
        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-2">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-gradient text-white font-bold text-xs">
                  AI
                </div>
              )}
              <div
                className={`group relative rounded-xl px-4 py-3 max-w-[85%] text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-inverse text-on-inverse'
                    : 'bg-elevated/70 border border-hairline text-ink'
                }`}
              >
                <div className="whitespace-pre-wrap font-sans">
                  {msg.content}
                </div>

                {/* Assistant actions */}
                {msg.role === 'assistant' && idx > 0 && (
                  <div className="mt-3 pt-2 border-t border-hairline/60 flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => handleCopy(msg.content, idx)}
                      className="px-2 py-1 rounded text-[11px] font-medium text-mute hover:text-ink hover:bg-surface flex items-center gap-1 transition-colors"
                    >
                      {copiedIdx === idx ? <Check size={12} className="text-emerald" /> : <Copy size={12} />}
                      Copiar
                    </button>
                    <button
                      onClick={() => handleSaveToOrg(msg.content, 'longos')}
                      className="px-2 py-1 rounded text-[11px] font-medium text-mute hover:text-emerald-deep hover:bg-emerald/10 flex items-center gap-1 transition-colors"
                    >
                      <Video size={12} /> + Vídeo Longo
                    </button>
                    <button
                      onClick={() => handleSaveToOrg(msg.content, 'curtos')}
                      className="px-2 py-1 rounded text-[11px] font-medium text-mute hover:text-purple-600 hover:bg-purple-50 flex items-center gap-1 transition-colors"
                    >
                      <Film size={12} /> + Vídeo Curto
                    </button>
                    <button
                      onClick={() => handleSaveToOrg(msg.content, 'frases')}
                      className="px-2 py-1 rounded text-[11px] font-medium text-mute hover:text-blue-600 hover:bg-blue-50 flex items-center gap-1 transition-colors"
                    >
                      <MessageSquareQuote size={12} /> + Frase
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
              <p className="text-sm text-mute animate-pulse">Claude está pensando e escrevendo...</p>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input box */}
        <form
          onSubmit={e => { e.preventDefault(); handleSend() }}
          className="mt-3 pt-3 border-t border-hairline flex gap-2 shrink-0"
        >
          <Input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Peça uma ideia, roteiro de carrossel, gancho de vídeo..."
            className="flex-1"
            disabled={loading}
          />
          <Button
            type="submit"
            variant="brand"
            size="md"
            disabled={loading || !input.trim()}
            icon={loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          >
            Enviar
          </Button>
        </form>
      </div>
    </Modal>
  )
}

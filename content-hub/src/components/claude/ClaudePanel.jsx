import { useState, useRef, useEffect } from 'react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { toast } from '../ui/Toast'
import { api } from '../../lib/api'
import { Sparkles, Loader2, Send, Bot, MessageSquareQuote, Video, Film, ScrollText } from 'lucide-react'

const QUICK_ACTIONS = [
  { key: 'ideias-carrossel', label: 'Ideias p/ Carrossel', icon: ScrollText, prompt: 'ideias de carrossel' },
  { key: 'roteiro-reels', label: 'Roteiro p/ Reels', icon: Film, prompt: 'roteiro de reels' },
  { key: 'roteiro-youtube', label: 'Roteiro p/ YouTube', icon: Video, prompt: 'roteiro de youtube' },
]

export function ClaudePanel({ isOpen, onClose, context }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('claude_api_key') || '')
  const [showKeyInput, setShowKeyInput] = useState(!apiKey)
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (isOpen) {
      setMessages([{
        role: 'assistant',
        text: '👋 Opa! Me chama de ideias de conteúdo, roteiros, carrosséis, o que precisar. Posso ajudar com:\n\n• 💡 Ideias criativas para posts\n• 📝 Roteiros completos pra Reels/Shorts\n• 🎬 Roteiros pra YouTube\n• 🎯 Sugestões de Carrossel\n• ✍️ Legendas e hooks\n\nO que vamos criar hoje?',
      }])
    }
  }, [isOpen])

  async function handleSend(userMessage) {
    const msg = userMessage || input
    if (!msg.trim() || loading) return

    setMessages(prev => [...prev, { role: 'user', text: msg }])
    setInput('')
    setLoading(true)

    const res = await api.claudeChat(msg, context)
    setLoading(false)

    if (res.error) {
      setMessages(prev => [...prev, { role: 'assistant', text: `❌ ${res.error}` }])
      toast(res.error, 'danger')
    } else {
      setMessages(prev => [...prev, { role: 'assistant', text: res.text }])
    }
  }

  async function handleQuickAction(action) {
    setLoading(true)
    const msg = `Crie ${action.prompt}${context?.tema ? ` sobre "${context.tema}"` : context?.titulo ? ` sobre "${context.titulo}"` : ''}`
    setMessages(prev => [...prev, { role: 'user', text: msg }])

    let res
    if (action.key === 'ideias-carrossel') {
      res = await api.claudeIdeiasCarrossel(context?.tema || context?.titulo)
    } else if (action.key === 'roteiro-reels') {
      res = await api.claudeRoteiroReels(context?.tema || context?.titulo)
    } else {
      res = await api.claudeRoteiroYoutube(context?.tema || context?.titulo)
    }

    setLoading(false)
    if (res.error) {
      setMessages(prev => [...prev, { role: 'assistant', text: `❌ ${res.error}` }])
      toast(res.error, 'danger')
    } else {
      setMessages(prev => [...prev, { role: 'assistant', text: res.text }])
    }
  }

  function saveKey() {
    if (apiKey) {
      localStorage.setItem('claude_api_key', apiKey)
      setShowKeyInput(false)
      toast('Chave da Claude salva!')
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Claude — Assistente de Conteúdo" size="xl">
      <div className="flex flex-col h-[600px]">
        {showKeyInput && (
          <div className="p-4 mb-3 rounded-xl border border-amber-200 bg-amber-50/50 dark:bg-amber-950/10 dark:border-amber-900/30">
            <p className="text-sm font-medium text-ink mb-2">🔑 Configure sua chave da Anthropic (Claude)</p>
            <div className="flex gap-2">
              <input
                type="password"
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
                placeholder="sk-ant-..."
                className="flex-1 h-10 rounded-lg border border-hairline bg-surface px-4 text-sm text-ink focus:outline-none focus:border-emerald"
              />
              <Button variant="primary" size="sm" onClick={saveKey}>Salvar</Button>
            </div>
            <p className="text-xs text-mute mt-2">
              Chave em https://console.anthropic.com/settings/keys
            </p>
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {QUICK_ACTIONS.map(action => {
            const Icon = action.icon
            return (
              <button
                key={action.key}
                onClick={() => handleQuickAction(action)}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium bg-elevated text-mute hover:text-ink hover:bg-ink/5 border border-hairline transition-all whitespace-nowrap"
              >
                <Icon size={14} /> {action.label}
              </button>
            )
          })}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 mb-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-orange-400 flex items-center justify-center shrink-0">
                  <Bot size={16} className="text-white" />
                </div>
              )}
              <div className={`max-w-[80%] rounded-xl px-4 py-3 text-sm ${
                msg.role === 'user'
                  ? 'bg-emerald/10 text-ink rounded-br-sm'
                  : 'bg-elevated border border-hairline text-body rounded-bl-sm'
              }`}>
                <pre className="whitespace-pre-wrap font-sans leading-relaxed">{msg.text}</pre>
              </div>
              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-lg bg-emerald flex items-center justify-center shrink-0">
                  <MessageSquareQuote size={16} className="text-white" />
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-orange-400 flex items-center justify-center">
                <Bot size={16} className="text-white" />
              </div>
              <div className="rounded-xl px-4 py-3 bg-elevated border border-hairline">
                <Loader2 size={16} className="animate-spin text-mute" />
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Input */}
        <div className="flex gap-2 border-t border-hairline pt-4">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder="Pede uma ideia, roteiro, ou o que precisar..."
            className="flex-1 h-10 rounded-lg border border-hairline bg-surface px-4 text-sm text-ink focus:outline-none focus:border-emerald"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="h-10 w-10 flex items-center justify-center rounded-lg bg-emerald text-white disabled:opacity-40 transition-all hover:bg-emerald-deep"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </Modal>
  )
}

export function ClaudeButton({ context, title }) {
  const [open, setOpen] = useState(false)
  const [apiKey] = useState(() => localStorage.getItem('claude_api_key') || '')

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="p-1.5 rounded-md text-mute hover:text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-950/20 transition-colors"
        title="Claude — Assistente de Conteúdo"
      >
        <Bot size={14} />
      </button>
      <ClaudePanel isOpen={open} onClose={() => setOpen(false)} context={context} />
    </>
  )
}

import { useState } from 'react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { toast } from '../ui/Toast'
import { api } from '../../lib/api'
import { Sparkles, Copy, Check, Loader2 } from 'lucide-react'

const TYPES = [
  { key: 'legenda', label: 'Legenda p/ Instagram', icon: '📝' },
  { key: 'hashtags', label: 'Hashtags', icon: '🏷️' },
  { key: 'titulo-ab', label: 'Variações de Título', icon: '🅰️🅱️' },
  { key: 'melhor-titulo', label: 'Melhor Título', icon: '✨' },
]

export function AiPanel({ isOpen, onClose, context, title }) {
  const [type, setType] = useState('legenda')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  if (!context) return null

  const activeType = TYPES.find(t => t.key === type)

  async function handleGenerate() {
    setLoading(true)
    setResult(null)
    setCopied(false)

    const res = await api.ai(type, context)
    setLoading(false)

    if (res.error) {
      toast(res.error, 'danger')
      setResult({ error: res.error })
    } else {
      setResult({ text: res.text })
    }
  }

  function handleCopy() {
    if (result?.text) {
      navigator.clipboard.writeText(result.text)
      setCopied(true)
      toast('Copiado!')
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title || 'IA — Gerar Conteúdo'} size="lg">
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {TYPES.map(t => (
            <button
              key={t.key}
              onClick={() => { setType(t.key); setResult(null) }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                type === t.key
                  ? 'bg-emerald/10 text-emerald-deep dark:text-emerald-400 ring-1 ring-emerald/30'
                  : 'bg-elevated text-mute hover:text-ink'
              }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        <div className="rounded-lg bg-elevated/50 p-3 text-sm text-mute border border-hairline">
          <span className="font-medium text-ink">Contexto:</span>{' '}
          {context.tema || context.titulo || context.frase || context.conteudoOriginal}
          {context.descricao && <span className="block text-xs mt-1 opacity-70">{context.descricao}</span>}
        </div>

        <Button
          variant="brand"
          size="sm"
          onClick={handleGenerate}
          disabled={loading}
          icon={loading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
        >
          {loading ? 'Gerando...' : `Gerar ${activeType?.label || ''}`}
        </Button>

        {result && (
          <div className="relative rounded-xl border border-hairline bg-surface p-4">
            {result.error ? (
              <p className="text-sm text-danger">{result.error}</p>
            ) : (
              <>
                <div className="absolute top-3 right-3 flex gap-1">
                  <button
                    onClick={handleCopy}
                    className="p-1.5 rounded-md text-mute hover:text-ink hover:bg-ink/5 transition-colors"
                    title="Copiar"
                  >
                    {copied ? <Check size={14} className="text-emerald" /> : <Copy size={14} />}
                  </button>
                </div>
                <pre className="text-sm text-body whitespace-pre-wrap font-sans leading-relaxed pr-8">
                  {result.text}
                </pre>
              </>
            )}
          </div>
        )}
      </div>
    </Modal>
  )
}

export function AiButton({ context, title }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="p-1.5 rounded-md text-mute hover:text-emerald hover:bg-emerald/10 transition-colors"
        title="IA — Gerar conteúdo"
      >
        <Sparkles size={14} />
      </button>
      <AiPanel isOpen={open} onClose={() => setOpen(false)} context={context} title={title} />
    </>
  )
}

import { useState } from 'react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { Field, Input } from '../ui/Input'
import { toast } from '../ui/Toast'
import { api } from '../../lib/api'
import { Loader2, CheckCircle, ExternalLink, Image } from 'lucide-react'

export function InstagramPublish({ isOpen, onClose, content }) {
  const [imageUrl, setImageUrl] = useState('')
  const [caption, setCaption] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  if (!content) return null

  async function handlePublish() {
    if (!imageUrl) {
      toast('Adicione a URL da imagem', 'danger')
      return
    }
    if (!caption) {
      toast('Adicione uma legenda', 'danger')
      return
    }

    setLoading(true)
    setResult(null)
    const res = await api.instagramPublish(imageUrl, caption)
    setLoading(false)

    if (res.error) {
      toast(res.error, 'danger')
      setResult({ error: res.error })
    } else {
      toast('Publicado no Instagram!')
      setResult({ success: true, mediaId: res.mediaId })
    }
  }

  const defaultCaption = content.tema || content.titulo || content.frase || ''

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Publicar no Instagram" size="md">
      <div className="space-y-4">
        <div className="rounded-lg bg-elevated/50 p-3 text-sm border border-hairline">
          <span className="font-medium text-ink">Conteúdo:</span>{' '}
          <span className="text-mute">{defaultCaption}</span>
        </div>

        <Field label="URL da Imagem">
          <Input
            value={imageUrl}
            onChange={e => setImageUrl(e.target.value)}
            placeholder="https://... (URL pública da imagem)"
          />
        </Field>

        <Field label="Legenda">
          <textarea
            value={caption}
            onChange={e => setCaption(e.target.value)}
            placeholder="Escreva a legenda do post..."
            className="w-full rounded-lg border border-hairline bg-surface px-4 py-3 text-sm text-ink resize-none focus:outline-none focus:border-emerald focus:ring-2 focus:ring-emerald-50"
            rows={4}
          />
        </Field>

        <div className="flex items-center gap-3 text-xs text-mute">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
          <span>Precisa conectar sua conta do Instagram nas Configurações primeiro.</span>
        </div>

        <Button
          variant="brand"
          size="sm"
          onClick={handlePublish}
          disabled={loading}
          icon={loading ? <Loader2 size={14} className="animate-spin" /> : <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>}
        >
          {loading ? 'Publicando...' : 'Publicar no Instagram'}
        </Button>

        {result?.success && (
          <div className="flex items-center gap-2 text-sm text-emerald">
            <CheckCircle size={16} />
            Publicado com sucesso!
          </div>
        )}
      </div>
    </Modal>
  )
}

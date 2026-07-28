import { useState, useRef } from 'react'
import { api } from '../../lib/api'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { toast } from '../../components/ui/Toast'
import { Upload, FileText, Download, Loader2, AlertCircle, CheckCircle, Search, X } from 'lucide-react'

export function MineracaoPage() {
  const [transcricao, setTranscricao] = useState('')
  const [loading, setLoading] = useState(false)
  const [resultado, setResultado] = useState(null)
  const [fileName, setFileName] = useState('')
  const fileInputRef = useRef(null)

  function handleFileUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = (ev) => {
      setTranscricao(ev.target?.result || '')
    }
    reader.readAsText(file)
  }

  function clearFile() {
    setFileName('')
    setTranscricao('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  async function handleAnalisar() {
    if (!transcricao.trim()) {
      toast('Cole uma transcrição ou faça upload de um arquivo .txt', 'error')
      return
    }

    setLoading(true)
    setResultado(null)

    const res = await api.mineracaoAnalisar(transcricao)

    if (res.error) {
      toast(res.error, 'error')
      setLoading(false)
      return
    }

    setResultado(res)
    setLoading(false)

    if (res.segmentos?.length > 0) {
      toast(`${res.totalCortes} cortes encontrados!`, 'success')
    } else if (res.aviso) {
      toast(res.aviso, 'error')
    }
  }

  function handleDownload() {
    if (!resultado?.fcpxml) return

    const blob = new Blob([resultado.fcpxml], { type: 'application/xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = resultado.filename || 'projeto-mineracao.xml'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast('Arquivo baixado! Importe no Premiere via File > Import.', 'success')
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-heading-lg text-ink">Mineração de Conteúdo</h1>
        <p className="text-sm text-mute mt-1">
          Cole a transcrição do vídeo (com timecodes) e a IA identifica os melhores cortes para você.
        </p>
      </div>

      <Card className="mb-6">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.srt,.vtt,.csv"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button variant="secondary" size="sm" icon={<Upload size={14} />} onClick={() => fileInputRef.current?.click()}>
                Upload .txt
              </Button>
            </label>
            {fileName && (
              <span className="flex items-center gap-2 text-xs text-mute">
                <FileText size={14} />
                {fileName}
                <button onClick={clearFile} className="text-mute hover:text-ink transition-colors">
                  <X size={14} />
                </button>
              </span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-ink mb-1.5">
              Transcrição (com timecodes)
            </label>
            <textarea
              value={transcricao}
              onChange={(e) => setTranscricao(e.target.value)}
              placeholder={`Cole aqui sua transcrição com timecodes...
Exemplo:
[00:00:00] Introdução ao tema de hoje
[00:00:15] Primeiro ponto importante que vamos abordar
[00:01:30] Essa é a dica que vai mudar seus resultados...`}
              className="w-full h-48 rounded-lg border border-hairline bg-surface text-ink px-4 py-3 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-emerald/40 placeholder:text-faint"
            />
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="brand"
              size="md"
              onClick={handleAnalisar}
              disabled={loading || !transcricao.trim()}
              icon={loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
            >
              {loading ? 'Analisando...' : 'Analisar Cortes'}
            </Button>
            {resultado?.segmentos?.length > 0 && (
              <Button
                variant="primary"
                size="md"
                onClick={handleDownload}
                icon={<Download size={16} />}
              >
                Baixar Projeto Premiere
              </Button>
            )}
          </div>
        </div>
      </Card>

      {resultado?.aviso && (
        <div className="flex items-start gap-3 p-4 rounded-lg bg-amber/10 border border-amber/20 mb-6">
          <AlertCircle size={18} className="text-amber shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800 dark:text-amber-200">{resultado.aviso}</p>
        </div>
      )}

      {resultado?.segmentos?.length > 0 && (
        <>
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle size={18} className="text-emerald" />
            <span className="text-sm text-ink font-medium">
              {resultado.totalCortes} cortes encontrados
            </span>
          </div>

          <div className="space-y-2">
            {resultado.segmentos.map((seg, i) => (
              <Card key={i} className="!p-4">
                <div className="flex items-start gap-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald/10 text-emerald text-sm font-bold shrink-0">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-xs font-mono text-emerald font-medium bg-emerald/5 px-2 py-0.5 rounded">
                        {seg.inicio} — {seg.fim}
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-ink truncate">{seg.titulo}</h3>
                    <p className="text-xs text-mute mt-0.5">{seg.descricao}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-6 flex justify-center">
            <Button
              variant="primary"
              size="lg"
              onClick={handleDownload}
              icon={<Download size={16} />}
            >
              Baixar Projeto Premiere (.xml)
            </Button>
          </div>

          <div className="mt-4 p-4 rounded-lg bg-surface border border-hairline">
            <p className="text-xs text-mute">
              <strong className="text-ink">Como usar no Premiere Pro:</strong>
              {' '}File {'>'} Import {'>'} Selecione o arquivo .xml baixado {'>'} Os marcadores aparecerão na timeline.
            </p>
          </div>
        </>
      )}

      {resultado && resultado.segmentos?.length === 0 && !resultado.aviso && (
        <Card>
          <div className="text-center py-8">
            <Search size={32} className="mx-auto text-faint mb-2" />
            <p className="text-sm text-mute">Nenhum corte identificado. Verifique se a transcrição contém timecodes.</p>
          </div>
        </Card>
      )}
    </div>
  )
}

import { useState, useRef } from 'react'
import { api } from '../../lib/api'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { toast } from '../../components/ui/Toast'
import { Upload, FileText, Download, Loader2, AlertCircle, CheckCircle, Search, X, FileType, Send, Bot, User } from 'lucide-react'

export function MineracaoPage() {
  const [transcricao, setTranscricao] = useState('')
  const [loading, setLoading] = useState(false)
  const [resultado, setResultado] = useState(null)
  const [fileName, setFileName] = useState('')
  const [chatMsg, setChatMsg] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const [chatHistory, setChatHistory] = useState([])
  const fileInputRef = useRef(null)
  const chatEndRef = useRef(null)

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

  function downloadFile(content, filename, type) {
    const blob = new Blob([content], { type })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  function handleDownloadXMEML() {
    if (!resultado?.xmeml) return
    downloadFile(resultado.xmeml, 'cortes_premium_premiere.xml', 'application/xml')
    toast('XML baixado! Importe no Premiere: File > Import > selecione o .xml', 'success')
  }

  function handleDownloadCSV() {
    if (!resultado?.csv) return
    downloadFile(resultado.csv, 'marcadores-premiere.csv', 'text/csv')
    toast('CSV baixado! Importe no Premiere: File > Import > selecione o .csv', 'success')
  }

  async function handleChat() {
    if (!chatMsg.trim()) return
    const userMsg = chatMsg.trim()
    setChatMsg('')
    setChatHistory(h => [...h, { role: 'user', content: userMsg }])
    setChatLoading(true)

    const context = {
      tipo: 'mineracao',
      transcricao: transcricao.substring(0, 3000),
      segmentos: resultado?.segmentos?.map(s => `${s.inicio}-${s.fim}: ${s.titulo}`).join('; ') || '',
    }

    const res = await api.ai('chat', context, userMsg)
    const reply = res?.text || res?.error || 'Erro ao processar resposta'
    setChatHistory(h => [...h, { role: 'assistant', content: reply }])
    setChatLoading(false)
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
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
              <div className="flex items-center gap-2">
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleDownloadXMEML}
                  icon={<Download size={16} />}
                >
                  Projeto Premiere (.xml)
                </Button>
                <Button
                  variant="secondary"
                  size="md"
                  onClick={handleDownloadCSV}
                  icon={<FileType size={16} />}
                >
                  Marcadores (.csv)
                </Button>
              </div>
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

          <div className="mt-6 flex justify-center gap-3 flex-wrap">
            <Button
              variant="primary"
              size="lg"
              onClick={handleDownloadXMEML}
              icon={<Download size={16} />}
            >
              Baixar Projeto Premiere (.xml)
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={handleDownloadCSV}
              icon={<FileType size={16} />}
            >
              Baixar Marcadores (.csv)
            </Button>
          </div>

          <div className="mt-4 p-4 rounded-lg bg-surface border border-hairline space-y-2">
            <p className="text-xs text-mute">
              <strong className="text-ink">Opção 1 — Projeto (.xml):</strong>
              {' '}File {'>'} Import {'>'} Selecione o .xml {'>'} Os marcadores aparecerão na timeline.
            </p>
            <p className="text-xs text-mute">
              <strong className="text-ink">Opção 2 — Marcadores (.csv):</strong>
              {' '}File {'>'} Import {'>'} Selecione o .csv {'>'} Arraste os marcadores para a timeline.
            </p>
          </div>

          <Card className="mt-8">
            <div className="flex items-center gap-2 mb-4">
              <Bot size={18} className="text-emerald" />
              <h2 className="text-sm font-semibold text-ink">Converse com a IA sobre os cortes</h2>
            </div>

            {chatHistory.length > 0 && (
              <div className="mb-4 space-y-3 max-h-80 overflow-y-auto">
                {chatHistory.map((msg, i) => (
                  <div key={i} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                    {msg.role === 'assistant' && <Bot size={16} className="text-emerald shrink-0 mt-1" />}
                    <div className={`rounded-lg px-3 py-2 text-sm max-w-[85%] ${
                      msg.role === 'user'
                        ? 'bg-emerald/10 text-ink'
                        : 'bg-surface border border-hairline text-ink'
                    }`}>
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    </div>
                    {msg.role === 'user' && <User size={16} className="text-mute shrink-0 mt-1" />}
                  </div>
                ))}
                {chatLoading && (
                  <div className="flex items-start gap-3">
                    <Bot size={16} className="text-emerald shrink-0 mt-1" />
                    <div className="rounded-lg px-3 py-2 text-sm bg-surface border border-hairline text-mute">
                      <Loader2 size={14} className="animate-spin inline mr-1" />
                      Pensando...
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
            )}

            <div className="flex items-center gap-2">
              <input
                value={chatMsg}
                onChange={(e) => setChatMsg(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleChat())}
                placeholder="Pergunte algo sobre os cortes..."
                disabled={chatLoading}
                className="flex-1 rounded-lg border border-hairline bg-bg text-ink px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald/40 placeholder:text-faint disabled:opacity-50"
              />
              <Button
                variant="primary"
                size="sm"
                onClick={handleChat}
                disabled={chatLoading || !chatMsg.trim()}
                icon={chatLoading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
              >
                Enviar
              </Button>
            </div>
          </Card>
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

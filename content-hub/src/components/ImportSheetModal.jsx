import { useState } from 'react'
import { Modal } from './ui/Modal'
import { Button } from './ui/Button'
import { toast } from './ui/Toast'
import { useCollection } from '../store/useStore'
import { ClipboardPaste, Table, Upload } from 'lucide-react'

const COLLECTION_MAP = {
  videosLongos: {
    label: 'Vídeos Longos',
    aliases: ['tema', 'categoria', 'ondequem', 'onde/quem', 'onde', 'quem', 'descricao', 'linkfinalizado', 'link', 'thumb', 'gravado', 'editado', 'aprovado', 'publicado'],
    fields: ['tema', 'categoria', 'ondeQuem', 'descricao', 'linkFinalizado', 'thumb', 'gravado', 'editado', 'aprovado', 'publicado'],
  },
  videosCurtos: {
    label: 'Vídeos Curtos',
    aliases: ['titulo', 'título', 'categoria', 'linkfinalizado', 'link', 'editado', 'aprovado', 'publicado'],
    fields: ['titulo', 'categoria', 'linkFinalizado', 'editado', 'aprovado', 'publicado'],
  },
  cortes: {
    label: 'Cortes',
    aliases: ['titulo', 'título', 'conteudooriginal', 'conteudo original', 'conteudo', 'observacao', 'observação', 'titulomelhor', 'titulo melhor', 'linkfinalizado', 'link', 'editado', 'aprovado'],
    fields: ['titulo', 'conteudoOriginal', 'observacao', 'tituloMelhor', 'linkFinalizado', 'editado', 'aprovado'],
  },
  frases: {
    label: 'Frases',
    aliases: ['frase', 'visualizacoes', 'visualizações', 'interacoes', 'interações', 'atividadeperfil', 'atividade perfil', 'novosseguidores', 'novos seguidores'],
    fields: ['frase', 'visualizacoes', 'interacoes', 'atividadePerfil', 'novosSeguidores'],
  },
}

function detectCollection(headers) {
  const h = headers.map(h => h.toLowerCase().trim())
  let best = null
  let bestScore = 0

  for (const [key, col] of Object.entries(COLLECTION_MAP)) {
    const score = col.aliases.filter(a => h.some(header => header.includes(a))).length
    if (score > bestScore) {
      bestScore = score
      best = key
    }
  }

  return best
}

const DEFAULT_HEADERS_BY_COUNT = {
  8: ['gravado', 'editado', 'aprovado', 'publicado', 'categoria', 'ondeQuem', 'tema', 'linkFinalizado'],
  6: ['editado', 'aprovado', 'publicado', 'categoria', 'titulo', 'linkFinalizado'],
  5: ['editado', 'aprovado', 'publicado', 'categoria', 'titulo'],
  4: ['editado', 'aprovado', 'titulo', 'linkFinalizado'],
  3: ['editado', 'aprovado', 'titulo'],
  2: ['frase', 'visualizacoes'],
}

function looksLikeHeaderRow(values) {
  const bools = ['true', 'false', 'sim', 'não', 'nao', 'yes', 'no']
  const headerCount = values.filter(v => {
    const lv = v.toLowerCase().trim()
    return !bools.includes(lv) && !/^https?:\/\//.test(lv) && !/^\d+$/.test(lv) && lv.length > 0
  }).length
  return headerCount >= values.length * 0.5
}

function parsePastedData(text) {
  const lines = text.trim().split('\n').filter(Boolean)
  if (lines.length < 2) return null

  const separator = lines[0].includes('\t') ? '\t' : ','
  const firstRow = lines[0].split(separator).map(v => v.trim().replace(/^"|"$/g, ''))

  let headers
  let dataStart = 0

  if (looksLikeHeaderRow(firstRow)) {
    headers = firstRow
    dataStart = 1
  } else {
    const count = firstRow.length
    headers = DEFAULT_HEADERS_BY_COUNT[count] || Array.from({ length: count }, (_, i) => `coluna${i + 1}`)
    dataStart = 0
  }

  const rows = []
  for (let i = dataStart; i < lines.length; i++) {
    const vals = lines[i].split(separator).map(v => v.trim().replace(/^"|"$/g, ''))
    if (vals.length === 1 && !vals[0]) continue
    const row = {}
    headers.forEach((h, idx) => {
      row[h] = vals[idx] !== undefined ? vals[idx] : ''
    })
    rows.push(row)
  }

  return { headers, rows }
}

function toBool(val) {
  if (typeof val === 'boolean') return val
  const v = String(val).toLowerCase().trim()
  return v === 'true' || v === 'sim' || v === 'yes' || v === '1'
}

function mapRowToCollection(collection, row) {
  const item = {}
  const h = Object.keys(row).reduce((acc, k) => {
    acc[k.toLowerCase().trim()] = row[k]
    return acc
  }, {})

  COLLECTION_MAP[collection].aliases.forEach((alias, idx) => {
    const field = COLLECTION_MAP[collection].fields[idx] || alias
    const matchedKey = Object.keys(h).find(k => k.includes(alias))
    if (matchedKey) {
      item[field] = h[matchedKey]
    }
  })

  const boolFields = ['gravado', 'editado', 'aprovado', 'publicado']

  if (collection === 'videosLongos') {
    if (!item.categoria) item.categoria = ''
    if (!item.ondeQuem) item.ondeQuem = ''
    if (!item.descricao) item.descricao = ''
    if (!item.linkFinalizado) item.linkFinalizado = ''
    if (!item.thumb) item.thumb = ''
    boolFields.forEach(f => { item[f] = toBool(item[f]) })
  } else if (collection === 'videosCurtos') {
    if (!item.categoria) item.categoria = ''
    if (!item.linkFinalizado) item.linkFinalizado = ''
    ;['editado', 'aprovado', 'publicado'].forEach(f => { item[f] = toBool(item[f]) })
  } else if (collection === 'cortes') {
    if (!item.conteudoOriginal) item.conteudoOriginal = ''
    if (!item.observacao) item.observacao = ''
    if (!item.tituloMelhor) item.tituloMelhor = ''
    if (!item.linkFinalizado) item.linkFinalizado = ''
    ;['editado', 'aprovado'].forEach(f => { item[f] = toBool(item[f]) })
  } else if (collection === 'frases') {
    item.visualizacoes = Number(item.visualizacoes) || 0
    item.interacoes = Number(item.interacoes) || 0
    item.atividadePerfil = Number(item.atividadePerfil) || 0
    item.novosSeguidores = Number(item.novosSeguidores) || 0
  }

  return item
}

export function ImportSheetModal({ isOpen, onClose }) {
  const [text, setText] = useState('')
  const [parsed, setParsed] = useState(null)
  const [detected, setDetected] = useState(null)
  const [selectedCollection, setSelectedCollection] = useState(null)
  const [importing, setImporting] = useState(false)

  const { addItem: addLongo } = useCollection('videosLongos')
  const { addItem: addCurto } = useCollection('videosCurtos')
  const { addItem: addCorte } = useCollection('cortes')
  const { addItem: addFrase } = useCollection('frases')

  const adders = {
    videosLongos: addLongo,
    videosCurtos: addCurto,
    cortes: addCorte,
    frases: addFrase,
  }

  function handlePaste() {
    if (!text.trim()) {
      toast('Cole os dados primeiro', 'danger')
      return
    }

    const result = parsePastedData(text)
    if (!result || result.rows.length === 0) {
      toast('Não foi possível interpretar os dados. Copie uma tabela do Sheets.', 'danger')
      return
    }

    setParsed(result)
    const detectedKey = detectCollection(result.headers)
    setDetected(detectedKey)
    setSelectedCollection(detectedKey)
  }

  function handleImport() {
    if (!parsed || !selectedCollection) return

    setImporting(true)
    const add = adders[selectedCollection]
    let count = 0
    const errors = []

    parsed.rows.forEach((row, idx) => {
      try {
        const item = mapRowToCollection(selectedCollection, row)

        if (selectedCollection === 'videosLongos' && !item.tema) {
          errors.push(`Linha ${idx + 2}: sem tema`)
          return
        }
        if (selectedCollection === 'videosCurtos' && !item.titulo) {
          errors.push(`Linha ${idx + 2}: sem título`)
          return
        }
        if (selectedCollection === 'cortes' && !item.titulo) {
          errors.push(`Linha ${idx + 2}: sem título`)
          return
        }
        if (selectedCollection === 'frases' && !item.frase) {
          errors.push(`Linha ${idx + 2}: sem frase`)
          return
        }

        add(item)
        count++
      } catch (e) {
        errors.push(`Linha ${idx + 2}: ${e.message}`)
      }
    })

    setImporting(false)

    if (count > 0) {
      toast(`${count} ${COLLECTION_MAP[selectedCollection].label} importados com sucesso!`)
    }
    if (errors.length > 0) {
      toast(`${errors.length} erro(s) — ${errors[0]}`, 'danger')
    }

    setText('')
    setParsed(null)
    setDetected(null)
    setSelectedCollection(null)
    onClose()
  }

  function handleClose() {
    setText('')
    setParsed(null)
    setDetected(null)
    setSelectedCollection(null)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Importar do Google Sheets" size="lg">
      <div className="space-y-4">
        <p className="text-sm text-body leading-relaxed">
          Copie a tabela do Google Sheets (<strong>Ctrl+C / Cmd+C</strong>) e cole abaixo.
          O sistema vai detectar automaticamente o tipo de conteúdo.
        </p>

        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Cole aqui os dados copiados do Google Sheets..."
          rows={8}
          className="w-full rounded-xl border border-hairline bg-elevated/50 px-4 py-3 text-sm text-ink placeholder:text-faint focus:outline-none focus:ring-2 focus:ring-emerald/40 custom-scrollbar resize-y font-mono"
        />

        {!parsed && (
          <div className="flex justify-end gap-3">
            <Button variant="ghost" size="sm" onClick={handleClose}>Cancelar</Button>
            <Button
              variant="brand"
              size="sm"
              onClick={handlePaste}
              icon={<ClipboardPaste size={16} />}
              disabled={!text.trim()}
            >
              Interpretar Dados
            </Button>
          </div>
        )}

        {parsed && (
          <div className="space-y-4 border-t border-hairline pt-4">
            {/* Detection */}
            <div className="rounded-xl border border-hairline bg-elevated/50 p-4">
              <div className="flex items-center gap-3 mb-3">
                <Table size={18} className="text-emerald" />
                <span className="text-sm font-semibold text-ink">
                  {parsed.rows.length} linha(s) detectadas
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="text-xs text-mute font-medium">Tipo detectado:</span>
                {Object.entries(COLLECTION_MAP).map(([key, col]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedCollection(key)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all border ${
                      selectedCollection === key
                        ? 'bg-emerald/10 text-emerald-deep border-emerald/30 dark:text-emerald-400'
                        : 'text-mute border-hairline hover:text-ink hover:bg-ink/5'
                    }`}
                  >
                    {col.label}
                  </button>
                ))}
              </div>

              {detected && selectedCollection && detected !== selectedCollection && (
                <p className="text-xs text-warning">Sugestão automática: {COLLECTION_MAP[detected].label}</p>
              )}

              {/* Preview table */}
              <div className="overflow-x-auto rounded-lg border border-hairline max-h-48 overflow-y-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-elevated border-b border-hairline">
                      {parsed.headers.map((h, i) => (
                        <th key={i} className="px-3 py-2 text-left font-semibold text-mute whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {parsed.rows.slice(0, 20).map((row, ri) => (
                      <tr key={ri} className="border-b border-hairline-soft hover:bg-elevated/30">
                        {parsed.headers.map((h, ci) => (
                          <td key={ci} className="px-3 py-2 text-body truncate max-w-[200px]">{row[h]}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {parsed.rows.length > 20 && (
                <p className="text-xs text-mute mt-2">Mostrando 20 de {parsed.rows.length} linhas</p>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="ghost" size="sm" onClick={handleClose}>Cancelar</Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleImport}
                icon={importing ? null : <Upload size={16} />}
                disabled={!selectedCollection || importing}
              >
                {importing ? 'Importando...' : `Importar ${parsed.rows.length} ${COLLECTION_MAP[selectedCollection]?.label || ''}`}
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}

import { useState } from 'react'
import { FileSpreadsheet, Check, AlertCircle, Trash2, ArrowRight } from 'lucide-react'
import { Button } from './ui/Button'

export function parseGoogleSheetsTSV(rawText) {
  if (!rawText || !rawText.trim()) return []

  const lines = rawText
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => line.length > 0)

  if (lines.length === 0) return []

  // Split first row by tabs to check for headers
  const firstRowCols = lines[0].split('\t').map(c => c.trim().toLowerCase())
  const hasHeader = firstRowCols.some(c =>
    c.includes('status') ||
    c.includes('editor') ||
    c.includes('grava') ||
    c.includes('nome') ||
    c.includes('link') ||
    c.includes('arquivo')
  )

  const dataLines = hasHeader ? lines.slice(1) : lines

  return dataLines.map((line, idx) => {
    const cols = line.split('\t').map(c => c.trim())
    
    // Position mapping matching standard layout:
    // A: Status | B: Editor | C: Gravação | D: Tag/Extra | E: Nome arquivo | F: Link pasta base | G: Arquivo Finalizado
    let status = cols[0] || 'Fila'
    let editor = cols[1] || ''
    let gravacao = cols[2] || ''
    let tag = cols[3] || ''
    let nomeArquivo = cols[4] || ''
    let linkPastaBase = cols[5] || ''
    let arquivoFinalizado = cols[6] || ''

    // If only 5 columns were pasted (no extra tag col D):
    if (cols.length === 5) {
      status = cols[0] || 'Fila'
      editor = cols[1] || ''
      gravacao = cols[2] || ''
      tag = ''
      nomeArquivo = cols[3] || ''
      linkPastaBase = cols[4] || ''
      arquivoFinalizado = ''
    }

    // Capitalize Status nicely
    if (status.toLowerCase().includes('final')) status = 'Finalizado'
    else if (status.toLowerCase().includes('edi')) status = 'Em Edição'
    else if (status.toLowerCase().includes('revis')) status = 'Revisão'
    else status = 'Fila'

    return {
      id: `imported-${Date.now()}-${idx}-${Math.random().toString(36).substr(2, 4)}`,
      status,
      editor,
      gravacao,
      tag,
      nomeArquivo: nomeArquivo || `Criativo #${idx + 1}`,
      linkPastaBase,
      arquivoFinalizado,
      createdAt: new Date().toISOString(),
    }
  })
}

export function ImportCriativosSheetModal({ isOpen, onClose, onImport }) {
  const [pasteText, setPasteText] = useState('')
  const [importMode, setImportMode] = useState('append') // 'append' | 'replace'
  const [previewData, setPreviewData] = useState([])
  const [errorMsg, setErrorMsg] = useState('')

  if (!isOpen) return null

  const handleParse = (text) => {
    setPasteText(text)
    setErrorMsg('')
    try {
      const parsed = parseGoogleSheetsTSV(text)
      setPreviewData(parsed)
    } catch (err) {
      setErrorMsg('Erro ao processar dados da planilha. Verifique a colagem.')
      setPreviewData([])
    }
  }

  const handleConfirmImport = () => {
    if (previewData.length === 0) return
    onImport(previewData, importMode)
    setPasteText('')
    setPreviewData([])
    onClose()
  }

  return (
    <div className="modal-backdrop flex items-center justify-center p-4">
      <div className="modal-content relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl border border-hairline bg-surface p-6 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-hairline shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald/10 text-emerald-deep dark:text-emerald-400">
              <FileSpreadsheet size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-ink">Importar do Google Sheets</h2>
              <p className="text-xs text-mute">Copie as linhas da sua planilha e cole abaixo para importar em lote</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-mute hover:bg-ink/5 hover:text-ink transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar py-5 flex flex-col gap-6">
          
          {/* Instruções */}
          <div className="rounded-xl border border-hairline bg-elevated/40 p-4 text-xs text-mute space-y-2">
            <p className="font-semibold text-ink flex items-center gap-2">
              <Check size={14} className="text-emerald" /> Como importar seus criativos:
            </p>
            <ol className="list-decimal list-inside space-y-1 pl-1">
              <li>Abra sua planilha no Google Sheets ou Excel.</li>
              <li>Selecione as linhas desejadas (incluindo ou não os cabeçalhos).</li>
              <li>Pressione <kbd className="px-1.5 py-0.5 rounded bg-surface border border-hairline text-ink font-mono">Ctrl + C</kbd> (ou <kbd className="px-1.5 py-0.5 rounded bg-surface border border-hairline text-ink font-mono">Cmd + C</kbd>).</li>
              <li>Cole no campo abaixo. O app identificará automaticamente colunas de <strong>Status, Editor, Gravação, Tag, Nome do Arquivo, Link Pasta Base e Arquivo Finalizado</strong>.</li>
            </ol>
          </div>

          {/* Textarea */}
          <div>
            <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-2">
              Cole aqui os dados copiados (Tab Separated):
            </label>
            <textarea
              rows={5}
              value={pasteText}
              onChange={(e) => handleParse(e.target.value)}
              placeholder="Cole aqui (ex: Fila    Ruan    Gravação 10/07    Máquina    Título do Criativo...)"
              className="w-full rounded-xl border border-hairline bg-surface p-3 text-xs font-mono text-ink placeholder:text-faint focus:border-emerald focus:outline-none focus:ring-1 focus:ring-emerald custom-scrollbar resize-none"
            />
            {errorMsg && (
              <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
                <AlertCircle size={14} /> {errorMsg}
              </p>
            )}
          </div>

          {/* Pré-visualização */}
          {previewData.length > 0 && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-ink flex items-center gap-2">
                  Pré-visualização dos Dados ({previewData.length} itens encontrados)
                </h3>
                <div className="flex items-center gap-4 text-xs">
                  <label className="flex items-center gap-1.5 text-mute cursor-pointer">
                    <input
                      type="radio"
                      name="importMode"
                      value="append"
                      checked={importMode === 'append'}
                      onChange={() => setImportMode('append')}
                      className="accent-emerald"
                    />
                    Adicionar aos atuais
                  </label>
                  <label className="flex items-center gap-1.5 text-mute cursor-pointer">
                    <input
                      type="radio"
                      name="importMode"
                      value="replace"
                      checked={importMode === 'replace'}
                      onChange={() => setImportMode('replace')}
                      className="accent-emerald"
                    />
                    Substituir lista existente
                  </label>
                </div>
              </div>

              <div className="max-h-[240px] overflow-auto rounded-xl border border-hairline bg-surface custom-scrollbar">
                <table className="w-full text-left text-xs">
                  <thead className="sticky top-0 bg-elevated border-b border-hairline text-faint font-semibold uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="px-3 py-2">Status</th>
                      <th className="px-3 py-2">Editor</th>
                      <th className="px-3 py-2">Gravação</th>
                      <th className="px-3 py-2">Tag</th>
                      <th className="px-3 py-2">Nome Arquivo</th>
                      <th className="px-3 py-2">Link Pasta Base</th>
                      <th className="px-3 py-2">Arquivo Finalizado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-hairline text-ink">
                    {previewData.map((item, i) => (
                      <tr key={item.id || i} className="hover:bg-elevated/40 transition-colors">
                        <td className="px-3 py-2">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            item.status === 'Finalizado' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' :
                            item.status === 'Em Edição' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20' :
                            'bg-neutral-500/10 text-mute border border-hairline'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-mute">{item.editor || '—'}</td>
                        <td className="px-3 py-2 text-mute font-mono text-[11px]">{item.gravacao || '—'}</td>
                        <td className="px-3 py-2">
                          {item.tag ? (
                            <span className="px-1.5 py-0.5 rounded bg-emerald/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-semibold">
                              {item.tag}
                            </span>
                          ) : '—'}
                        </td>
                        <td className="px-3 py-2 font-medium max-w-[220px] truncate" title={item.nomeArquivo}>
                          {item.nomeArquivo}
                        </td>
                        <td className="px-3 py-2 text-faint font-mono text-[10px] max-w-[120px] truncate">
                          {item.linkPastaBase || '—'}
                        </td>
                        <td className="px-3 py-2 text-faint font-mono text-[10px] max-w-[120px] truncate">
                          {item.arquivoFinalizado || '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-hairline shrink-0">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Cancelar
          </Button>
          <div className="flex items-center gap-3">
            {previewData.length > 0 && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => { setPasteText(''); setPreviewData([]); }}
                icon={<Trash2 size={14} />}
              >
                Limpar
              </Button>
            )}
            <Button
              variant="primary"
              size="sm"
              disabled={previewData.length === 0}
              onClick={handleConfirmImport}
              icon={<ArrowRight size={16} />}
            >
              Importar {previewData.length > 0 ? `${previewData.length} Criativos` : ''}
            </Button>
          </div>
        </div>

      </div>
    </div>
  )
}

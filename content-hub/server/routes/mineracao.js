import { Router } from 'express'

export const mineracaoRouter = Router()

const OPENAI_API = 'https://api.openai.com/v1/chat/completions'
const ANTHROPIC_API = 'https://api.anthropic.com/v1/messages'

async function callClaude(messages, systemPrompt) {
  const key = process.env.ANTHROPIC_API_KEY || ''
  if (!key) return null

  try {
    const res = await fetch(ANTHROPIC_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2000,
        system: systemPrompt,
        messages: messages.map(m => ({
          role: m.role === 'system' ? 'user' : m.role,
          content: m.content,
        })),
      }),
    })

    if (!res.ok) {
      const errText = await res.text()
      console.warn('Claude API Error:', errText)
      return null
    }

    const data = await res.json()
    return { text: data.content[0]?.text?.trim() }
  } catch (err) {
    console.error('Claude API call failed:', err)
    return null
  }
}

async function callOpenAI(messages, systemPrompt) {
  const key = process.env.OPENAI_API_KEY || ''
  if (!key) return null

  try {
    const res = await fetch(OPENAI_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'system', content: systemPrompt }, ...messages],
        max_tokens: 2000,
      }),
    })

    if (!res.ok) return null
    const data = await res.json()
    return { text: data.choices[0]?.message?.content?.trim() }
  } catch (err) {
    return null
  }
}

const SYSTEM_PROMPT = `Você é um analista de conteúdo especializado em identificar os melhores cortes e ganchos em transcrições de vídeo.

A transcrição fornecida contém timecodes no formato [HH:MM:SS] ou similar.

Sua tarefa é:
1. Analisar toda a transcrição
2. Identificar OS MELHORES MOMENTOS para cortes — priorize:
   - Hooks e aberturas fortes (primeiros segundos de cada bloco)
   - Momentos de alto valor informativo (dicas, estratégias, dados)
   - Pontos de virada ou transições importantes
   - Frases de impacto que geram engajamento
   - Inícios de novos tópicos relevantes

3. Retorne APENAS um array JSON válido com objetos contendo:
   - "inicio": string do timecode de início (ex: "00:01:23")
   - "fim": string do timecode de fim (ex: "00:01:45")
   - "titulo": string com título descritivo do corte (máx 60 chars)
   - "descricao": string explicando por que esse trecho é bom (máx 120 chars)

REGRAS:
- Extraia entre 5 e 15 cortes no máximo
- Os timecodes DEVEM vir da transcrição original, não invente
- Se não houver timecodes, retorne array vazio
- Retorne SOMENTE o JSON, sem markdown, sem comentários

Exemplo de resposta:
[{"inicio":"00:02:15","fim":"00:02:35","titulo":"Hook: O erro que todo criador comete","descricao":"Abertura forte com gatilho de curiosidade"},{"inicio":"00:05:00","fim":"00:05:20","titulo":"Dica: Como organizar o conteúdo","descricao":"Momento de alto valor educativo com passo a passo"}]`

function gerarFCPXML(segmentos, nomeVideo = 'Transcrição') {
  const videoDuration = segmentos.length > 0
    ? segmentos.reduce((max, s) => Math.max(max, timecodeToSeconds(s.fim)), 0) + 60
    : 3600

  const markersXML = segmentos.map((seg, i) => {
    const startSec = timecodeToSeconds(seg.inicio)
    return `            <marker start="${startSec}s" duration="1s" value="Corte ${i + 1}: ${escapeXml(seg.titulo)}" note="${escapeXml(seg.descricao)}"/>`
  }).join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE fcpxml>
<fcpxml version="1.10">
  <resources>
    <format id="r1" name="FFVideoFormatRate30" frameDuration="1001/30000s" width="1920" height="1080"/>
  </resources>
  <library>
    <event name="Mineração de Conteúdo">
      <project name="Projeto - ${escapeXml(nomeVideo)}">
        <sequence>
          <spine>
            <gap name="Timeline" offset="0s" duration="${videoDuration}s">
${markersXML}
            </gap>
          </spine>
        </sequence>
      </project>
    </event>
  </library>
</fcpxml>`
}

function timecodeToSeconds(tc) {
  if (!tc) return 0
  const parts = tc.replace(/[\[\]]/g, '').split(/[:,;]/)
  if (parts.length >= 3) {
    const h = parseInt(parts[0], 10) || 0
    const m = parseInt(parts[1], 10) || 0
    const s = parseInt(parts[2], 10) || 0
    return h * 3600 + m * 60 + s
  }
  return 0
}

function escapeXml(str) {
  if (!str) return ''
  return str.replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

mineracaoRouter.post('/analisar', async (req, res) => {
  const { transcricao } = req.body

  if (!transcricao || transcricao.trim().length < 20) {
    return res.status(400).json({ error: 'Transcrição muito curta. Cole pelo menos 20 caracteres.' })
  }

  const userMessage = { role: 'user', content: `Analise esta transcrição e identifique os melhores cortes:\n\n${transcricao}` }

  let result = await callClaude([userMessage], SYSTEM_PROMPT)
  if (!result) {
    result = await callOpenAI([userMessage], SYSTEM_PROMPT)
  }

  if (!result) {
    return res.status(503).json({
      error: 'Serviço de IA indisponível. Configure as chaves ANTHROPIC_API_KEY ou OPENAI_API_KEY no servidor.',
      simulated: gerarSimulacao(transcricao),
    })
  }

  try {
    const jsonStr = result.text.replace(/```json\s*/gi, '').replace(/```\s*$/, '').trim()
    const segmentos = JSON.parse(jsonStr)

    if (!Array.isArray(segmentos) || segmentos.length === 0) {
      return res.json({
        segmentos: [],
        aviso: 'Nenhum corte identificado. A transcrição pode não conter timecodes válidos.',
      })
    }

    const nomeVideo = transcricao.split('\n')[0]?.substring(0, 60) || 'Transcrição'
    const fcpxml = gerarFCPXML(segmentos, nomeVideo)

    res.json({
      segmentos,
      fcpxml,
      filename: `projeto-mineracao-${Date.now()}.xml`,
      totalCortes: segmentos.length,
    })
  } catch (e) {
    console.error('Erro ao parsear resposta da IA:', e)
    console.log('Raw response:', result.text)
    const fallback = gerarSimulacao(transcricao)
    res.json({
      segmentos: fallback,
      fcpxml: gerarFCPXML(fallback),
      filename: `projeto-mineracao-${Date.now()}.xml`,
      totalCortes: fallback.length,
      aviso: 'Resposta da IA teve formato inesperado. Usei análise simulada como fallback.',
    })
  }
})

function gerarSimulacao(transcricao) {
  const linhas = transcricao.split('\n').filter(l => l.trim())
  const segmentos = []
  const timecodeRegex = /(?:\[?)(\d{1,2}:\d{2}(?::\d{2})?)(?:]?\s*-\s*(?:\[?)(\d{1,2}:\d{2}(?::\d{2})?)(?:]?)?)?/

  for (const linha of linhas) {
    const match = linha.match(timecodeRegex)
    if (match && segmentos.length < 8) {
      const inicio = match[1]
      const fim = match[2] || incrementTimecode(inicio, 20)
      const texto = linha.replace(timecodeRegex, '').trim().substring(0, 80)
      if (texto.length > 5) {
        segmentos.push({
          inicio,
          fim,
          titulo: texto.substring(0, 55) + (texto.length > 55 ? '...' : ''),
          descricao: 'Trecho identificado com potencial para corte.',
        })
      }
    }
  }

  if (segmentos.length === 0) {
    const text = transcricao.replace(/[\[\]\d:;,.-]+/g, '').trim()
    const words = text.split(/\s+/).filter(w => w.length > 2)
    for (let i = 0; i < Math.min(5, words.length); i += 3) {
      const chunk = words.slice(i, i + 8).join(' ')
      if (chunk.length > 10) {
        segmentos.push({
          inicio: `00:0${Math.floor(i / 3) + 1}:00`,
          fim: `00:0${Math.floor(i / 3) + 1}:30`,
          titulo: chunk.substring(0, 55),
          descricao: 'Potencial ponto de interesse identificado.',
        })
      }
    }
  }

  return segmentos
}

function incrementTimecode(tc, seconds) {
  const total = timecodeToSeconds(tc) + seconds
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

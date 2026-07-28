import { Search, Bell, Settings, Heart, ArrowRight, Check, Star, Zap } from 'lucide-react'
import {
  Container,
  Eyebrow,
  Display,
  Heading,
  Text,
  Code,
  Kbd,
} from '../components/ui'
import {
  typeScale,
  fontWeights,
  colorScales,
  semanticColors,
  feedbackColors,
  spacingScale,
  radiusScale,
  elevationScale,
  motionTokens,
  breakpoints,
} from '../lib/tokens'

const sections = [
  { id: 'typography', label: 'Tipografia' },
  { id: 'color', label: 'Cor' },
  { id: 'spacing', label: 'Espaçamento' },
  { id: 'radius', label: 'Raio' },
  { id: 'elevation', label: 'Elevação' },
  { id: 'motion', label: 'Motion' },
  { id: 'breakpoints', label: 'Breakpoints' },
  { id: 'icons', label: 'Ícones' },
]

function Block({ id, title, description, children }) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-hairline pt-14">
      <Heading level={2} className="text-heading-lg">
        {title}
      </Heading>
      {description && (
        <Text tone="body" className="mt-2 max-w-prose">
          {description}
        </Text>
      )}
      <div className="mt-10">{children}</div>
    </section>
  )
}

function Swatch({ hex, className, step }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className={`h-14 w-full rounded-md ${className}`} />
      <div className="flex items-baseline justify-between px-0.5">
        <span className="text-label-md text-ink">{step}</span>
        <span className="font-mono text-caption text-mute">{hex}</span>
      </div>
    </div>
  )
}

export default function Foundations() {
  return (
    <div className="bg-canvas">
      <Container className="py-16 lg:py-20">
        {/* Cabeçalho */}
        <header className="max-w-3xl">
          <Eyebrow>Design System · Fundações</Eyebrow>
          <Display size="lg" className="mt-4">
            Foundations
          </Display>
          <Text size="xl" tone="body" className="mt-5">
            A base sobre a qual todos os componentes são construídos: tipografia, cor, espaçamento,
            raio, elevação e motion. Tokens nomeados, uma única fonte de verdade em{' '}
            <Code>tailwind.config.js</Code>.
          </Text>
        </header>

        <div className="mt-16 grid grid-cols-1 gap-14 lg:grid-cols-[180px_1fr] lg:gap-16">
          {/* Navegação lateral */}
          <nav className="hidden lg:block">
            <div className="sticky top-24 flex flex-col gap-1">
              <span className="mb-2 text-eyebrow uppercase text-mute">Nesta página</span>
              {sections.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="rounded-sm px-3 py-1.5 text-label-md text-body transition-colors hover:bg-elevated hover:text-ink"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </nav>

          {/* Conteúdo */}
          <div className="flex flex-col gap-16">
            {/* ── TIPOGRAFIA ─────────────────────────────────────────────── */}
            <Block
              id="typography"
              title="Tipografia"
              description="Fonte Geist. Escala nomeada com peso, entrelinha e tracking calibrados por tamanho — títulos com tracking negativo para densidade ótica; corpo com 1.6 de entrelinha para leitura."
            >
              <div className="flex flex-col divide-y divide-hairline">
                {typeScale.map((t) => (
                  <div
                    key={t.name}
                    className="flex flex-col gap-3 py-6 md:flex-row md:items-baseline md:justify-between md:gap-8"
                  >
                    <div className="min-w-0 flex-1">
                      <p className={`${t.className} truncate text-ink`}>Multiplicar vendas</p>
                    </div>
                    <div className="flex shrink-0 flex-col gap-0.5 md:w-64 md:text-right">
                      <span className="text-label-md text-ink">{t.name}</span>
                      <span className="font-mono text-caption text-mute">
                        {t.px}px · {t.weight} · {t.leading} · {t.tracking}
                      </span>
                      <span className="text-caption text-mute">{t.use}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12">
                <Heading level={4} className="mb-5">
                  Pesos
                </Heading>
                <div className="flex flex-wrap gap-8">
                  {fontWeights.map((w) => (
                    <div key={w.value} className="flex flex-col gap-1">
                      <span className={`${w.className} text-heading-md text-ink`}>Ag</span>
                      <span className="text-label-md text-ink">{w.name}</span>
                      <span className="font-mono text-caption text-mute">{w.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Block>

            {/* ── COR ────────────────────────────────────────────────────── */}
            <Block
              id="color"
              title="Cor"
              description="Escala neutra proprietária (quente) e acento esmeralda, ambas de 50 a 950. Tokens semânticos mapeiam a intenção — texto, borda, superfície — em vez do valor bruto."
            >
              {Object.entries(colorScales).map(([name, scale]) => (
                <div key={name} className="mb-10">
                  <Heading level={4} className="mb-4">
                    {name}
                  </Heading>
                  <div className="grid grid-cols-3 gap-3 sm:grid-cols-6 lg:grid-cols-11">
                    {scale.map((c) => (
                      <Swatch key={c.step} {...c} />
                    ))}
                  </div>
                </div>
              ))}

              <Heading level={4} className="mb-4 mt-12">
                Tokens semânticos
              </Heading>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {semanticColors.map((c) => (
                  <div key={c.name} className="flex items-center gap-3 rounded-lg border border-hairline p-3">
                    <div className={`h-10 w-10 shrink-0 rounded-md ${c.className}`} />
                    <div className="min-w-0">
                      <div className="font-mono text-label-md text-ink">{c.name}</div>
                      <div className="truncate text-caption text-mute">{c.role}</div>
                    </div>
                  </div>
                ))}
              </div>

              <Heading level={4} className="mb-4 mt-12">
                Feedback
              </Heading>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {feedbackColors.map((c) => (
                  <div key={c.name} className="flex items-center gap-3">
                    <div className={`h-10 w-10 shrink-0 rounded-md ${c.className}`} />
                    <div>
                      <div className="text-label-md text-ink">{c.name}</div>
                      <div className="font-mono text-caption text-mute">{c.hex}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Block>

            {/* ── ESPAÇAMENTO ────────────────────────────────────────────── */}
            <Block
              id="spacing"
              title="Espaçamento"
              description="Escala geométrica de base 4px. Use múltiplos consistentes para ritmo vertical e alinhamento — padding de componentes normalmente entre 3 (12px) e 8 (32px)."
            >
              <div className="flex flex-col gap-3">
                {spacingScale.map((s) => (
                  <div key={s.name} className="flex items-center gap-4">
                    <span className="w-16 shrink-0 font-mono text-caption text-mute">{s.name}</span>
                    <span className="w-14 shrink-0 text-label-md text-ink">{s.px}px</span>
                    <div className={`h-4 rounded-xs bg-emerald ${s.className}`} />
                  </div>
                ))}
              </div>
            </Block>

            {/* ── RAIO ───────────────────────────────────────────────────── */}
            <Block
              id="radius"
              title="Raio de borda"
              description="Cantos consistentes: componentes internos usam raios menores; cards usam lg (16px); pílulas e avatares usam full."
            >
              <div className="grid grid-cols-3 gap-6 sm:grid-cols-4 lg:grid-cols-7">
                {radiusScale.map((r) => (
                  <div key={r.name} className="flex flex-col items-center gap-2">
                    <div
                      className={`h-16 w-16 border border-hairline-strong bg-elevated ${r.className}`}
                    />
                    <span className="text-label-md text-ink">{r.name}</span>
                    <span className="font-mono text-caption text-mute">
                      {r.px === 9999 ? '∞' : `${r.px}px`}
                    </span>
                  </div>
                ))}
              </div>
            </Block>

            {/* ── ELEVAÇÃO ───────────────────────────────────────────────── */}
            <Block
              id="elevation"
              title="Elevação"
              description="Sombras discretas e frias, calibradas para hierarquia — não para decoração. Quanto maior o elemento na pilha, mais suave e espalhada a sombra."
            >
              <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
                {elevationScale.map((e) => (
                  <div key={e.name} className="flex flex-col items-center gap-3">
                    <div className={`flex h-20 w-full items-center justify-center rounded-lg bg-surface ${e.className}`}>
                      <span className="font-mono text-caption text-mute">{e.name}</span>
                    </div>
                    <span className="text-center text-caption text-mute">{e.use}</span>
                  </div>
                ))}
              </div>
            </Block>

            {/* ── MOTION ─────────────────────────────────────────────────── */}
            <Block
              id="motion"
              title="Motion"
              description="Durações curtas e curvas suaves. Passe o mouse nas barras para sentir cada easing. Interações rápidas usam fast/normal; transições de layout usam slow."
            >
              <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
                <div>
                  <Heading level={4} className="mb-4">
                    Durações
                  </Heading>
                  <div className="flex flex-col gap-2">
                    {motionTokens.durations.map((d) => (
                      <div key={d.name} className="flex items-center gap-4">
                        <span className="w-16 shrink-0 font-mono text-caption text-mute">{d.name}</span>
                        <span className="w-14 shrink-0 text-label-md text-ink">{d.ms}ms</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <Heading level={4} className="mb-4">
                    Easings
                  </Heading>
                  <div className="flex flex-col gap-3">
                    {motionTokens.easings.map((e) => (
                      <div key={e.name} className="group flex items-center gap-4">
                        <span className="w-24 shrink-0 font-mono text-caption text-mute">{e.name}</span>
                        <div className="relative h-8 flex-1 overflow-hidden rounded-full bg-elevated">
                          <div
                            className={`absolute left-1 top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-emerald transition-[left] duration-slower ${e.className} group-hover:left-[calc(100%_-_1.5rem)]`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Block>

            {/* ── BREAKPOINTS ────────────────────────────────────────────── */}
            <Block
              id="breakpoints"
              title="Breakpoints"
              description="Grade responsiva mobile-first. O container máximo é 1200px (container-wide: 1360px)."
            >
              <div className="overflow-hidden rounded-lg border border-hairline">
                {breakpoints.map((b, i) => (
                  <div
                    key={b.name}
                    className={`flex items-center justify-between px-5 py-3.5 ${i !== 0 ? 'border-t border-hairline' : ''}`}
                  >
                    <div className="flex items-center gap-4">
                      <Code>{b.name}</Code>
                      <span className="text-body-sm text-mute">{b.use}</span>
                    </div>
                    <span className="font-mono text-label-md text-ink">≥ {b.px}px</span>
                  </div>
                ))}
              </div>
            </Block>

            {/* ── ÍCONES ─────────────────────────────────────────────────── */}
            <Block
              id="icons"
              title="Ícones"
              description="Biblioteca Lucide — traço de 1.5–1.75, alinhado à métrica do texto. Tamanhos padrão: 16 (inline), 20 (controles), 24 (destaque)."
            >
              <div className="flex flex-wrap items-end gap-8">
                {[
                  { size: 16, label: 'inline' },
                  { size: 20, label: 'controle' },
                  { size: 24, label: 'destaque' },
                ].map(({ size, label }) => (
                  <div key={size} className="flex flex-col items-center gap-2">
                    <div className="flex items-center gap-3 rounded-lg border border-hairline p-4 text-ink">
                      {[Search, Bell, Settings, Heart, ArrowRight, Check, Star, Zap].map((Icon, i) => (
                        <Icon key={i} size={size} strokeWidth={1.75} />
                      ))}
                    </div>
                    <span className="text-caption text-mute">
                      {size}px · {label}
                    </span>
                  </div>
                ))}
              </div>
              <Text size="sm" tone="mute" className="mt-6">
                Dica de teclado: pressione <Kbd>⌘</Kbd> <Kbd>K</Kbd> para buscar componentes.
              </Text>
            </Block>
          </div>
        </div>
      </Container>
    </div>
  )
}

import { ArrowRight, Brain } from 'lucide-react'
import {
  Container,
  Eyebrow,
  Button,
  ButtonIconBadge,
  Badge,
  Card,
  FeatureIconCard,
  MediaCard,
  Field,
  Input,
  TestimonialCard,
  VideoTestimonialCard,
  PricingCard,
  SolutionShowcase,
  Faq,
  Stats,
} from '../components/ui'
import { solutions, textTestimonials, videoTestimonials, plans, faqs, stats } from './data'

function Block({ title, description, children }) {
  return (
    <section className="border-t border-hairline py-14 first:border-t-0">
      <h2 className="text-xl font-medium tracking-tight text-ink">{title}</h2>
      {description && <p className="mt-1 max-w-2xl text-sm text-body">{description}</p>}
      <div className="mt-8">{children}</div>
    </section>
  )
}

const swatches = [
  { name: 'Ink', hex: '#171717', className: 'bg-ink' },
  { name: 'Body', hex: '#262626', className: 'bg-body' },
  { name: 'Mute', hex: '#525252', className: 'bg-mute' },
  { name: 'Hairline', hex: '#ECECEC', className: 'bg-hairline border border-hairline' },
  { name: 'Emerald', hex: '#10B981', className: 'bg-emerald' },
  { name: 'Emerald Soft', hex: '#D1FAE5', className: 'bg-emerald-soft border border-hairline' },
  { name: 'Brand Gradient', hex: 'Linear', className: 'bg-brand-gradient' },
]

/**
 * Showcase — galeria dos componentes da biblioteca (o design system em uso).
 */
export default function Showcase() {
  return (
    <div className="bg-canvas">
      <Container className="py-16">
        <Eyebrow>Design System · React + Tailwind</Eyebrow>
        <h1 className="mt-3 text-4xl font-medium tracking-tight text-ink sm:text-5xl">
          Biblioteca de Componentes
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-body">
          Visual clean e refinado: superfícies brancas, bordas 1px sutis e microinterações
          discretas. Suporta tema claro e escuro. Cada componente abaixo vem de{' '}
          <code className="text-emerald-deep">src/components/ui</code>.
        </p>

        {/* CORES */}
        <Block title="Cores" description="Trio tinta / neutro com acento esmeralda.">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {swatches.map((s) => (
              <div key={s.name} className="overflow-hidden rounded-lg border border-hairline">
                <div className={`h-16 w-full ${s.className}`} />
                <div className="p-3">
                  <div className="text-sm font-medium text-ink">{s.name}</div>
                  <div className="text-xs text-mute">{s.hex}</div>
                </div>
              </div>
            ))}
          </div>
        </Block>

        {/* BOTÕES */}
        <Block
          title="Botões"
          description="As 4 variantes estruturais, cada uma com e sem ícone."
        >
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-3">
              <span className="text-sm font-medium text-mute">Shiny Preto (Padrão)</span>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="shiny">Começar Agora</Button>
                <Button variant="shiny" icon={<ArrowRight size={16} />}>Começar Agora</Button>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <span className="text-sm font-medium text-mute">Shiny Verde (Brand)</span>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="shiny-brand">Falar com IAgo</Button>
                <Button variant="shiny-brand" icon={<ArrowRight size={16} />}>Falar com IAgo</Button>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <span className="text-sm font-medium text-mute">Secundário (Branco no claro, Transparente no escuro)</span>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="secondary">Ver Soluções</Button>
                <Button variant="secondary" icon={<ArrowRight size={16} />}>Ver Soluções</Button>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <span className="text-sm font-medium text-mute">Ghost</span>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="ghost">Entrar</Button>
                <Button variant="ghost" icon={<ArrowRight size={16} />}>Entrar</Button>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <span className="text-sm font-medium text-mute">Tamanho Pequeno (Header)</span>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="shiny" size="sm">Acessar Conta</Button>
              </div>
            </div>
          </div>
        </Block>

        {/* BADGES */}
        <Block title="Badges" description="Três tons: sólida, suave e contornada.">
          <div className="flex flex-wrap items-center gap-3">
            <Badge tone="emerald">Sólida</Badge>
            <Badge tone="soft">Suave</Badge>
            <Badge tone="neutral">Neutra</Badge>
          </div>
        </Block>

        {/* CARDS */}
        <Block
          title="Cards"
          description="Superfícies flat (UI densa) e premium (marketing), card com ícone e card com imagem (MediaCard)."
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureIconCard
              icon={<Brain size={22} strokeWidth={1.75} />}
              eyebrow="Predição comportamental"
              title="Análise de Intenção"
              description="Algoritmos que identificam o momento de conversão."
            />
            <Card>
              <Badge tone="neutral">Flat</Badge>
              <h3 className="mt-3 text-lg font-medium text-ink">Card Base</h3>
              <p className="mt-1.5 text-sm text-body">
                Superfície genérica do sistema — ideal para dashboards e UI densa.
              </p>
            </Card>
            <Card variant="premium">
              <Badge tone="soft">Premium</Badge>
              <h3 className="mt-3 text-lg font-medium text-ink">Superfície de Marketing</h3>
              <p className="mt-1.5 text-sm text-body">
                Cantos 24px, anel sutil e leve elevação no hover.
              </p>
            </Card>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <MediaCard
              image="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80"
              imageAlt="Equipe em treinamento"
              badge="Novo"
              eyebrow="Aula magna"
              title="Estratégia de Escala 2026"
              description="Aula de implementação prática com casos de sucesso reais."
            />
            <MediaCard
              image="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
              imageAlt="Equipe colaborando"
              badge="Ao vivo"
              eyebrow="Programa"
              title="Aceleração de Vendas"
              description="Metodologias comprovadas para transformar visitantes em clientes."
            />
            <MediaCard
              image="https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=800&q=80"
              imageAlt="Networking de empresários"
              eyebrow="Comunidade"
              title="Networking de Elite"
              description="Conecte-se com quem já escalou operações de verdade."
            />
          </div>
        </Block>

        {/* FORMULÁRIOS */}
        <Block title="Formulários" description="Inputs em pílula com foco esmeralda.">
          <div className="grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="E-mail corporativo">
              <Input type="email" placeholder="voce@empresa.com.br" />
            </Field>
            <Field label="Nome da empresa">
              <Input placeholder="Conversão Extrema" />
            </Field>
          </div>
        </Block>

        {/* DEPOIMENTOS */}
        <Block
          title="Depoimentos"
          description="Cards de texto clean (estrelas pretas, foto no rodapé) e cards de vídeo."
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {videoTestimonials.map((t) => (
              <VideoTestimonialCard key={t.name} {...t} />
            ))}
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
            {textTestimonials.map((t) => (
              <TestimonialCard key={t.name} {...t} />
            ))}
          </div>
        </Block>

        {/* PREÇOS */}
        <Block
          title="Planos de Preço"
          description="Plano em destaque com anel esmeralda, leve escala e CTA shiny."
        >
          <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-3">
            {plans.map((p) => (
              <PricingCard key={p.name} {...p} />
            ))}
          </div>
        </Block>

        {/* FAQ */}
        <Block title="FAQ" description="Acordeão acessível e animado.">
          <Faq items={faqs} className="mx-0 max-w-3xl" />
        </Block>

        {/* MÉTRICAS */}
        <Block title="Métricas">
          <Stats items={stats} className="max-w-lg" />
        </Block>

        {/* BLOCO DE SOLUÇÃO */}
        <Block
          title="Bloco de Solução"
          description="Componente SolutionShowcase — cada bloco da section de soluções da landing (texto + visual, alternável com a prop reverse)."
        >
          <SolutionShowcase solution={solutions[0]} />
        </Block>
      </Container>
    </div>
  )
}

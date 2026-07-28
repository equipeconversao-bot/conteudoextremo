import { ArrowRight } from 'lucide-react'
import {
  Navbar,
  Footer,
  Container,
  Section,
  Eyebrow,
  SectionHeader,
  Button,
  ButtonIconBadge,
  TestimonialCard,
  VideoTestimonialCard,
  PricingCard,
  Faq,
  Stats,
  FadeIn,
  HoverHeadline,
  SolutionShowcase,
  Marquee,
  DotGrid,
  VideoLightbox,
} from '../components/ui'
import {
  solutions,
  textTestimonials,
  videoTestimonials,
  plans,
  faqs,
  stats,
  navLinks,
  footerLinks,
  clientLogos,
} from './data'

const Divider = () => (
  <div className="h-px w-full bg-gradient-to-r from-transparent via-hairline to-transparent" />
)

/**
 * LandingPage — EXEMPLO de uso da biblioteca. Ordem: hero → logos → soluções →
 * depoimentos → planos → sobre → FAQ → CTA.
 */
export default function LandingPage() {
  return (
    <div className="relative overflow-x-hidden">
      <div className="fixed inset-0 -z-10 bg-surface" aria-hidden="true" />
      <div className="noise-bg pointer-events-none fixed inset-0 z-[90] opacity-50" aria-hidden="true" />

      <div className="relative z-10">
        <DotGrid className="-z-10" />
        <Navbar links={navLinks} />

        <main>
          {/* ── HERO ─────────────────────────────────────────────────────── */}
          <Section className="relative pt-14 pb-20 text-center lg:pt-20 lg:pb-28">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[600px] blur-[100px] transform-gpu opacity-40 dark:opacity-10"
              style={{
                background: 'radial-gradient(circle at 50% 0%, rgba(16,185,129,1) 0%, rgba(16,185,129,0) 70%)',
              }}
            />

            <Container className="relative z-10">
              <FadeIn delay={100} className="mx-auto flex max-w-4xl flex-col items-center">
                <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-hairline bg-surface/80 px-3 py-1.5 shadow-subtle backdrop-blur-md">
                  <span className="flex -space-x-2">
                    {[
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2&w=64&h=64&q=80',
                      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=facearea&facepad=2&w=64&h=64&q=80',
                      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=64&h=64&q=80',
                      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=64&h=64&q=80',
                    ].map((img, i) => (
                      <img 
                        key={i} 
                        src={img} 
                        alt="Aluno" 
                        className="h-6 w-6 rounded-full border-2 border-surface object-cover" 
                      />
                    ))}
                  </span>
                  <span className="text-[13px] font-medium text-body">+40 mil alunos formados</span>
                </div>

                <h1 className="text-balance text-display-lg font-medium tracking-tighter text-ink sm:text-display-xl">
                  Venda mais gastando menos com <HoverHeadline text="IA pronta para usar" />
                </h1>
                <p className="mt-6 text-balance max-w-xl text-body-lg leading-relaxed text-body">
                  Formações, mentorias, comunidade e dezenas de <strong className="font-semibold text-ink">soluções de IA prontas para copiar e colar</strong>. Aprenda a anunciar e <strong className="font-semibold text-ink">economize com ferramentas, funcionários e tokens</strong>.
                </p>

                <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                  <ButtonIconBadge as="a" href="#pricing" className="relative z-10" icon={<ArrowRight size={16} />}>
                    Quero fazer parte
                  </ButtonIconBadge>
                  <Button as="a" href="#solutions" variant="secondary">
                    Ver as soluções
                  </Button>
                </div>
              </FadeIn>

              {/* Vídeo do portal */}
              <FadeIn delay={250} className="mx-auto mt-16 w-full max-w-5xl">
                <VideoLightbox videoId="iLgfoYiAVT0" />
              </FadeIn>
            </Container>
          </Section>

          {/* ── LOGOS DE CLIENTES (entre a 1ª e a 2ª dobra) ──────────────── */}
          <Section className="border-y border-black/10 bg-black/5 py-6 dark:border-white/10 dark:bg-white/5 lg:py-8">
            <Container>
              <FadeIn>
                <p className="mb-6 text-center text-caption uppercase tracking-eyebrow text-mute">
                  Empresas que já fazem parte
                </p>
              </FadeIn>
            </Container>
            <Container>
              <FadeIn>
                <Marquee duration={40}>
                  {clientLogos.map((logo) => (
                    <span key={logo} className="select-none text-2xl font-semibold tracking-tight text-mute hover:text-ink transition-colors cursor-default">
                      {logo}
                    </span>
                  ))}
                </Marquee>
              </FadeIn>
            </Container>
          </Section>

          {/* ── SOLUÇÕES ─────────────────────────────────────────────────── */}
          <Section id="solutions" className="overflow-hidden">
            <Container>
              <FadeIn>
                <SectionHeader
                  eyebrow="Tudo em um só lugar"
                  title={<>Formação, IA, comunidade e mentoria, <HoverHeadline text="tudo junto" /></>}
                  description={<>Do primeiro anúncio à automação com IA: tudo o que a sua empresa precisa para <strong className="font-semibold text-ink">vender mais sem depender de uma equipe grande</strong> ou de mil ferramentas.</>}
                />
              </FadeIn>

              <div className="mt-16 flex flex-col gap-20 md:mt-20 md:gap-28">
                {solutions.map((s, idx) => (
                  <FadeIn key={s.eyebrow} delay={idx * 80}>
                    <SolutionShowcase solution={s} reverse={idx % 2 !== 0} />
                  </FadeIn>
                ))}
              </div>
            </Container>
          </Section>

          <Divider />

          {/* ── DEPOIMENTOS ──────────────────────────────────────────────── */}
          <Section id="testimonials">
            <Container>
              <FadeIn>
                <SectionHeader
                  eyebrow="Prova de quem faz"
                  title={<>Empresas que <HoverHeadline text="vendem mais gastando menos" /></>}
                  description={<>Mais de <strong className="font-semibold text-ink">1.000 empresas já passaram pelos planos Plus, Black e Mind</strong>, e mais de <strong className="font-semibold text-ink">40 mil alunos pelo método Conversão Extrema</strong>.</>}
                />
              </FadeIn>

              <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2">
                {videoTestimonials.map((t, idx) => (
                  <FadeIn key={t.name} delay={idx * 80} className="flex">
                    <VideoTestimonialCard {...t} className="w-full relative z-10" />
                  </FadeIn>
                ))}
              </div>

              {/* Depoimentos em texto — carrossel automático (largura do conteúdo) */}
              <FadeIn>
                <Marquee duration={45} gapClass="mr-6" repeat={2} className="mt-6 py-8">
                  {textTestimonials.map((t) => (
                    <TestimonialCard key={t.name} {...t} className="w-[340px]" />
                  ))}
                </Marquee>
              </FadeIn>
            </Container>
          </Section>

          <Divider />

          {/* ── PLANOS ───────────────────────────────────────────────────── */}
          <Section id="pricing">
            <Container>
              <FadeIn>
                <SectionHeader
                  eyebrow="Planos anuais"
                  title={<>Escolha o <HoverHeadline text="plano ideal" /> para a sua empresa</>}
                  description={<>Não é uma assinatura mensal, e sim um plano de 12 meses com <strong className="font-semibold text-ink">formação, mentorias, comunidade, eventos e soluções de IA</strong>.</>}
                />
              </FadeIn>
              <div className="mt-16 grid grid-cols-1 items-start gap-6 md:grid-cols-3">
                {plans.map((p, idx) => (
                  <FadeIn key={p.name} delay={idx * 80} className="flex">
                    <PricingCard {...p} className="w-full relative z-10" />
                  </FadeIn>
                ))}
              </div>
            </Container>
          </Section>

          <Divider />

          {/* ── SOBRE O FUNDADOR (agora abaixo dos planos) ───────────────── */}
          <Section id="about">
            <Container>
              <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-5 md:gap-16">
                <FadeIn className="md:col-span-2">
                  <div className="flex min-h-[360px] w-full items-center justify-center overflow-hidden rounded-xl border border-hairline bg-elevated">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-soft text-heading-md font-semibold text-emerald-deep">
                      TT
                    </div>
                  </div>
                </FadeIn>

                <FadeIn delay={120} className="flex flex-col items-start md:col-span-3">
                  <Eyebrow>Quem está por trás</Eyebrow>
                  <h2 className="mt-4 text-balance text-heading-lg text-ink sm:text-heading-xl">Tiago Tessmann</h2>
                  <p className="mt-4 text-balance text-body-lg leading-relaxed text-mute">
                    Um dos maiores especialistas em anúncios online do Brasil. Mais de 15 anos de
                    experiência, milhares de contas gerenciadas e <strong className="font-semibold text-ink">milhões investidos em tráfego no Google e no Meta</strong>. Criador do <strong className="font-semibold text-ink">Método Conversão Extrema</strong> e fundador de uma das maiores
                    agências de marketing digital da América Latina, possuindo o selo Google Partner Premier.
                  </p>
                  <Stats items={stats} className="mt-10 w-full" />
                </FadeIn>
              </div>
            </Container>
          </Section>

          <Divider />

          {/* ── FAQ ──────────────────────────────────────────────────────── */}
          <Section id="faq">
            <Container>
              <FadeIn>
                <SectionHeader eyebrow="Perguntas frequentes" title={<>Tudo o que você <HoverHeadline text="precisa saber" /></>} />
              </FadeIn>
              <FadeIn>
                <div className="mx-auto mt-16 max-w-3xl">
                  <Faq items={faqs} />
                </div>
              </FadeIn>
            </Container>
          </Section>

          {/* ── CTA FINAL ────────────────────────────────────────────────── */}
          <Section className="border-t border-hairline text-center">
            <Container>
              <FadeIn className="mx-auto flex max-w-3xl flex-col items-center">
                <Eyebrow className="mb-6">Comece agora</Eyebrow>
                <h2 className="text-balance text-display-lg font-semibold tracking-tighter text-ink">
                  Pronto para <HoverHeadline text="vender mais gastando menos?" />
                </h2>
                <p className="mt-6 text-balance max-w-xl text-body-lg leading-relaxed text-mute">
                  Junte-se a mais de <strong className="font-semibold text-ink">1.000 empresas</strong> que já usam o método e as <strong className="font-semibold text-ink">soluções de IA</strong> da
                  Conversão Extrema. Escolha seu plano anual e comece hoje.
                </p>
                <div className="mt-10">
                  <Button as="a" href="#pricing" variant="shiny" size="lg" className="relative z-10">
                    Quero fazer parte
                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                      <ArrowRight size={16} />
                    </span>
                  </Button>
                </div>
              </FadeIn>
            </Container>
          </Section>
        </main>

        <Footer links={footerLinks} />

        {/* ── BOTÃO WHATSAPP FLUTUANTE ─────────────────────────────────── */}
        <div className="fixed bottom-6 right-6 z-[100]">
          <Button
            as="a"
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            variant="shiny"
            className="!p-1.5 !pr-6 shadow-[0_8px_30px_rgb(0,0,0,0.25)] hover:scale-105 dark:shadow-[0_8px_30px_rgba(16,185,129,0.3)]"
            aria-label="Falar com IAgo no WhatsApp"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-gradient text-white">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.663-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </div>
              <span className="text-[15px] font-semibold text-white">Falar com IAgo</span>
            </div>
          </Button>
        </div>
      </div>
    </div>
  )
}

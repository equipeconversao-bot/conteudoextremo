// Dados de exemplo usados na landing / showcase (não fazem parte da biblioteca).
import { HoverHeadline } from '../components/ui'
export const solutions = [
  {
    icon: 'brain',
    eyebrow: 'Formação completa',
    title: <>Aprenda a anunciar e a <HoverHeadline text="vender de verdade" /></>,
    description:
      <>Cursos gravados e sempre atualizados de Meta Ads, Google Ads, TikTok Ads, landing pages, tráfego, rastreamento e vendas. É o <strong className="font-semibold text-ink">Método Conversão Extrema</strong>, o mesmo que já formou mais de 40 mil alunos.</>,
  },
  {
    icon: 'zap',
    eyebrow: 'Soluções de IA prontas',
    title: <>Dezenas de <HoverHeadline text="soluções de IA" /> para copiar e colar</>,
    description:
      <>CRM, geradores de relatório, agentes de atendimento, templates de landing page e muito mais, tudo já construído e testado. Você <strong className="font-semibold text-ink">copia, cola e usa: sem contratar, sem gastar tokens</strong> e sem depender de mil ferramentas.</>,
  },
  {
    icon: 'target',
    eyebrow: 'Comunidade de verdade',
    title: <><HoverHeadline text="Uma rede de empresários" /> que estão crescendo</>,
    description:
      <>Troque experiências, feche parcerias e evolua ao lado de outros empreendedores. <strong className="font-semibold text-ink">Grupos exclusivos, encontros e eventos presenciais</strong> que valem o plano sozinhos.</>,
  },
  {
    icon: 'shield',
    eyebrow: 'Ajuda para implementar',
    title: <><HoverHeadline text="Mentorias individuais" /> para tirar do papel</>,
    description:
      <>Travou em um anúncio, uma página ou uma automação? Nossa equipe <strong className="font-semibold text-ink">pega na sua mão e implementa junto com você</strong>, dentro do seu cenário e do jeito certo.</>,
  },
]

export const textTestimonials = [
  {
    quote:
      <><strong className="font-semibold text-ink">Eu não sabia nada de anúncios.</strong> Com o método e as mentorias de implementação, hoje minha empresa <strong className="font-semibold text-ink">roda o próprio tráfego e vende todo dia.</strong></>,
    name: 'Marina Oliveira',
    role: 'Fundadora, Ateliê Marina',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
  },
  {
    quote:
      <>Os templates de landing page e os geradores de relatório me pouparam semanas de trabalho. É <strong className="font-semibold text-ink">copiar, colar e usar, o que me fez cortar três ferramentas.</strong></>,
    name: 'Rafael Santos',
    role: 'CEO, Loja Prime',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
  },
  {
    quote:
      <>A comunidade e os eventos presenciais mudaram meu jogo. <strong className="font-semibold text-ink">Fechei parcerias que, sozinhas, já pagaram o investimento do ano.</strong></>,
    name: 'Juliana Prado',
    role: 'Sócia, Studio JP',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
  },
]

export const videoTestimonials = [
  {
    thumbnail: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=800&q=80',
    name: 'Ana Beatriz Costa',
    role: 'Diretora, Costa & Cia',
    duration: '2:14',
    quote:
      <><strong className="font-semibold text-ink">As soluções de IA substituíram nosso CRM e o trabalho de dois analistas.</strong> Copiei, colei e <strong className="font-semibold text-ink">cortei custo na hora.</strong></>,
    result: '−R$ 9 mil/mês em custos',
  },
  {
    thumbnail: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80',
    name: 'Carlos Mendes',
    role: 'Fundador, Vollex Comércio',
    duration: '1:47',
    quote:
      <>Aprendi a <strong className="font-semibold text-ink">rodar meus próprios anúncios</strong> e parei de depender de agência. <strong className="font-semibold text-ink">O retorno apareceu já no primeiro mês.</strong></>,
    result: 'R$ 1,2M em 90 dias',
  },
]

// Entregas base compartilhadas pelos planos (ordem preservada)
const plusFeatures = [
  'Treinamento Conversão Extrema',
  'Suporte no Portal de Alunos',
  'Comunidade Extrema FB',
  'Mentorias em Grupo',
  'Sessões de Implementação',
  'Grupo no WhatsApp',
  'Mentoria Individual Implementação de Tráfego e Página',
  'Suporte Individual no WhatsApp',
  'Sessões Estratégicas de Negócios',
]

const blackFeatures = [
  ...plusFeatures,
  'Soluções Plug and Play de IA',
  'Call de acompanhamento trimestral com guia',
  '10 Mentorias Individuais direcionamento',
  '2 Eventos Presenciais Black',
]

const mindFeatures = [
  ...blackFeatures,
  '2 Eventos Presenciais Mind',
  'Participação dos colaboradores em Mentorias e Sessões',
]

export const plans = [
  {
    name: 'Plus',
    description: 'Formação completa, comunidade e mentorias em grupo para começar.',
    price: '997',
    features: plusFeatures,
    cta: 'Quero o Plus',
    featured: false,
  },
  {
    name: 'Black',
    description: 'Tudo do Plus + soluções de IA prontas, mentorias individuais e eventos presenciais.',
    price: '1.997',
    features: blackFeatures,
    cta: 'Quero o Black',
    featured: true,
  },
  {
    name: 'Mind',
    description: 'Tudo do Black + eventos Mind e a sua equipe participando junto.',
    price: '3.497',
    features: mindFeatures,
    cta: 'Quero o Mind',
    featured: false,
  },
]

export const faqs = [
  {
    question: 'O que é a Conversão Extrema?',
    answer:
      'Um ecossistema completo de marketing, vendas e IA para empresas: formações, mentorias, comunidade e dezenas de soluções de IA prontas para copiar e colar. Criado por Tiago Tessmann, o método já formou mais de 40 mil alunos.',
  },
  {
    question: 'As soluções de IA funcionam só copiando e colando?',
    answer:
      'Sim. Já construímos (e pagamos os tokens de) dezenas de soluções de marketing e vendas, como CRM, geradores de relatório, agentes de atendimento, templates de landing page e muito mais. Você só copia, cola e usa no seu negócio. Disponíveis nos planos Black e Mind.',
  },
  {
    question: 'É uma assinatura mensal?',
    answer:
      'Não. O acesso é vendido em planos anuais (12 meses) e não é uma assinatura que você cancela no mês seguinte. Você entra para um ciclo completo de formação, mentoria e comunidade.',
  },
  {
    question: 'Preciso já saber anunciar?',
    answer:
      'Não. Ensinamos do zero: Meta Ads, Google Ads, TikTok Ads, landing pages, tráfego e vendas. E, se você travar em algo, as mentorias individuais de implementação te ajudam a colocar em prática.',
  },
  {
    question: 'Qual a diferença entre Plus, Black e Mind?',
    answer:
      'O Plus traz formação, comunidade e mentorias em grupo. O Black adiciona as soluções de IA prontas, mentorias individuais e eventos presenciais. O Mind é o nível máximo: inclui os eventos Mind e a participação da sua equipe nas mentorias e sessões.',
  },
]

export const stats = [
  { value: '+15 anos', label: 'Gerenciando tráfego online' },
  { value: '1,4M', label: 'Seguidores no Instagram' },
  { value: '+40 mil', label: 'Alunos formados' },
]

export const navLinks = [
  { label: 'Soluções', href: '#solutions' },
  { label: 'Depoimentos', href: '#testimonials' },
  { label: 'Planos', href: '#pricing' },
  { label: 'Sobre', href: '#about' },
  { label: 'FAQ', href: '#faq' },
]

// Wordmarks de clientes (placeholders — troque pelos logos reais)
export const clientLogos = [
  'Nexon',
  'Vollex',
  'TechScale',
  'GrowthHub',
  'Lumen',
  'Atlas',
  'Vértice',
  'Órbita',
]

export const footerLinks = [
  { label: 'Termos', href: '#' },
  { label: 'Privacidade', href: '#' },
  { label: 'Contato', href: '#' },
]

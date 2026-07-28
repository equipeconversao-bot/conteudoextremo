# Conversão Extrema — Design System (React + Tailwind)

Design system em **React + Tailwind CSS**, com **tema claro e escuro**. O foco é a
**biblioteca de componentes** (`src/components/ui`); a documentação de tokens, o
showcase e a landing page são **exemplos** que mostram os componentes em uso.

Estética: clean e refinada — superfícies brancas, bordas de 1px sutis, tipografia
Geist com escala calibrada, acento esmeralda e botões premium (gradiente + borda
esmeralda giratória nos CTAs).

## Como rodar

Requer **Node.js 18+**.

```bash
cd react-app
npm install
npm run dev
```

Abra o endereço que o Vite mostrar (geralmente `http://localhost:5173`). Use o
alternador no rodapé para navegar entre **Foundations** (tokens), **Componentes**
(galeria) e a **Landing** de exemplo, e o botão de sol/lua para alternar o tema.

Build de produção:

```bash
npm run build && npm run preview
```

## Estrutura

```
react-app/
├─ tailwind.config.js        # ⭐ DESIGN TOKENS — fonte única de verdade
│                            #    (cor, tipografia, espaçamento, raio, elevação, motion)
├─ index.html                # script anti-flash de tema + root
├─ src/
│  ├─ index.css              # base + fonte Geist + variáveis de tema (claro/escuro)
│  ├─ main.jsx, App.jsx      # entrypoint + alternador dos exemplos
│  ├─ lib/
│  │  ├─ cn.js               # helper de classes
│  │  └─ tokens.js           # tokens em formato de dados (para a doc Foundations)
│  ├─ components/ui/         # ⭐ A BIBLIOTECA (design system)
│  │  ├─ index.js            #    barrel de exportação
│  │  ├─ primitives.jsx      #    Container, Section, Eyebrow, SectionHeader, Stars
│  │  ├─ Typography.jsx      #    Display, Heading, Text, Code, Kbd, Link
│  │  ├─ Button.jsx          #    Button (+ variantes shiny) e ButtonIconBadge
│  │  ├─ Badge.jsx, Card.jsx, Input.jsx
│  │  ├─ Testimonial.jsx     #    TestimonialCard e VideoTestimonialCard
│  │  ├─ Pricing.jsx, Faq.jsx, Stats.jsx
│  │  ├─ Navbar.jsx, Footer.jsx, ThemeToggle.jsx
│  │  ├─ Marquee.jsx         #    carrossel automático (loop infinito)
│  │  └─ FadeIn, HoverHeadline, MembersPortalMockup, SolutionShowcase
│  └─ examples/              # exemplos de uso (NÃO fazem parte da biblioteca)
│     ├─ data.js             #    conteúdo de exemplo
│     ├─ Foundations.jsx     #    documentação dos tokens (specimens ao vivo)
│     ├─ Showcase.jsx        #    galeria de componentes
│     └─ LandingPage.jsx     #    landing montada com a biblioteca
```

## Foundations (tokens)

Tokens nomeados em `tailwind.config.js`, documentados ao vivo na aba **Foundations**:

- **Tipografia** — fonte Geist; escala nomeada de `display-2xl` (72px) a `caption`
  (12px), cada nível com peso, entrelinha e *tracking* calibrados. Use os primitivos
  `Display`, `Heading`, `Text` em vez de classes soltas.
- **Cor** — escala neutra (`neutral-0…950`), acento `emerald-50…950` e **tokens
  semânticos temáveis** (`ink`, `body`, `mute`, `hairline`, `surface`, `canvas`,
  `inverse`) que trocam entre claro/escuro via CSS variables em `src/index.css`.
- **Espaçamento** — base de 4px + tokens de layout (`section`, `gutter`).
- **Raio** — `xs` (4) · `sm` (8) · `md` (12) · `lg` (16) · `xl` (24) · `2xl` (32) · `full`.
- **Elevação** — `shadow-xs…xl`, sombras calibradas por hierarquia.
- **Motion** — durações (`fast/normal/slow/slower`) e easings (`out-soft`, `in-out-soft`).
- **Breakpoints** — `sm 640 · md 768 · lg 1024 · xl 1280 · 2xl 1440`.

## Tema claro / escuro

Os tokens semânticos de cor são CSS variables definidas em `:root` (claro) e `.dark`
(escuro). O componente `ThemeToggle` (hook `useTheme`) alterna a classe `dark` em
`<html>` e persiste em `localStorage`; um script no `index.html` aplica o tema antes
da primeira pintura para evitar flash.

## Usando a biblioteca

Tudo é importado do barrel `components/ui`:

```jsx
import { Button, Card, TestimonialCard, PricingCard } from './components/ui'

<Button variant="primary">Começar agora</Button>
<Button variant="secondary">Ver as soluções</Button>
<Card variant="premium">…</Card>
```

### Componentes principais

| Componente | Descrição |
| :--- | :--- |
| `Display` / `Heading` / `Text` | Primitivos de tipografia — encapsulam a escala nomeada. `Code`, `Kbd`, `Link` completam. |
| `Button` | Pílula. Variantes: `primary`, `secondary`, `ghost`, `shiny`, `shiny-brand`. Tamanhos: `sm/md/lg`. `primary` e `secondary` adaptam-se ao tema. |
| `ButtonIconBadge` | CTA shiny com ícone à direita que desliza no hover. |
| `Badge` | Rótulo compacto. Tons: `emerald`, `soft`, `neutral`. |
| `Card` / `FeatureIconCard` / `MediaCard` | Superfícies `flat` e `premium`; card com ícone e card com imagem. |
| `Input` / `Field` | Campo pílula com foco esmeralda. |
| `TestimonialCard` / `VideoTestimonialCard` | Depoimentos em texto e em vídeo. |
| `PricingCard` | Plano; `featured` destaca com anel esmeralda + escala. |
| `Faq` | Acordeão em cards, acessível e animado. |
| `Stats` | Grade de métricas (`dark` para fundo escuro). |
| `Navbar` / `Footer` | Cabeçalho e rodapé (logo com inversão automática no escuro). |
| `Marquee` | Carrossel automático em loop infinito (logos, depoimentos…). |
| `FadeIn` / `HoverHeadline` / `SolutionShowcase` / `MembersPortalMockup` | Efeitos e blocos de composição usados na landing. |
| `ThemeToggle` / `useTheme` | Alternador de tema claro/escuro. |

## Notas

- Ícones: [`lucide-react`](https://lucide.dev).
- As imagens e wordmarks de logo nos exemplos são **placeholders** (Unsplash / texto)
  — troque pelos ativos reais.
- O design system anterior em HTML/CSS está na pasta irmã `../design-system/`.

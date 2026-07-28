// ─────────────────────────────────────────────────────────────────────────
// Tokens do design system em formato de dados — usados pela documentação
// (Foundations) para renderizar os specimens a partir da fonte real.
// ─────────────────────────────────────────────────────────────────────────

export const typeScale = [
  { name: 'Display 2XL', className: 'text-display-2xl', px: 72, weight: 600, tracking: '-0.04em', leading: 1.0, use: 'Heros de altíssimo impacto' },
  { name: 'Display XL', className: 'text-display-xl', px: 60, weight: 600, tracking: '-0.035em', leading: 1.02, use: 'Hero principal' },
  { name: 'Display LG', className: 'text-display-lg', px: 48, weight: 600, tracking: '-0.03em', leading: 1.05, use: 'Hero secundário / CTA' },
  { name: 'Heading XL', className: 'text-heading-xl', px: 40, weight: 600, tracking: '-0.022em', leading: 1.1, use: 'Título de página (h1)' },
  { name: 'Heading LG', className: 'text-heading-lg', px: 32, weight: 600, tracking: '-0.02em', leading: 1.15, use: 'Título de seção (h2)' },
  { name: 'Heading MD', className: 'text-heading-md', px: 24, weight: 600, tracking: '-0.017em', leading: 1.25, use: 'Subtítulo (h3)' },
  { name: 'Heading SM', className: 'text-heading-sm', px: 20, weight: 600, tracking: '-0.013em', leading: 1.3, use: 'Título de card (h4)' },
  { name: 'Body XL', className: 'text-body-xl', px: 20, weight: 400, tracking: '0', leading: 1.6, use: 'Sub-headline / lead' },
  { name: 'Body LG', className: 'text-body-lg', px: 18, weight: 400, tracking: '0', leading: 1.6, use: 'Parágrafo destacado' },
  { name: 'Body MD', className: 'text-body-md', px: 16, weight: 400, tracking: '0', leading: 1.6, use: 'Corpo padrão' },
  { name: 'Body SM', className: 'text-body-sm', px: 14, weight: 400, tracking: '0', leading: 1.55, use: 'Texto de apoio' },
  { name: 'Label LG', className: 'text-label-lg', px: 15, weight: 500, tracking: '-0.006em', leading: 1.2, use: 'Botões / rótulos' },
  { name: 'Label MD', className: 'text-label-md', px: 13, weight: 500, tracking: '0', leading: 1.2, use: 'Rótulos compactos' },
  { name: 'Caption', className: 'text-caption', px: 12, weight: 400, tracking: '0', leading: 1.4, use: 'Legendas / metadados' },
  { name: 'Eyebrow', className: 'text-eyebrow uppercase', px: 12, weight: 400, tracking: '0.14em', leading: 1.0, use: 'Rótulo acima de títulos' },
  { name: 'Code', className: 'text-code font-mono', px: 13, weight: 400, tracking: '0', leading: 1.6, use: 'Trechos de código' },
]

export const fontWeights = [
  { name: 'Light', value: 300, className: 'font-light' },
  { name: 'Regular', value: 400, className: 'font-normal' },
  { name: 'Medium', value: 500, className: 'font-medium' },
  { name: 'Semibold', value: 600, className: 'font-semibold' },
  { name: 'Bold', value: 700, className: 'font-bold' },
]

export const colorScales = {
  Neutral: [
    { step: '0', hex: '#ffffff', className: 'bg-neutral-0 border border-hairline' },
    { step: '50', hex: '#fafafa', className: 'bg-neutral-50 border border-hairline' },
    { step: '100', hex: '#f5f5f5', className: 'bg-neutral-100' },
    { step: '150', hex: '#ececec', className: 'bg-neutral-150' },
    { step: '200', hex: '#e6e6e6', className: 'bg-neutral-200' },
    { step: '300', hex: '#d4d4d4', className: 'bg-neutral-300' },
    { step: '400', hex: '#a1a1a1', className: 'bg-neutral-400' },
    { step: '500', hex: '#737373', className: 'bg-neutral-500' },
    { step: '600', hex: '#525252', className: 'bg-neutral-600' },
    { step: '700', hex: '#404040', className: 'bg-neutral-700' },
    { step: '800', hex: '#262626', className: 'bg-neutral-800' },
    { step: '900', hex: '#171717', className: 'bg-neutral-900' },
    { step: '950', hex: '#0a0a0a', className: 'bg-neutral-950' },
  ],
  Emerald: [
    { step: '50', hex: '#ecfdf5', className: 'bg-emerald-50 border border-hairline' },
    { step: '100', hex: '#d1fae5', className: 'bg-emerald-100' },
    { step: '200', hex: '#a7f3d0', className: 'bg-emerald-200' },
    { step: '300', hex: '#6ee7b7', className: 'bg-emerald-300' },
    { step: '400', hex: '#34d399', className: 'bg-emerald-400' },
    { step: '500', hex: '#10b981', className: 'bg-emerald-500' },
    { step: '600', hex: '#059669', className: 'bg-emerald-600' },
    { step: '700', hex: '#047857', className: 'bg-emerald-700' },
    { step: '800', hex: '#065f46', className: 'bg-emerald-800' },
    { step: '900', hex: '#064e3b', className: 'bg-emerald-900' },
    { step: '950', hex: '#022c22', className: 'bg-emerald-950' },
  ],
}

export const semanticColors = [
  { name: 'ink', hex: '#171717', role: 'Títulos e texto principal', className: 'bg-ink' },
  { name: 'body', hex: '#262626', role: 'Texto de corpo', className: 'bg-body' },
  { name: 'mute', hex: '#525252', role: 'Texto secundário', className: 'bg-mute' },
  { name: 'faint', hex: '#a1a1a1', role: 'Placeholder / desabilitado', className: 'bg-faint' },
  { name: 'hairline', hex: '#ececec', role: 'Bordas 1px', className: 'bg-hairline border border-hairline-strong' },
  { name: 'canvas', hex: '#fafafa', role: 'Fundo da página', className: 'bg-canvas border border-hairline' },
  { name: 'surface', hex: '#ffffff', role: 'Superfície de cards', className: 'bg-surface border border-hairline' },
  { name: 'emerald', hex: '#10b981', role: 'Acento da marca', className: 'bg-emerald' },
]

export const feedbackColors = [
  { name: 'success', hex: '#10b981', className: 'bg-success' },
  { name: 'warning', hex: '#f5a623', className: 'bg-warning' },
  { name: 'danger', hex: '#ef4444', className: 'bg-danger' },
  { name: 'info', hex: '#3b82f6', className: 'bg-info' },
]

export const spacingScale = [
  { name: '0.5', px: 2, className: 'w-0.5' },
  { name: '1', px: 4, className: 'w-1' },
  { name: '2', px: 8, className: 'w-2' },
  { name: '3', px: 12, className: 'w-3' },
  { name: '4', px: 16, className: 'w-4' },
  { name: '4.5', px: 18, className: 'w-4.5' },
  { name: '6', px: 24, className: 'w-6' },
  { name: '8', px: 32, className: 'w-8' },
  { name: '10', px: 40, className: 'w-10' },
  { name: '12', px: 48, className: 'w-12' },
  { name: '16', px: 64, className: 'w-16' },
  { name: '18', px: 72, className: 'w-18' },
  { name: '22', px: 88, className: 'w-22' },
  { name: 'section', px: 96, className: 'w-section' },
]

export const radiusScale = [
  { name: 'xs', px: 4, className: 'rounded-xs' },
  { name: 'sm', px: 8, className: 'rounded-sm' },
  { name: 'md', px: 12, className: 'rounded-md' },
  { name: 'lg', px: 16, className: 'rounded-lg' },
  { name: 'xl', px: 24, className: 'rounded-xl' },
  { name: '2xl', px: 32, className: 'rounded-2xl' },
  { name: 'full', px: 9999, className: 'rounded-full' },
]

export const elevationScale = [
  { name: 'xs', className: 'shadow-xs', use: 'Badges, chips' },
  { name: 'sm', className: 'shadow-sm', use: 'Cards em repouso' },
  { name: 'md', className: 'shadow-md', use: 'Dropdowns, popovers' },
  { name: 'lg', className: 'shadow-lg', use: 'Modais, painéis flutuantes' },
  { name: 'xl', className: 'shadow-xl', use: 'Destaques / overlays' },
]

export const motionTokens = {
  durations: [
    { name: 'fast', ms: 150, className: 'duration-fast' },
    { name: 'normal', ms: 200, className: 'duration-normal' },
    { name: 'slow', ms: 300, className: 'duration-slow' },
    { name: 'slower', ms: 500, className: 'duration-slower' },
  ],
  easings: [
    { name: 'out-soft', curve: 'cubic-bezier(0.22, 1, 0.36, 1)', className: 'ease-out-soft' },
    { name: 'in-out-soft', curve: 'cubic-bezier(0.65, 0, 0.35, 1)', className: 'ease-in-out-soft' },
  ],
}

export const breakpoints = [
  { name: 'sm', px: 640, use: 'Landscape phones' },
  { name: 'md', px: 768, use: 'Tablets' },
  { name: 'lg', px: 1024, use: 'Laptops' },
  { name: 'xl', px: 1280, use: 'Desktops' },
  { name: '2xl', px: 1440, use: 'Telas grandes' },
]

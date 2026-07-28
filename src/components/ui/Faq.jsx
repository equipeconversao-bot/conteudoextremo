import { useState } from 'react'
import { Plus } from 'lucide-react'
import { cn } from '../../lib/cn'

/**
 * FaqItem — item de acordeão em card (premium SaaS): borda que acende em
 * esmeralda ao abrir, fundo pontilhado sutil e ícone "+" que gira para "×".
 */
function FaqItem({ question, answer, defaultOpen = false, isFirst, isLast }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div
      className={cn(
        'group relative overflow-hidden border-x border-b transition-all duration-300',
        isFirst && 'rounded-t-xl border-t',
        isLast && 'rounded-b-xl',
        open
          ? 'z-10 border-emerald/30 bg-emerald/5'
          : 'z-0 border-hairline bg-surface hover:border-emerald/20',
      )}
    >
      {/* Fundo pontilhado ao abrir */}
      <div
        className={cn(
          'pointer-events-none absolute inset-0 z-0 transition-opacity duration-500',
          open ? 'opacity-100' : 'opacity-0',
        )}
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(16,185,129,0.08) 1px, transparent 1px)',
          backgroundSize: '16px 16px',
        }}
      />

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="relative z-10 flex w-full items-center justify-between gap-4 p-5 text-left text-base font-medium text-ink transition-colors group-hover:text-emerald-deep"
      >
        {question}
        <span
          className={cn(
            'flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-all duration-300',
            open
              ? 'rotate-45 bg-emerald/10 stroke-brand-gradient'
              : 'rotate-0 text-mute group-hover:bg-emerald/5 group-hover:stroke-brand-gradient',
          )}
        >
          <Plus size={16} strokeWidth={2.5} />
        </span>
      </button>

      <div
        className={cn(
          'relative z-10 grid px-5 transition-all duration-300 ease-out-soft',
          open ? 'grid-rows-[1fr] pb-5 opacity-100' : 'grid-rows-[0fr] opacity-0',
        )}
      >
        <div className="overflow-hidden pr-8 text-[15px] leading-relaxed text-body">{answer}</div>
      </div>
    </div>
  )
}

/**
 * Faq — lista de perguntas frequentes (acordeão em cards).
 * `items`: [{ question, answer, defaultOpen? }]
 */
export function Faq({ items = [], className }) {
  return (
    <div className={cn('flex w-full flex-col', className)}>
      {items.map((item, i) => (
        <FaqItem key={i} {...item} isFirst={i === 0} isLast={i === items.length - 1} />
      ))}
    </div>
  )
}

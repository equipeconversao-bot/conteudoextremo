import { Star } from 'lucide-react'
import { cn } from '../../lib/cn'

/**
 * Container — largura máxima centralizada com padding lateral responsivo.
 */
export function Container({ className, children, ...props }) {
  return (
    <div className={cn('mx-auto w-full max-w-container px-6 lg:px-8', className)} {...props}>
      {children}
    </div>
  )
}

/**
 * Section — bloco vertical com respiro generoso. Fundo branco por padrão.
 */
export function Section({ className, children, ...props }) {
  return (
    <section className={cn('py-20 lg:py-28', className)} {...props}>
      {children}
    </section>
  )
}

/**
 * Eyebrow — rótulo superior discreto (uppercase, tracking largo).
 */
export function Eyebrow({ className, children, ...props }) {
  return (
    <span
      className={cn('inline-flex items-center gap-2 text-eyebrow uppercase text-ink', className)}
      {...props}
    >
      {children}
    </span>
  )
}

/**
 * SectionHeader — eyebrow + título + descrição, centralizado por padrão.
 */
export function SectionHeader({
  eyebrow,
  title,
  description,
  align = 'center',
  className,
}) {
  const alignment = align === 'center' ? 'mx-auto items-center text-center' : 'items-start text-left'
  return (
    <div className={cn('flex max-w-2xl flex-col gap-4', alignment, className)}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      {title && <h2 className="text-balance text-heading-lg text-ink sm:text-heading-xl">{title}</h2>}
      {description && <p className="text-balance text-body-lg leading-relaxed text-mute">{description}</p>}
    </div>
  )
}

/**
 * Stars — linha de estrelas preenchidas. Preto (ink) por padrão.
 */
export function Stars({ count = 5, size = 15, className }) {
  return (
    <div className={cn('flex items-center gap-0.5', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} size={size} className="fill-brand-gradient" strokeWidth={0} />
      ))}
    </div>
  )
}

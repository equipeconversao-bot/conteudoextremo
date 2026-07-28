import { cn } from '../../lib/cn'

/**
 * Badge — rótulo compacto. Tons: emerald (sólido), soft (esmeralda suave),
 * neutral (contornado).
 */
const tones = {
  emerald: 'bg-brand-gradient text-white',
  soft: 'bg-emerald-soft text-emerald-deep',
  neutral: 'border border-hairline bg-surface text-body',
}

export function Badge({ tone = 'emerald', className, children, ...props }) {
  return (
    <span
      className={cn(
        'inline-flex items-center whitespace-nowrap rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide',
        tones[tone],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}

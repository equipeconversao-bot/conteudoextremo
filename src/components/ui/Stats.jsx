import { cn } from '../../lib/cn'

/**
 * Stats — grade de métricas (valor + rótulo).
 * `items`: [{ value, label }]. Variante `dark` para uso sobre fundo escuro.
 */
export function Stats({ items = [], dark = false, className }) {
  return (
    <div
      className={cn(
        'grid grid-cols-3 gap-6 border-t pt-8',
        dark ? 'border-white/15' : 'border-hairline',
        className,
      )}
    >
      {items.map((item, i) => (
        <div key={i}>
          <div className={cn('text-3xl font-semibold tracking-tight', dark ? 'text-white' : 'text-ink')}>
            {item.value}
          </div>
          <div className={cn('mt-1 text-sm', dark ? 'text-white/60' : 'text-mute')}>{item.label}</div>
        </div>
      ))}
    </div>
  )
}

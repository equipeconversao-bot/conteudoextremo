import { forwardRef } from 'react'
import { cn } from '../../lib/cn'

/**
 * Field — rótulo (eyebrow) + Input, empilhados.
 */
export function Field({ label, className, children }) {
  return (
    <label className={cn('flex flex-col gap-2', className)}>
      {label && (
        <span className="text-xs font-medium uppercase tracking-eyebrow text-mute">{label}</span>
      )}
      {children}
    </label>
  )
}

/**
 * Input — campo de texto em pílula com foco esmeralda sutil.
 */
export const Input = forwardRef(function Input({ className, ...props }, ref) {
  return (
    <input
      ref={ref}
      className={cn(
        'h-11 w-full rounded-full border border-hairline bg-surface px-5 text-sm text-ink',
        'placeholder:text-faint',
        'transition-colors focus:border-emerald focus:outline-none focus:ring-2 focus:ring-emerald-soft',
        className,
      )}
      {...props}
    />
  )
})

import { cn } from '../../lib/cn'
import { Check } from 'lucide-react'

export function Checkbox({ checked, onChange, disabled, label, className }) {
  return (
    <label className={cn('inline-flex items-center gap-2 cursor-pointer select-none', disabled && 'opacity-40 cursor-not-allowed', className)}>
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        disabled={disabled}
        onClick={(e) => { e.stopPropagation(); onChange?.(!checked) }}
        className={cn(
          'flex h-5 w-5 items-center justify-center rounded-md border-2 transition-all duration-fast shrink-0',
          checked
            ? 'border-emerald bg-emerald text-white shadow-sm'
            : 'border-hairline-strong bg-surface hover:border-emerald/50',
        )}
      >
        {checked && <Check size={13} strokeWidth={3} />}
      </button>
      {label && <span className="text-sm text-body">{label}</span>}
    </label>
  )
}

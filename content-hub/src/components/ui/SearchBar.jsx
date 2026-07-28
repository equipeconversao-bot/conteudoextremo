import { cn } from '../../lib/cn'
import { Search, X } from 'lucide-react'

export function SearchBar({ value, onChange, placeholder = 'Buscar...', className }) {
  return (
    <div className={cn('relative', className)}>
      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-faint" />
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          'h-10 w-full rounded-lg border border-hairline bg-surface pl-10 pr-10 text-sm text-ink',
          'placeholder:text-faint',
          'transition-colors focus:border-emerald focus:outline-none focus:ring-2 focus:ring-emerald-50 dark:focus:ring-emerald-950/40',
        )}
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-faint hover:text-ink transition-colors"
        >
          <X size={14} />
        </button>
      )}
    </div>
  )
}

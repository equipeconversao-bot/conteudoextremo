import { cn } from '../../lib/cn'

const base =
  'group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full font-medium leading-none tracking-tight whitespace-nowrap select-none transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald/40 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'

const sizes = {
  xs: 'px-3 py-1.5 text-xs',
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-base',
}

const variants = {
  primary:
    'bg-inverse text-on-inverse hover:opacity-90 shadow-sm',
  secondary:
    'bg-surface text-ink border border-hairline hover:bg-elevated shadow-xs',
  ghost:
    'bg-transparent text-body hover:bg-ink/5 hover:text-ink',
  danger:
    'bg-danger text-white hover:bg-red-600 shadow-sm',
  brand:
    'bg-brand-gradient text-white hover:opacity-90 shadow-emerald',
}

export function Button({ variant = 'primary', size = 'md', className, children, icon, ...props }) {
  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
      {icon && (
        <span className="ml-0.5 transition-transform group-hover:translate-x-0.5">{icon}</span>
      )}
    </button>
  )
}

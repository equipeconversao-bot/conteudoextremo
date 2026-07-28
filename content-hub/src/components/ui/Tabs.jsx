import { cn } from '../../lib/cn'

export function Tabs({ tabs, active, onChange, className }) {
  return (
    <div className={cn('flex gap-1 rounded-lg bg-elevated/60 p-1 border border-hairline-soft', className)}>
      {tabs.map(tab => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={cn(
            'relative px-4 py-2 text-sm font-medium rounded-md transition-all duration-normal',
            active === tab.key
              ? 'bg-surface text-ink shadow-sm'
              : 'text-mute hover:text-ink hover:bg-surface/50',
          )}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span className={cn(
              'ml-2 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-semibold',
              active === tab.key
                ? 'bg-emerald/10 text-emerald-deep'
                : 'bg-ink/5 text-mute',
            )}>
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}

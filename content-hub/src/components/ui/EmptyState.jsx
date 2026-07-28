import { cn } from '../../lib/cn'
import { FileQuestion } from 'lucide-react'

export function EmptyState({ icon: Icon = FileQuestion, title, description, action, className }) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 px-6 text-center', className)}>
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-elevated text-mute">
        <Icon size={28} strokeWidth={1.5} />
      </div>
      <h3 className="text-heading-sm text-ink mb-1">{title}</h3>
      {description && <p className="text-sm text-mute max-w-sm">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

import { cn } from '../../lib/cn'
import { ThemeToggle } from '../ui/ThemeToggle'
import { Logo } from '../ui/Logo'
import {
  LayoutGrid, Calendar, Video, Film, Scissors, MessageSquareQuote,
  BarChart3, ChevronRight, Settings, TrendingUp, Users, Bot, PenBox
} from 'lucide-react'

const navSections = [
  {
    title: 'Organização',
    icon: LayoutGrid,
    items: [
      { key: 'videos-longos', label: 'Vídeos Longos', icon: Video },
      { key: 'videos-curtos', label: 'Vídeos Curtos', icon: Film },
      { key: 'cortes', label: 'Cortes', icon: Scissors },
      { key: 'frases', label: 'Frases', icon: MessageSquareQuote },
    ],
  },
  {
    title: 'Produção',
    icon: PenBox,
    items: [
      { key: 'producao', label: 'Claude AI', icon: Bot },
    ],
  },
  {
    title: 'Planejamento',
    icon: Calendar,
    items: [
      { key: 'calendario', label: 'Calendário', icon: Calendar },
      { key: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    ],
  },
  {
    title: 'Analytics',
    icon: TrendingUp,
    items: [
      { key: 'analytics', label: 'Analytics', icon: TrendingUp },
    ],
  },
  {
    title: 'Sistema',
    icon: Settings,
    items: [
      { key: 'equipe', label: 'Equipe', icon: Users },
      { key: 'settings', label: 'Configurações', icon: Settings },
    ],
  },
]

export function Sidebar({ activePage, onNavigate, collapsed, onToggleCollapse }) {
  return (
    <aside className={cn(
      'sidebar flex h-screen flex-col transition-all duration-slow',
      collapsed ? 'w-[68px]' : 'w-[260px]',
    )}>
      {/* Logo Header */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-hairline overflow-hidden min-h-[73px]">
        {collapsed ? (
          <Logo iconOnly className="h-7 w-auto mx-auto" />
        ) : (
          <Logo className="h-7 w-auto max-w-[200px]" />
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto custom-scrollbar py-4 px-3">
        {navSections.map(section => (
          <div key={section.title} className="mb-6">
            {!collapsed && (
              <span className="px-3 mb-2 block text-[10px] font-semibold uppercase tracking-widest text-faint">
                {section.title}
              </span>
            )}
            <div className="flex flex-col gap-0.5">
              {section.items.map(item => {
                const Icon = item.icon
                const isActive = activePage === item.key
                return (
                  <button
                    key={item.key}
                    onClick={() => onNavigate(item.key)}
                    title={collapsed ? item.label : undefined}
                    className={cn(
                      'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-fast',
                      isActive
                        ? 'bg-emerald/10 text-emerald-deep dark:text-emerald-400'
                        : 'text-mute hover:bg-ink/5 hover:text-ink',
                      collapsed && 'justify-center px-0',
                    )}
                  >
                    <Icon size={18} strokeWidth={isActive ? 2 : 1.5} className="shrink-0" />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                    {!collapsed && isActive && (
                      <ChevronRight size={14} className="ml-auto text-emerald/50" />
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className={cn(
        'border-t border-hairline p-3 flex items-center',
        collapsed ? 'justify-center' : 'justify-between',
      )}>
        <ThemeToggle />
        {!collapsed && (
          <button
            onClick={onToggleCollapse}
            className="text-[11px] text-faint hover:text-mute transition-colors"
          >
            Recolher
          </button>
        )}
        {collapsed && (
          <button
            onClick={onToggleCollapse}
            className="text-faint hover:text-mute transition-colors ml-1"
            title="Expandir menu"
          >
            <ChevronRight size={14} />
          </button>
        )}
      </div>
    </aside>
  )
}

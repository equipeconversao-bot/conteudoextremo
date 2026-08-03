import { cn } from '../../lib/cn'
import { ThemeToggle } from '../ui/ThemeToggle'
import { Logo } from '../ui/Logo'
import { useAuth } from '../../store/AuthContext'
import {
  LayoutGrid, Calendar, Video, Film, Scissors, MessageSquareQuote,
  BarChart3, ChevronRight, Settings, TrendingUp, Users, Bot, PenBox, Pickaxe, FileVideo,
  ShieldCheck, LogOut, Eye, Edit3, Shield
} from 'lucide-react'

export function Sidebar({ activePage, onNavigate, collapsed, onToggleCollapse }) {
  const { user, isAdmin, logout } = useAuth()

  const navSections = [
    {
      title: 'Organização',
      icon: LayoutGrid,
      items: [
        { key: 'videos-longos', label: 'Vídeos Longos', icon: Video },
        { key: 'videos-curtos', label: 'Vídeos Curtos', icon: Film },
        { key: 'cortes', label: 'Carrossel', icon: LayoutGrid },
        { key: 'frases', label: 'Frases', icon: MessageSquareQuote },
      ],
    },
    {
      title: 'Produção',
      icon: PenBox,
      items: [
        { key: 'criativos', label: 'Criativos', icon: FileVideo },
        { key: 'producao', label: 'Claude AI', icon: Bot },
        { key: 'mineracao', label: 'Mineração', icon: Pickaxe },
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
        ...(isAdmin ? [{ key: 'usuarios', label: 'Usuários & Permissões', icon: ShieldCheck }] : []),
        { key: 'equipe', label: 'Equipe', icon: Users },
        { key: 'settings', label: 'Configurações', icon: Settings },
      ],
    },
  ]

  const roleLabel = {
    admin: 'Admin',
    editor: 'Editor',
    visualizador: 'Visualizador',
  }[user?.role || 'visualizador']

  const roleBadgeStyle = {
    admin: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    editor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    visualizador: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  }[user?.role || 'visualizador']

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

      {/* User Info & Footer */}
      <div className="border-t border-hairline p-3 flex flex-col gap-3 shrink-0">
        
        {/* Logged User Info Pill */}
        {!collapsed && user && (
          <div className="flex items-center justify-between p-2 rounded-xl bg-elevated/60 border border-hairline">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald/10 text-emerald font-bold text-xs">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <div className="overflow-hidden text-left">
                <p className="text-xs font-bold text-ink truncate">{user.name}</p>
                <span className={`inline-block px-1.5 py-0.2 rounded text-[9px] font-bold border ${roleBadgeStyle}`}>
                  {roleLabel}
                </span>
              </div>
            </div>
            <button
              onClick={logout}
              className="p-1.5 text-mute hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-colors shrink-0"
              title="Sair da Conta"
            >
              <LogOut size={15} />
            </button>
          </div>
        )}

        {/* Footer Actions */}
        <div className={cn(
          'flex items-center',
          collapsed ? 'justify-center flex-col gap-2' : 'justify-between',
        )}>
          <ThemeToggle />
          
          {collapsed && user && (
            <button
              onClick={logout}
              className="p-1.5 text-mute hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-colors"
              title="Sair"
            >
              <LogOut size={16} />
            </button>
          )}

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
              className="text-faint hover:text-mute transition-colors mt-1"
              title="Expandir menu"
            >
              <ChevronRight size={14} />
            </button>
          )}
        </div>

      </div>
    </aside>
  )
}

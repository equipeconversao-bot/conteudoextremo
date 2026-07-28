import { useSyncExternalStore } from 'react'
import { Sun, Moon } from 'lucide-react'
import { cn } from '../../lib/cn'

const listeners = new Set()

function subscribe(cb) {
  listeners.add(cb)
  return () => listeners.delete(cb)
}

function getSnapshot() {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

function setTheme(theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark')
  try {
    localStorage.setItem('theme', theme)
  } catch (e) { /* ignore */ }
  listeners.forEach(l => l())
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, () => 'light')
  return {
    theme,
    setTheme,
    toggle: () => setTheme(theme === 'dark' ? 'light' : 'dark'),
  }
}

export function ThemeToggle({ className }) {
  const { theme, toggle } = useTheme()
  const isDark = theme === 'dark'
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
      title={isDark ? 'Tema claro' : 'Tema escuro'}
      className={cn(
        'inline-flex h-9 w-9 items-center justify-center rounded-lg border border-hairline bg-surface text-mute transition-colors duration-fast hover:text-ink hover:bg-elevated',
        className,
      )}
    >
      {isDark ? <Sun size={17} strokeWidth={1.75} /> : <Moon size={17} strokeWidth={1.75} />}
    </button>
  )
}

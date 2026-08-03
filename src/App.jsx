import { useState } from 'react'
import Foundations from './examples/Foundations'
import Showcase from './examples/Showcase'
import LandingPage from './examples/LandingPage'
import { ThemeToggle } from './components/ui'
import { cn } from './lib/cn'

/**
 * App — alterna entre Foundations (tokens), Showcase (componentes) e a Landing
 * de exemplo. Showcase e Landing são demonstrações de uso da biblioteca.
 */
const views = [
  { id: 'foundations', label: 'Foundations' },
  { id: 'showcase', label: 'Componentes' },
  { id: 'landing', label: 'Landing (exemplo)' },
]

const screens = {
  foundations: Foundations,
  showcase: Showcase,
  landing: LandingPage,
}

export default function App() {
  const [view, setView] = useState('foundations')
  return (
    <div>
      <svg className="pointer-events-none absolute h-0 w-0">
        <defs>
          <linearGradient id="brand-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop stopColor="var(--brand-grad-from)" offset="0%" />
            <stop stopColor="var(--brand-grad-to)" offset="100%" />
          </linearGradient>
        </defs>
      </svg>
      {/* Alternador flutuante de exemplos (não faz parte da biblioteca) */}
      <div className="fixed bottom-5 left-1/2 z-toast flex -translate-x-1/2 items-center gap-1 rounded-full border border-hairline bg-surface/90 p-1 shadow-soft backdrop-blur">
        {views.map((v) => (
          <button
            key={v.id}
            onClick={() => setView(v.id)}
            className={cn(
              'rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
              view === v.id ? 'bg-inverse text-on-inverse' : 'text-body hover:text-ink',
            )}
          >
            {v.label}
          </button>
        ))}
        <span className="mx-0.5 h-5 w-px bg-hairline" />
        <ThemeToggle className="h-8 w-8 border-0" />
      </div>

      {(() => {
        const Screen = screens[view]
        return <Screen />
      })()}
    </div>
  )
}

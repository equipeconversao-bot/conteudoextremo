import { cn } from '../../lib/cn'
import { Button } from './Button'
import { ThemeToggle } from './ThemeToggle'
import { Logo } from './Logo'

/**
 * Navbar — barra superior clean: fundo branco translúcido, borda inferior 1px.
 * `links`: [{ label, href }]. `logo`: caminho do SVG.
 */
export function Navbar({
  logo = '/logo.svg',
  brand = 'Conversão Extrema',
  links = [],
  className,
}) {
  return (
    <header
      className={cn(
        'sticky top-0 z-sticky border-b border-hairline bg-surface/80 backdrop-blur-md',
        className,
      )}
    >
      <div className="mx-auto flex w-full max-w-container items-center justify-between px-6 py-4 lg:px-8">
        <a href="#" className="flex items-center" aria-label={brand}>
          <Logo className="h-6 w-auto" />
        </a>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-body transition-colors hover:bg-ink/5 hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button as="a" href="#" variant="ghost" size="sm" className="hidden sm:inline-flex">
            Entrar
          </Button>
          <Button as="a" href="#pricing" variant="shiny" size="sm">
            Começar agora
          </Button>
        </div>
      </div>
    </header>
  )
}

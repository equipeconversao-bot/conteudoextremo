import { Check, Play, TrendingUp, Video } from 'lucide-react'
import { cn } from '../../lib/cn'
import { Stars } from './primitives'

/** VerifiedBadge — selo verde de "cliente verificado". */
function VerifiedBadge() {
  return (
    <span
      className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-brand-gradient text-white"
      title="Cliente verificado"
    >
      <Check size={10} strokeWidth={3} />
    </span>
  )
}

/** Author — foto + nome (com selo) + cargo. */
function Author({ avatar, name, role }) {
  return (
    <figcaption className="flex items-center gap-3">
      <img
        src={avatar}
        alt={`Foto de ${name}`}
        className="h-12 w-12 shrink-0 rounded-full border border-hairline object-cover"
      />
      <div>
        <div className="flex items-center gap-1.5 text-sm font-medium text-ink">
          {name}
          <VerifiedBadge />
        </div>
        <div className="mt-0.5 text-xs text-mute">{role}</div>
      </div>
    </figcaption>
  )
}

/**
 * TestimonialCard — depoimento em texto: estrelas pretas, citação e foto no rodapé.
 */
export function TestimonialCard({ quote, name, role, avatar, className }) {
  return (
    <figure className={cn('premium-card flex flex-col justify-between gap-8 p-8', className)}>
      <div>
        <Stars />
        <blockquote className="mt-6 text-base leading-relaxed text-body">“{quote}”</blockquote>
      </div>
      <Author avatar={avatar} name={name} role={role} />
    </figure>
  )
}

/**
 * VideoTestimonialCard — depoimento em vídeo: thumbnail com play e badge de
 * resultado no topo; corpo com estrelas, citação e autor (foto) no rodapé.
 */
export function VideoTestimonialCard({
  thumbnail,
  avatar,
  name,
  role,
  duration = '2:14',
  quote,
  result,
  onPlay,
  className,
}) {
  return (
    <div className={cn('group/vid flex flex-col premium-card', className)}>
      <div className="relative aspect-[16/10] overflow-hidden">
        <img src={thumbnail} alt={`Depoimento em vídeo de ${name}`} className="h-full w-full object-cover" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {result && (
          <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-black/5 bg-white/95 px-3 py-1 text-xs font-semibold text-neutral-900 shadow-sm backdrop-blur-md">
            <TrendingUp size={14} /> {result}
          </span>
        )}

        <button
          type="button"
          onClick={onPlay}
          aria-label="Reproduzir depoimento em vídeo"
          className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-neutral-900 shadow-soft transition-transform duration-200 hover:scale-105"
        >
          <Play size={26} className="ml-0.5 fill-current" strokeWidth={0} />
        </button>

        <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full border border-black/5 bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-neutral-900 backdrop-blur-md">
          <Video size={12} /> {duration}
        </span>
      </div>

      <div className="flex flex-1 flex-col justify-between gap-8 p-8">
        <div>
          <Stars />
          <blockquote className="mt-6 text-base leading-relaxed text-body">“{quote}”</blockquote>
        </div>
        <Author avatar={avatar || thumbnail} name={name} role={role} />
      </div>
    </div>
  )
}

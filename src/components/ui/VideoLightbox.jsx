import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Play, X } from 'lucide-react'

export function VideoLightbox({ videoId }) {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <>
      <div 
        className="group relative aspect-video w-full cursor-pointer overflow-hidden rounded-2xl border border-hairline shadow-subtle ring-1 ring-inset ring-white/10"
        onClick={() => setIsOpen(true)}
      >
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {/* Aumentando o scale para 1.3 ou 1.5 esconde os botões e títulos do YouTube que aparecem nas bordas */}
          <iframe
            className="pointer-events-none h-full w-full scale-[1.35] transform"
            src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&loop=1&mute=1&controls=0&playlist=${videoId}&rel=0&modestbranding=1&playsinline=1&cc_load_policy=0&iv_load_policy=3&disablekb=1&fs=0`}
            title="Vídeo de demonstração"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            tabIndex="-1"
          ></iframe>
        </div>
        
        {/* Overlay escuro para destacar o ícone e capturar o clique */}
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-surface/10 transition-colors group-hover:bg-surface/5">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-gradient text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
            <Play className="ml-1 h-8 w-8" fill="currentColor" />
          </div>
        </div>
      </div>

      {mounted && isOpen && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 p-2 sm:p-6 md:p-12">
          {/* Header do Lightbox */}
          <div className="absolute right-4 top-4 z-10 md:right-8 md:top-8">
            <button 
              onClick={() => setIsOpen(false)}
              className="group flex items-center gap-3 text-white/70 transition-colors hover:text-white"
            >
              <span className="hidden text-sm font-medium tracking-wide uppercase sm:block">Fechar</span>
              <div className="rounded-full bg-white/10 p-3 transition-colors group-hover:bg-white/25">
                <X size={24} />
              </div>
            </button>
          </div>
          
          {/* Container do vídeo gigante */}
          <div className="relative aspect-video w-full max-w-[1400px] overflow-hidden rounded-xl bg-black shadow-[0_0_50px_rgba(0,0,0,0.8)] ring-1 ring-white/10">
            <iframe
              className="absolute inset-0 h-full w-full"
              src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&cc_load_policy=0&iv_load_policy=3&showinfo=0`}
              title="Vídeo principal"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}

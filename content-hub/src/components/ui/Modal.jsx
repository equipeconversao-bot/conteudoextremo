import { useEffect } from 'react'
import { cn } from '../../lib/cn'
import { X } from 'lucide-react'

export function Modal({ isOpen, onClose, title, children, className, size = 'md' }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  useEffect(() => {
    function handleEsc(e) {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="fixed inset-0 z-modal flex items-center justify-center p-4">
        <div
          className={cn(
            'modal-content w-full rounded-xl border border-hairline bg-surface shadow-xl',
            'max-h-[90vh] flex flex-col',
            sizeClasses[size],
            className,
          )}
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center justify-between border-b border-hairline px-6 py-4">
            <h2 className="text-heading-sm text-ink">{title}</h2>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-mute transition-colors hover:bg-ink/5 hover:text-ink"
            >
              <X size={18} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-5">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

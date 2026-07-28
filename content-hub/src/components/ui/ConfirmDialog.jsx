import { cn } from '../../lib/cn'
import { AlertTriangle } from 'lucide-react'
import { Button } from './Button'

export function ConfirmDialog({ isOpen, onClose, onConfirm, title, message }) {
  if (!isOpen) return null
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="fixed inset-0 z-modal flex items-center justify-center p-4">
        <div
          className="modal-content w-full max-w-sm rounded-xl border border-hairline bg-surface shadow-xl p-6"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 dark:bg-red-950/30">
              <AlertTriangle size={20} className="text-danger" />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-semibold text-ink">{title}</h3>
              <p className="mt-1 text-sm text-mute">{message}</p>
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <Button variant="ghost" size="sm" onClick={onClose}>Cancelar</Button>
            <Button variant="danger" size="sm" onClick={() => { onConfirm(); onClose() }}>Excluir</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

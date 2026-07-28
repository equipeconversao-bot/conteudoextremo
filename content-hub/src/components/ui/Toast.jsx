import { useState, useEffect, useCallback } from 'react'
import { cn } from '../../lib/cn'
import { CheckCircle, AlertCircle, X } from 'lucide-react'

let toastId = 0
const listeners = new Set()
let toasts = []

function notify(toast) {
  const id = ++toastId
  const newToast = { id, ...toast, exiting: false }
  toasts = [...toasts, newToast]
  listeners.forEach(l => l(toasts))

  setTimeout(() => {
    dismissToast(id)
  }, toast.duration || 3000)

  return id
}

function dismissToast(id) {
  toasts = toasts.map(t => t.id === id ? { ...t, exiting: true } : t)
  listeners.forEach(l => l(toasts))
  setTimeout(() => {
    toasts = toasts.filter(t => t.id !== id)
    listeners.forEach(l => l(toasts))
  }, 200)
}

export function toast(message, type = 'success') {
  return notify({ message, type })
}

export function ToastContainer() {
  const [items, setItems] = useState([])

  useEffect(() => {
    listeners.add(setItems)
    return () => listeners.delete(setItems)
  }, [])

  if (items.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-toast flex flex-col gap-2">
      {items.map(t => (
        <div
          key={t.id}
          className={cn(
            'flex items-center gap-3 rounded-lg border border-hairline bg-surface px-4 py-3 shadow-lg min-w-[300px]',
            t.exiting ? 'toast-exit' : 'toast-enter',
          )}
        >
          {t.type === 'success' ? (
            <CheckCircle size={18} className="text-emerald shrink-0" />
          ) : (
            <AlertCircle size={18} className="text-danger shrink-0" />
          )}
          <span className="text-sm text-ink flex-1">{t.message}</span>
          <button onClick={() => dismissToast(t.id)} className="text-mute hover:text-ink transition-colors">
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  )
}

import type { ReactNode } from 'react'
import { X } from 'lucide-react'

interface InfoModalProps {
  title: string
  onClose: () => void
  children: ReactNode
}

/** Simple placeholder overlay for menu items (Disclaimer, Contact, Info) that don't have real content yet. */
export function InfoModal({ title, onClose, children }: InfoModalProps) {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/30 p-6" onClick={onClose}>
      <div
        className="w-full max-w-xs rounded-2xl bg-pip-card p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-heading text-lg">{title}</h2>
          <button onClick={onClose} className="text-pip-text-soft">
            <X size={18} />
          </button>
        </div>
        <div className="text-sm leading-relaxed text-pip-text-soft">{children}</div>
      </div>
    </div>
  )
}

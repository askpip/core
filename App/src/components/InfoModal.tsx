import type { ReactNode } from 'react'
import { X } from 'lucide-react'

interface InfoModalProps {
  title: string
  onClose: () => void
  children: ReactNode
}

/**
 * Overlay for menu items (Disclaimer, Contact, Info, Privacy, My Name).
 *
 * Anchored with a fixed top offset (items-start + pt-24), not vertically
 * centered — items-center used to mean a short panel (Contact) sat lower
 * than a long one (Privacy), and for anything tall enough, centering pushed
 * its top — including the X — above the visible screen with no way to
 * scroll back up to it (see AppHeader.tsx for why: this needs to be
 * rendered outside the header now so it has the whole screen, not the
 * header's own short height, as its positioning box). pt-24 is chosen to
 * sit comfortably clear of the title/tagline/menu-button above it on every
 * page. The title-and-X row is `shrink-0` so it always stays put at that
 * same fixed spot even if the body below it needs to scroll — only the
 * body scrolls (max-h + overflow-y-auto), never the part with the close
 * button.
 */
export function InfoModal({ title, onClose, children }: InfoModalProps) {
  return (
    <div
      className="absolute inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/30 p-6 pt-24"
      onClick={onClose}
    >
      <div
        className="flex max-h-[70vh] w-full max-w-xs flex-col rounded-2xl bg-pip-card shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-center justify-between p-5 pb-3">
          <h2 className="font-heading text-lg">{title}</h2>
          <button onClick={onClose} className="text-pip-text-soft">
            <X size={18} />
          </button>
        </div>
        <div className="overflow-y-auto whitespace-pre-line px-5 pb-5 text-sm leading-relaxed text-pip-text-soft">
          {children}
        </div>
      </div>
    </div>
  )
}

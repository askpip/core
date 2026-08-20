import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MoreHorizontal } from 'lucide-react'
import titleImg from '@/assets/pip/title.png'
import { InfoModal } from './InfoModal'

type InfoPanel = 'disclaimer' | 'contact' | 'info' | null

const INFO_CONTENT: Record<Exclude<InfoPanel, null>, { title: string; body: string }> = {
  disclaimer: {
    title: 'Disclaimer',
    body: 'Ask Pip is a prototype. Pruning guidance shown here is for demonstration only and has not been reviewed by a horticultural expert.',
  },
  contact: {
    title: 'Contact',
    body: 'Contact details will go here once Ask Pip has a real support channel set up.',
  },
  info: {
    title: 'About Ask Pip',
    body: 'Ask Pip helps gardeners understand and confidently care for their plants, one careful decision at a time.',
  },
}

/** The approved "Ask Pip" title graphic, tagline, and the top-right options menu. */
export function AppHeader() {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [infoPanel, setInfoPanel] = useState<InfoPanel>(null)

  function openInfo(panel: Exclude<InfoPanel, null>) {
    setMenuOpen(false)
    setInfoPanel(panel)
  }

  return (
    <header className="relative flex flex-col items-center gap-1 px-4 pb-3 pt-6">
      <img src={titleImg} alt="Ask Pip" className="h-16 w-auto object-contain" />
      <p className="font-heading text-pip-primary text-sm italic tracking-wide">
        Growing Understanding, Cultivating Confidence
      </p>

      <button
        onClick={() => setMenuOpen((v) => !v)}
        className="absolute right-4 top-6 text-pip-text-soft"
        aria-label="Menu"
      >
        <MoreHorizontal size={22} />
      </button>

      {menuOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
          <div className="absolute right-4 top-14 z-50 w-44 overflow-hidden rounded-xl bg-pip-card shadow-xl">
            <MenuItem
              label="Back"
              onClick={() => {
                setMenuOpen(false)
                navigate(-1)
              }}
            />
            <MenuItem
              label="My Journal"
              onClick={() => {
                setMenuOpen(false)
                navigate('/library')
              }}
            />
            <MenuItem
              label="Go to Beginning"
              onClick={() => {
                setMenuOpen(false)
                navigate('/')
              }}
            />
            <MenuItem
              label="Log Out"
              onClick={() => {
                setMenuOpen(false)
                navigate('/')
              }}
            />
            <MenuItem label="Disclaimer" onClick={() => openInfo('disclaimer')} />
            <MenuItem label="Contact" onClick={() => openInfo('contact')} />
            <MenuItem label="Info" onClick={() => openInfo('info')} />
          </div>
        </>
      )}

      {infoPanel && (
        <InfoModal title={INFO_CONTENT[infoPanel].title} onClose={() => setInfoPanel(null)}>
          {INFO_CONTENT[infoPanel].body}
        </InfoModal>
      )}
    </header>
  )
}

function MenuItem({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="block w-full px-4 py-2.5 text-left text-sm text-pip-text hover:bg-pip-bg"
    >
      {label}
    </button>
  )
}

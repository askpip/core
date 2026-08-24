import { useState } from 'react'
import { useLocation, useNavigate, matchPath } from 'react-router-dom'
import { MoreHorizontal } from 'lucide-react'
import titleImg from '@/assets/pip/title.png'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth'
import { InfoModal } from './InfoModal'
import { Button } from './Button'

type InfoPanel = 'disclaimer' | 'contact' | 'info' | 'privacy' | null

/**
 * Where "Back" should go from each route. Deliberately not `navigate(-1)`:
 * that relies on the browser's actual session history matching the app's
 * logical structure, which breaks the moment someone opens a page via a
 * direct/refreshed URL, or unwinds further back than the screen implies —
 * both easy to hit while testing. A fixed, per-route parent is predictable
 * regardless of how the gardener arrived at the current screen.
 */
const BACK_TARGETS: { pattern: string; to: string }[] = [
  { pattern: '/journey/:id', to: '/library' },
  { pattern: '/plant/:id', to: '/library' },
  { pattern: '/new-plant', to: '/library' },
  { pattern: '/library', to: '/welcome' },
]

function backTargetFor(pathname: string): string {
  const match = BACK_TARGETS.find(({ pattern }) => matchPath(pattern, pathname))
  return match?.to ?? '/welcome'
}

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
  privacy: {
    title: 'Privacy',
    body: 'Your information is kept in a secure location and will never be shared or sold. Pip has access to what you enter here — your plants, photos and notes — so it can learn about your garden and help guide its care over time.',
  },
}

interface AppHeaderProps {
  /**
   * Overrides "Back" for a page with its own internal steps (e.g. Journey's
   * safety / questions / photos / observations phases), where a single
   * route-level parent isn't granular enough — the generic `BACK_TARGETS`
   * map above only knows how to leave the whole page, not step back within
   * it. When omitted, "Back" keeps the route-level behavior every other
   * page already relies on.
   */
  onBack?: () => void
}

/** The approved "Ask Pip" title graphic, tagline, and the top-right options menu. */
export function AppHeader({ onBack }: AppHeaderProps = {}) {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [infoPanel, setInfoPanel] = useState<InfoPanel>(null)
  // "My Name" editing — reuses InfoModal's chrome (see its render below)
  // rather than a dedicated modal component, since a name field and a Save
  // button are just as valid as InfoModal's usual static children.
  const [editingName, setEditingName] = useState(false)
  const [nameDraft, setNameDraft] = useState('')
  const [savingName, setSavingName] = useState(false)
  const [nameError, setNameError] = useState<string | null>(null)

  function openInfo(panel: Exclude<InfoPanel, null>) {
    setMenuOpen(false)
    setInfoPanel(panel)
  }

  function openNameEditor() {
    setMenuOpen(false)
    setNameError(null)
    const current = user?.user_metadata?.displayName
    setNameDraft(typeof current === 'string' ? current : '')
    setEditingName(true)
  }

  async function saveName() {
    if (!nameDraft.trim()) return
    setSavingName(true)
    setNameError(null)
    // updateUser triggers a USER_UPDATED auth event, which every page's own
    // useAuth() picks up — Welcome's greeting and Library's heading update
    // on their own, nothing else needs to know this ran.
    const { error } = await supabase.auth.updateUser({ data: { displayName: nameDraft.trim() } })
    setSavingName(false)
    if (error) {
      setNameError(error.message)
      return
    }
    setEditingName(false)
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
                if (onBack) {
                  onBack()
                } else {
                  navigate(backTargetFor(location.pathname))
                }
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
                // Not '/' — that's AuthGate, which immediately bounces an
                // already-signed-in gardener straight back to /library on
                // mount, making this look like it does nothing. /welcome is
                // the actual first screen after signing in.
                navigate('/welcome')
              }}
            />
            <MenuItem label="My Name" onClick={openNameEditor} />
            <MenuItem
              label="Log Out"
              onClick={() => {
                setMenuOpen(false)
                supabase.auth.signOut().finally(() => navigate('/'))
              }}
            />
            <MenuItem label="Disclaimer" onClick={() => openInfo('disclaimer')} />
            <MenuItem label="Privacy" onClick={() => openInfo('privacy')} />
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

      {editingName && (
        <InfoModal title="My Name" onClose={() => setEditingName(false)}>
          <div className="flex flex-col gap-3">
            <input
              type="text"
              autoFocus
              value={nameDraft}
              onChange={(e) => setNameDraft(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && saveName()}
              placeholder="Your name"
              className="input w-full text-pip-text"
            />
            {nameError && <p className="text-xs text-red-600">{nameError}</p>}
            <Button disabled={savingName || !nameDraft.trim()} onClick={saveName}>
              {savingName ? 'Saving…' : 'Save'}
            </Button>
          </div>
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

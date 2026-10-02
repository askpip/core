import { useState } from 'react'
import { useLocation, useNavigate, matchPath } from 'react-router-dom'
import { MoreHorizontal } from 'lucide-react'
import titleImg from '@/assets/pip/title.webp'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth'
import { markPasswordSet } from '@/lib/membership'
import {
  checkVersion,
  chromeGivesCleanerIcon,
  installRoute,
  isInstalled,
  refreshToLatest,
  showInstallDialog,
  versionLabel,
  type InstallRoute,
  type VersionCheck,
} from '@/lib/homeScreen'
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
  // "About this beta" replaced the Disclaimer on 3 October 2026 (wording approved by a Founder in chat;
  // Working/AI Outputs/Ask_Pip_Website_Wording.md, section 10). The same words are on askpip.garden.
  disclaimer: {
    title: 'About this beta',
    body: 'Ask Pip is in beta. Its care guidance is researched from reputable horticultural sources, and each piece shows its sources and a confidence rating. It has not been reviewed by a horticultural expert. Pip offers guidance, and you decide what to do with your rose. If you are unsure, ask an experienced local gardener.',
  },
  contact: {
    title: 'Contact',
    body: 'Questions, feedback, or just want to say hello? Reach the Ask Pip team at founders@askpip.garden.',
  },
  info: {
    title: 'About Ask Pip',
    // Two paragraphs, joined with a blank line — InfoModal's body renders
    // this with whitespace-pre-line specifically so that break shows up as
    // a real paragraph gap instead of running together as one block.
    body: "Ask Pip is here to help you understand your roses. Growing Understanding, Cultivating Confidence isn't just a tagline — it's the whole idea: Pip explains its reasoning, not just its conclusions, and only ever draws on guidance that's been carefully researched from reputable horticultural sources. If you ever want to know where an answer comes from, tap \"Where this comes from\" — Pip always shows its sources.\n\nEach piece of advice also carries its own confidence rating, which reflects how reliable the sources are, how well they agree, and what is still uncertain. And when Pip genuinely doesn't have solid guidance on something yet, it says so plainly. That honesty matters to us as much as the horticulture does. It is Pip's mission to help you cultivate your own confidence by sharing in an enjoyable journey of learning and understanding how to care for your plants.",
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
/**
 * Shown to Android gardeners in a browser other than Chrome, whose home-screen icon
 * would carry that browser's logo. Wording approved by a Founder in chat, 2 October 2026.
 */
function CleanerIconNote() {
  return (
    <p className="text-sm text-pip-text-soft">
      For the cleanest icon, open Ask Pip in Chrome and add it from there. It works from this browser too.
    </p>
  )
}

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
  // "Change Password" — same InfoModal chrome as "My Name" above. Works
  // whether or not a password exists yet: a gardener who skipped setting one
  // after their code sign-in (see AuthGate.tsx) can still start one here,
  // and it doubles as the ordinary "change my password" screen once they
  // have. Either way it ends by calling markPasswordSet(), so a gardener who
  // sets a password here is never asked again by AuthGate's post-code offer.
  const [changingPassword, setChangingPassword] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [savingPassword, setSavingPassword] = useState(false)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  // "Add to home screen" (2 October 2026). Menu only, by Founder decision: Pip does not
  // invite the gardener. Which instructions show depends on the browser (see
  // lib/homeScreen.ts). The item is hidden once Ask Pip runs from the home screen.
  const [installHelp, setInstallHelp] = useState<InstallRoute | null>(null)
  // "Check for updates" (2 October 2026, asked for by a Founder): lets a gardener check
  // for a new version themselves, in the browser or the home-screen app, and see which
  // version they are on. null = closed; 'checking' while the check runs.
  const [updateCheck, setUpdateCheck] = useState<VersionCheck | 'checking' | null>(null)

  function openUpdateCheck() {
    setMenuOpen(false)
    setUpdateCheck('checking')
    void checkVersion().then(setUpdateCheck)
  }

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

  function openPasswordEditor() {
    setMenuOpen(false)
    setPasswordError(null)
    setNewPassword('')
    setConfirmPassword('')
    setChangingPassword(true)
  }

  async function savePassword() {
    setPasswordError(null)
    if (newPassword.length < 8) {
      setPasswordError('Use at least 8 characters.')
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Those passwords don't match.")
      return
    }
    setSavingPassword(true)
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    setSavingPassword(false)
    if (error) {
      setPasswordError(error.message)
      return
    }
    // Best-effort, same as AuthGate's own set-password step: if this fails,
    // the only consequence is AuthGate offering the password step again
    // after a future code sign-in, which is safe, just slightly repetitive.
    await markPasswordSet()
    setChangingPassword(false)
  }

  return (
    // A Fragment, not just <header> — the two InfoModal panels below need
    // to size themselves against the whole phone screen, not against
    // header's own short height (see InfoModal.tsx's comment for why that
    // was cutting their close button off above the visible screen). header
    // stays `relative` for its own menu button/dropdown, which really are
    // meant to anchor to header specifically; the modals are rendered as
    // header's siblings instead, so their `absolute inset-0` resolves
    // against the nearest positioned ancestor above THAT — the phone-screen
    // container in App.tsx — giving them the full screen to center in.
    <>
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
              <MenuItem
                label="How Pip works"
                onClick={() => {
                  setMenuOpen(false)
                  navigate('/learn')
                }}
              />
              {!isInstalled() && (
                <MenuItem
                  label="Add to home screen"
                  onClick={() => {
                    setMenuOpen(false)
                    setInstallHelp(installRoute())
                  }}
                />
              )}
              <MenuItem label="Check for updates" onClick={openUpdateCheck} />
              <MenuItem label="My Name" onClick={openNameEditor} />
              <MenuItem label="Change Password" onClick={openPasswordEditor} />
              <MenuItem
                label="Log Out"
                onClick={() => {
                  setMenuOpen(false)
                  supabase.auth.signOut().finally(() => navigate('/'))
                }}
              />
              <MenuItem label="About this beta" onClick={() => openInfo('disclaimer')} />
              <MenuItem label="Privacy" onClick={() => openInfo('privacy')} />
              <MenuItem label="Contact" onClick={() => openInfo('contact')} />
              <MenuItem label="About" onClick={() => openInfo('info')} />
            </div>
          </>
        )}
      </header>

      {infoPanel && (
        <InfoModal title={INFO_CONTENT[infoPanel].title} onClose={() => setInfoPanel(null)}>
          {INFO_CONTENT[infoPanel].body}
          {/* Which build is running, so two phones (or the browser and the home-screen
              app) can be compared. See vite.config.ts. */}
          {infoPanel === 'info' && (
            <p className="mt-4 text-xs">
              Version:{' '}
              {versionLabel()}
            </p>
          )}
        </InfoModal>
      )}

      {installHelp && (
        <InfoModal title="Add Pip to your home screen" onClose={() => setInstallHelp(null)}>
          {/* Wording approved "for now" by a Founder in chat, 2 October 2026. The 'other'
              wording is a plain fallback for browsers with no install dialog of their own. */}
          {installHelp === 'prompt' && (
            <div className="flex flex-col gap-3">
              <p>Open Ask Pip like an app, straight from your phone.</p>
              {chromeGivesCleanerIcon() && <CleanerIconNote />}
              <Button
                onClick={() => {
                  setInstallHelp(null)
                  void showInstallDialog()
                }}
              >
                Add to home screen
              </Button>
              <Button variant="secondary" onClick={() => setInstallHelp(null)}>
                Not now
              </Button>
            </div>
          )}
          {installHelp === 'ios' && (
            <div className="flex flex-col gap-3">
              <ol className="flex list-decimal flex-col gap-1.5 pl-5">
                <li>Tap the Share button in Safari.</li>
                <li>Choose "Add to Home Screen".</li>
                <li>Tap Add.</li>
              </ol>
              <Button onClick={() => setInstallHelp(null)}>Got it</Button>
            </div>
          )}
          {installHelp === 'other' && (
            <div className="flex flex-col gap-3">
              <p>Open your browser's menu and choose "Add to Home screen" or "Install app".</p>
              {chromeGivesCleanerIcon() && <CleanerIconNote />}
              <Button onClick={() => setInstallHelp(null)}>Got it</Button>
            </div>
          )}
        </InfoModal>
      )}

      {updateCheck && (
        <InfoModal title="Check for updates" onClose={() => setUpdateCheck(null)}>
          <div className="flex flex-col gap-3">
            {updateCheck === 'checking' && <p>Checking…</p>}
            {updateCheck === 'latest' && <p>You have the latest version of Ask Pip.</p>}
            {updateCheck === 'newer' && (
              <>
                <p>A new version of Ask Pip is ready.</p>
                <Button onClick={() => void refreshToLatest()}>Refresh</Button>
              </>
            )}
            {updateCheck === 'unknown' && (
              <>
                <p>I couldn't check just now. Please check your connection and try again.</p>
                <Button variant="secondary" onClick={openUpdateCheck}>
                  Try again
                </Button>
              </>
            )}
            {updateCheck !== 'checking' && <p className="text-xs">Your version: {versionLabel()}</p>}
          </div>
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

      {changingPassword && (
        <InfoModal title="Change Password" onClose={() => setChangingPassword(false)}>
          <div className="flex flex-col gap-3">
            <input
              type="password"
              autoFocus
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New password"
              className="input w-full text-pip-text"
            />
            <input
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && savePassword()}
              placeholder="Confirm password"
              className="input w-full text-pip-text"
            />
            {passwordError && <p className="text-xs text-red-600">{passwordError}</p>}
            <Button disabled={savingPassword || !newPassword || !confirmPassword} onClick={savePassword}>
              {savingPassword ? 'Saving…' : 'Save'}
            </Button>
          </div>
        </InfoModal>
      )}
    </>
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

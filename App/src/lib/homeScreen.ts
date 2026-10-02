/**
 * The home-screen app (2 October 2026): adding Ask Pip to a phone's home screen,
 * keeping the app's files on the phone (public/sw.js), and noticing a new version.
 *
 * Founder decisions, 2 October 2026: the offer lives in the menu only (Pip does not
 * invite the gardener); the wording in AppHeader.tsx and NewVersionBanner.tsx is
 * approved "for now"; store apps are not planned yet.
 */

/** Chrome and Edge's install event. Not in TypeScript's own DOM types. */
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

let installEvent: BeforeInstallPromptEvent | null = null

/**
 * Call once at start-up. Holds on to the browser's install offer so the menu can use it
 * later, and stops the browser showing its own banner, since the offer is menu-only.
 */
export function watchForInstallOffer() {
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault()
    installEvent = event as BeforeInstallPromptEvent
  })
  window.addEventListener('appinstalled', () => {
    installEvent = null
  })
}

/** True when Ask Pip is already running from the home screen. */
export function isInstalled(): boolean {
  const iosStandalone = (navigator as Navigator & { standalone?: boolean }).standalone === true
  return iosStandalone || window.matchMedia('(display-mode: standalone)').matches
}

function isAppleTouchDevice(): boolean {
  const ua = navigator.userAgent
  // iPadOS reports itself as a Mac; a Mac with a touch screen is an iPad.
  return /iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)
}

/**
 * How this browser can add Ask Pip to the home screen:
 * - 'prompt': the browser offers its own install dialog (Android, Chrome and Edge);
 * - 'ios': the gardener uses Share, then "Add to Home Screen";
 * - 'other': the gardener uses the browser's own menu.
 */
export type InstallRoute = 'prompt' | 'ios' | 'other'

export function installRoute(): InstallRoute {
  if (installEvent) return 'prompt'
  if (isAppleTouchDevice()) return 'ios'
  return 'other'
}

/** Shows the browser's install dialog. Resolves true if the gardener accepted. */
export async function showInstallDialog(): Promise<boolean> {
  const event = installEvent
  if (!event) return false
  await event.prompt()
  const { outcome } = await event.userChoice
  // The browser allows each offer to be used once.
  installEvent = null
  return outcome === 'accepted'
}

/** Registers public/sw.js. Only in a real build; the dev server has nothing to store. */
export function registerServiceWorker() {
  if (!import.meta.env.PROD || !('serviceWorker' in navigator)) return
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((error) => {
      console.warn('Service worker not registered:', error)
    })
  })
}

/** The app's main script, as named in a page's HTML. Its name changes with every build. */
function mainScript(html: string): string | null {
  const match = html.match(/<script[^>]+type="module"[^>]+src="([^"]+)"/)
  return match ? match[1] : null
}

/**
 * True when the server has a newer build than the one running. Compares the main
 * script named in a fresh copy of the page with the one this page loaded. Any failure
 * (no connection, an odd response) counts as "no new version".
 */
export async function newVersionAvailable(): Promise<boolean> {
  if (!import.meta.env.PROD) return false
  try {
    const running = document.querySelector<HTMLScriptElement>('script[type="module"][src]')?.getAttribute('src')
    if (!running) return false
    const response = await fetch('/', { cache: 'no-store' })
    if (!response.ok) return false
    const latest = mainScript(await response.text())
    return latest !== null && latest !== running
  } catch {
    return false
  }
}

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

/**
 * True on an Android phone in a browser that adds Ask Pip as a shortcut, which Android
 * stamps with that browser's logo (Edge, Firefox, Opera, Brave, Vivaldi, DuckDuckGo).
 * Chrome builds an installed app with a clean icon, and so does Samsung Internet on
 * Samsung phones, so neither is flagged. Found by a Founder on 2 October 2026: the icon
 * added from Edge carried the Edge logo, and the one from Chrome did not.
 */
export function chromeGivesCleanerIcon(): boolean {
  const ua = navigator.userAgent
  if (!/Android/.test(ua)) return false
  // Brave reports itself as Chrome; it is known only by this property.
  const brave = 'brave' in navigator
  return brave || /EdgA\/|Firefox\/|OPR\/|Vivaldi\/|DuckDuckGo\//.test(ua)
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
 * Whether the server has a newer build than the one running:
 * - 'newer': it does;
 * - 'latest': this is the newest build;
 * - 'unknown': it couldn't be checked (no connection, or an odd response).
 * Compares the main script named in a fresh copy of the page with the one this page loaded.
 */
export type VersionCheck = 'newer' | 'latest' | 'unknown'

export async function checkVersion(): Promise<VersionCheck> {
  if (!import.meta.env.PROD) return 'unknown'
  try {
    const running = document.querySelector<HTMLScriptElement>('script[type="module"][src]')?.getAttribute('src')
    if (!running) return 'unknown'
    const response = await fetch('/', { cache: 'no-store' })
    if (!response.ok) return 'unknown'
    const latest = mainScript(await response.text())
    if (latest === null) return 'unknown'
    return latest === running ? 'latest' : 'newer'
  } catch {
    return 'unknown'
  }
}

/** True when the server has a newer build. A check that fails counts as "no new version". */
export async function newVersionAvailable(): Promise<boolean> {
  return (await checkVersion()) === 'newer'
}

/**
 * Loads the newest build. Before reloading it asks the service worker to update itself
 * and throws away the copy of the app kept on the phone, so nothing stale can be shown.
 * The copy is stored again as the page loads.
 */
export async function refreshToLatest(): Promise<void> {
  try {
    const registration = await navigator.serviceWorker?.getRegistration()
    await registration?.update()
  } catch {
    // Not fatal: the reload below still fetches the page from the network first.
  }
  try {
    const names = await caches.keys()
    await Promise.all(names.filter((name) => name.startsWith('askpip-')).map((name) => caches.delete(name)))
  } catch {
    // Not fatal, for the same reason.
  }
  window.location.reload()
}

/** The running build, for display: "2 Oct 2026, 10:04 pm (3de917a)". */
export function versionLabel(): string {
  const built = new Date(__APP_BUILD__.builtAt).toLocaleString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
  return `${built} (${__APP_BUILD__.commit})`
}

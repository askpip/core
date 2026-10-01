# Proposal: Ask Pip on the Home Screen

**Status:** Proposal, not built. **Prepared by:** Claude, at Shaphan's request, 2 October 2026. **Live version:** Claude Doc at https://claude.ai/code/artifact/0a09ab90-6ff7-4b0a-8be7-259780c2b133 (this file is a copy of it as at 2 October 2026; edits made there aren't copied here automatically).

## Summary

Ask Pip can sit on a gardener's home screen in two ways: as an installable web app (a "progressive web app"), or as a real App Store and Google Play app. Recommendation: make it an installable web app now, which takes about 1–2 days and also makes iPhone notifications possible for the seasonal reminders. Consider store apps later, once there are real users and being findable in the stores matters.

## Where the app is today

Ask Pip runs at app.askpip.garden as a website, deployed from `main` by Vercel. It has a favicon but none of the parts that make a site installable: no app manifest, no home-screen icons, no iPhone home-screen settings and no offline support. A gardener can still bookmark it, but it opens in the browser with its address bar, like any website.

Two things already help: the approved rose knowledge is bundled into the app as a snapshot, so it can display without a connection, and the app was built with Vite, which has a well-used plug-in for installable web apps.

## Route 1: installable web app

**What gardeners get:** Pip's own icon on the home screen; it opens full-screen with no browser bars, shows a splash screen while loading, and appears in the phone's app switcher like any app. It opens quickly because the app's files are kept on the phone, and the approved rose knowledge still shows without a connection. Photos, saving to the journal and Pip's photo look still need a connection.

**What it takes (about 1–2 days):**

1. An app manifest: name "Ask Pip", short name, Leaf & Petal colours, "open full-screen", and the page it starts on.
2. Icons in the sizes phones need (including Android's rounded-mask version and an iPhone icon), made from the Pip artwork. Needs your approval of the icon.
3. iPhone-specific settings so it opens full-screen and uses the right status-bar colour.
4. A background script (service worker) that keeps the app's files on the phone and tells the gardener when a new version is ready: "A new version of Pip is ready. Tap to refresh."
5. An install prompt in the app (see the next section), shown at a sensible moment rather than on first visit.
6. Testing on an Android phone and an iPhone.

**Bonus:** on iPhone, phone notifications only work for web apps added to the Home Screen (iOS 16.4 or later). This route is what makes stage 2 of the seasonal reminders proposal possible for iPhone users.

## How installing works

- **Android (Chrome):** the browser offers "Install app" itself. Pip can also show its own "Add Pip to your home screen" button that triggers the same install.
- **iPhone (Safari):** there's no automatic prompt. Pip shows a short how-to with a picture: tap Share, then "Add to Home Screen". It only appears on iPhones not already using the installed app.
- **When Pip offers it:** suggested points are after a gardener adds their first rose, and when they say yes to reminders (because iPhone notifications need it). It can be dismissed and won't keep nagging.
- **Computers:** Chrome and Edge can install it too; it's optional and not promoted.

## Route 2: App Store and Google Play app

The same app code is wrapped in a native shell (Capacitor) and published to both stores.

**What it takes (about 1–2 weeks, plus store review):**

- Accounts: Apple Developer Program (about US$99 a year) and Google Play Console (US$25 once).
- iPhone builds need a Mac or a paid cloud build service.
- Store listings: screenshots, descriptions, privacy labels, a privacy policy page, age rating.
- Store review for every app release (new rose knowledge still arrives live from the LIL without a release).
- Native notifications, camera and photo-library permissions wired up.

**What it gains:** gardeners can find Ask Pip in the stores; notifications are more reliable, especially on iPhone; slightly better camera handling.

**What it costs on an ongoing basis:** the yearly Apple fee, store compliance, and slower updates to app screens because of review.

## The two routes side by side

| | Installable web app | Store apps |
| --- | --- | --- |
| Build effort | About 1–2 days | About 1–2 weeks, plus review |
| Cost | None beyond current hosting | About US$99 a year (Apple) plus US$25 once (Google) |
| Home-screen icon | Yes (iPhone users add it by hand) | Yes, installed from the store |
| Found in app stores | No | Yes |
| Notifications | Android and computers; iPhone only once added to the Home Screen | Everyone who allows them |
| Updates to app screens | Instant, on every push | Through store review |
| Works partly offline | Yes | Yes |
| Can be done later without waste | — | Yes: the web-app work carries over |

## Risks and how they're handled

- **Gardeners stuck on an old version.** A stored copy can keep showing yesterday's app after a push. Handled with the "new version ready, tap to refresh" prompt and by never caching the live rose knowledge or sign-in calls.
- **Order of releases.** As with the blind-shoot check, app changes that new knowledge records depend on must go live before those records are published; installed copies make this matter more.
- **iPhone users never install it.** The how-to helps, but many won't. The app still works fully in the browser, so nothing is lost.
- **Storage on the phone.** The app's files are small (a few megabytes). Photos stay in Supabase, not on the phone.
- **Sign-in.** Gardeners stay signed in when they open the installed app; the first time on iPhone they may need to sign in again, because the home-screen app keeps its own storage.

## Founder decisions needed

- [ ] Go ahead with the installable web app now?
- [ ] Approve the home-screen icon and name ("Ask Pip"), and the splash colours
- [ ] When Pip offers "Add to home screen": after the first rose, when turning on reminders, or both
- [ ] Approve the install how-to wording and the "new version ready" message
- [ ] Store apps: not now, or plan them for a set milestone (for example, a public launch)

## Status and next step

Proposal only; nothing has been built. It has no research dependency, so it can be built whenever the Founders say go, and it pairs naturally with stage 2 of the seasonal reminders proposal. The next step is the go-ahead and the icon approval.

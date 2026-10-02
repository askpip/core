# The Ask Pip website (askpip.garden)

The public front door to Ask Pip: what it is, what Pip does today, the vision, and the invite request for the beta. The app itself stays at app.askpip.garden (`App/`).

**Status, 3 October 2026:** built with the wording a Founder approved in chat on 2 and 3 October 2026. It is **not live**: there is no Vercel project for this folder yet and askpip.garden doesn't point at it. The forms are wired to the database. The emails are switched off until a Founder says to switch them on.

## What is here

| File | What it is |
|---|---|
| `index.html` | The one-page site. Its words are the approved wording in `Working/AI Outputs/Ask_Pip_Website_Wording.md`; change them there first. |
| `maries-story.html` | Marie's Story in full. Generated from `MVP/Stories/Maries_Story.md`; don't edit it by hand. |
| `styles.css` | The look. Colours and type are the app's "Leaf & Petal" palette. |
| `privacy.html`, `terms.html` | Dated drafts for the invite-only beta. A lawyer checks them before any paid plan. |
| `site.js` | The two forms: "Request an invite" and "Follow progress". Each calls one database function (`site_request_invite`, `site_follow`) with the project's public key. |
| `assets/` | Pictures, app screens and the two typefaces. |
| `tools/build_story.py` | Rebuilds `maries-story.html` from the approved story: `python3 Site/tools/build_story.py`. |

There is no build step. The folder is served as it is.

## Decisions built in

- **No outside requests.** The page loads nothing from other websites: the typefaces (Atkinson Hyperlegible and Playfair Display, both under the SIL Open Font License) are served from `assets/fonts`, and there are no trackers, analytics or cookies.
- **Real app screens.** The phone pictures are captures of the app's own "How Pip works" pages and a real answer card, taken from the app's code on 2 October 2026. Screens of a pruning session, with a real rose, can replace them later.
- **Pictures.** The logo is `Graphics/Ask Pip Logo.png` cut to its circle. The garden scenes are `Graphics/Garden waving.png` and `Graphics/Garden rose.png`. `assets/share.jpg` is the picture shown when the link is shared; it is new and not yet approved.

## How a request travels

1. A gardener sends the form. `site_request_invite` checks it and saves one row in `beta_invite_requests`.
2. The Founders see it in the Garden Shed: Toolbox, "Beta Requests", with a count of unopened requests.
3. A Founder approves it. The gardener gets the invitation email, and their address may now create an Ask Pip account.
4. The gardener opens app.askpip.garden and signs in with that address.

The SQL is in `App/supabase/schema.sql` under "Beta invites". The Shed tool is described in `Shed/README.md`.

## Where it is published (3 October 2026)

The site is live at **https://askpip.garden**. `www.askpip.garden` redirects to it.

- **Vercel:** project `core-app` (team AskPip). Its root is the repository root, Framework "Other", no build command, and **Output Directory `Site`**, so only this folder is served. The rest of the repository returns "not found".
- **DNS at Hostinger:** an A record for `@` to `216.198.79.1` and a CNAME for `www` to `52a71ea8c3b35d30.vercel-dns-017.com`. The mailbox records, and the `app`, `shed` and `contact` records, are separate and must stay as they are.
- **Invite gate:** on. A Founder enabled Supabase Auth's "Before User Created" hook with the Postgres function `hook_beta_invite_only`. Only an address with an approved request can create an Ask Pip account. To switch it off, turn off the hook in Supabase: Authentication, Auth Hooks.
- **Emails:** on (`shed_config`: `beta_emails = 'on'`).
- **Feedback form:** built in the app (`App/src/pages/Feedback.tsx`), as the "Join the beta" wording promises.

## Still to do

1. Send one request from askpip.garden itself with a new address. That is also the first test of the notice email to founders@askpip.garden.
2. Try to sign up in the app with an address that has not been approved, to see the gate's message.

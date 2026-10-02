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

## Still to do before it goes live

1. A Founder creates a second Vercel project with this folder (`Site`) as its root and no build command, and points askpip.garden at it.
2. A Founder switches on the invite gate in Supabase: Authentication, Hooks, "Before User Created", Postgres function `hook_beta_invite_only`. Until then anyone can still create an account in the app.
3. The emails are switched on (`shed_config`: `beta_emails = 'on'`) once the email wording is approved.
4. A feedback form in the app. The approved wording promises one after a session, and it isn't built yet.
5. A real request sent from the deployed site, approved in the Shed, and the invitation received: the first full check with nothing stubbed.

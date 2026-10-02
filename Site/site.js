/*
 * The Ask Pip website's two forms: "Request an invite" and "Follow progress".
 *
 * Each calls one function in the Ask Pip database (Supabase): site_request_invite or
 * site_follow (App/supabase/schema.sql, "Beta invites"). The Founders read the requests
 * in the Garden Shed. The key below is the public one that every visitor's browser is
 * meant to hold: with it a visitor can call those two functions and nothing else. It
 * cannot read, change or delete anything.
 */
const SUPABASE_URL = 'https://lapscltduzkbldfwcemq.supabase.co'
// The project's public ("anon") key: the same one the app and the Garden Shed already carry in the open.
const SUPABASE_PUBLIC_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhcHNjbHRkdXprYmxkZndjZW1xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODczMzgxMDQsImV4cCI6MjEwMjkxNDEwNH0.W_jcvK9xX9K66JGilWLNy5bW0FJiCrFBDaVCnnVhncI'

const FAILED = "That didn't send. Please check your connection and try again, or email founders@askpip.garden."

/** Calls a database function and returns its answer. Throws if it could not be reached or said no. */
async function call(name, args) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${name}`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_PUBLIC_KEY,
      Authorization: `Bearer ${SUPABASE_PUBLIC_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(args),
  })
  if (!response.ok) throw new Error(`call failed: ${response.status}`)
  const answer = await response.json()
  if (!answer || answer.ok !== true) throw new Error(`refused: ${answer && answer.reason}`)
  return answer
}

function show(element, message) {
  element.textContent = message
  element.hidden = false
}

function validEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

/* ---------- Request an invite ---------- */

const inviteForm = document.getElementById('invite-form')
const inviteError = document.getElementById('invite-error')
const inviteDone = document.getElementById('invite-done')
const inviteLater = document.getElementById('invite-later')
let laterEmail = ''

inviteForm?.addEventListener('submit', async (event) => {
  event.preventDefault()
  inviteError.hidden = true

  const data = new FormData(inviteForm)
  const name = String(data.get('name') ?? '').trim()
  const email = String(data.get('email') ?? '').trim().toLowerCase()
  const country = String(data.get('country') ?? '')
  const roses = data.getAll('roses').map(String)
  const phone = String(data.get('phone') ?? '')
  const note = String(data.get('note') ?? '').trim()

  if (!name) return show(inviteError, 'Please tell us your name.')
  if (!validEmail(email)) return show(inviteError, 'Please give an email address we can reply to.')
  if (!country) return show(inviteError, 'Please choose where you garden.')
  if (roses.length === 0) return show(inviteError, 'Please tick the roses you grow, or "I\'m not sure".')
  if (!phone) return show(inviteError, 'Please choose which phone you use.')
  if (!data.get('agree')) return show(inviteError, 'Please tick the box to say you understand this is a beta.')

  const button = inviteForm.querySelector('button[type="submit"]')
  button.disabled = true
  try {
    // The database decides whether the request is one the beta covers (the five countries
    // and the three rose types, with "I'm not sure" let through for the Founders to judge).
    const answer = await call('site_request_invite', {
      p_name: name,
      p_email: email,
      p_country: country,
      p_roses: roses,
      p_phone: phone,
      p_note: note || null,
      p_accepted: true,
      p_trap: String(data.get('website') ?? ''),
    })
    inviteForm.hidden = true
    const panel = answer.in_beta_scope ? inviteDone : inviteLater
    laterEmail = email
    panel.hidden = false
    panel.focus()
  } catch (error) {
    console.warn(error)
    show(inviteError, FAILED)
  } finally {
    button.disabled = false
  }
})

document.getElementById('invite-follow')?.addEventListener('click', async (event) => {
  const button = event.currentTarget
  button.disabled = true
  try {
    await call('site_follow', { p_email: laterEmail, p_source: 'invite-form' })
    button.hidden = true
    document.getElementById('invite-follow-done').hidden = false
  } catch {
    button.disabled = false
  }
})

/* ---------- Follow progress ---------- */

const followForm = document.getElementById('follow-form')
const followError = document.getElementById('follow-error')
const followDone = document.getElementById('follow-done')

followForm?.addEventListener('submit', async (event) => {
  event.preventDefault()
  followError.hidden = true
  const followData = new FormData(followForm)
  const email = String(followData.get('email') ?? '').trim().toLowerCase()
  if (!validEmail(email)) return show(followError, 'Please give an email address.')

  const button = followForm.querySelector('button')
  button.disabled = true
  try {
    await call('site_follow', { p_email: email, p_source: 'follow-progress', p_trap: String(followData.get('website') ?? '') })
    followForm.hidden = true
    followDone.hidden = false
    followDone.focus()
  } catch (error) {
    console.warn(error)
    show(followError, FAILED)
  } finally {
    button.disabled = false
  }
})

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AppHeader } from '@/components/AppHeader'
import { ChatBubble } from '@/components/ChatBubble'
import { ResponseBubble } from '@/components/ResponseBubble'
import { Button } from '@/components/Button'
import { cn } from '@/lib/utils'

// DRAFT CONCEPT COPY — not Founder-approved phrasing. See
// Working/AI Outputs/Ask_Pip_Bush_Rose_Guided_Journey_Flow_Proposal.md
// section 9.1, which this page builds: the five questions a gardener should
// be able to get answered at any time (what Pip helps with, why it works
// this way, how it works, what it won't do, what happens to what they
// share). Wording here is concept copy for Founder review, in Pip's voice
// per the Pip Character Profile (warm, curious, wise, honest, patient,
// hopeful) — swap freely before this is treated as final.
const STEPS: { heading: string; body: string }[] = [
  {
    heading: "What I'm here for",
    body: "Hello, I'm Pip. Think of me as the friend who's read every book on roses but still wants to see yours with their own eyes before saying anything useful. I'm here to get to know one rose — yours — really well: what it needs, what to leave well alone, and when it's time to reach for the secateurs.",
  },
  {
    heading: 'Why I work this way',
    body: "I could just hand you a list of instructions. I won't — a list forgets your rose the moment you close it. What I want instead is for you to end up trusting your own eye. So every answer I give comes with the reason behind it, and if the reason isn't solid yet, I'll say so rather than dress it up.",
  },
  {
    heading: 'How it actually works',
    body: "Here's the whole trick: I'll notice something in a photo and say so. You go and check it on the real rose, because a photo can be wrong and your rose can't. Then you decide — cut it, leave it, think about it later, or call in real help. Nothing gets cut until you've traced the stem yourself.",
  },
  {
    heading: "What I won't do",
    body: "I won't diagnose your rose from one photo and call it certain. I won't make a cut for you, and I won't pretend to know more than good research actually says. If I don't know something, I'll tell you plainly — \"not sure\" is a perfectly good answer, from either of us.",
  },
  {
    heading: 'What happens to what you share',
    body: "Every photo and note you give me becomes part of your rose's own story, kept for that rose and nothing else. It's how I get to know this particular plant, season after season — so that next time, when I say \"last time, you...\", I actually mean it.",
  },
]

/**
 * The "Tell me more" page reachable from Welcome's quiet second option (see
 * Welcome.tsx) — the opening-page explainer from the flow proposal, section
 * 9.1, scoped down to just this one entry point for now rather than the
 * full Learn area the proposal describes. One idea per screen, same as
 * everywhere else in the app (design principle 1), with a quick way out at
 * every step — nobody should feel stuck reading about the app when what
 * they wanted was to get to their rose.
 */
export function AboutPip() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const isLast = step === STEPS.length - 1
  const current = STEPS[step]

  function next() {
    if (isLast) {
      navigate('/welcome')
      return
    }
    setStep((s) => s + 1)
  }

  function back() {
    if (step === 0) {
      navigate('/welcome')
      return
    }
    setStep((s) => s - 1)
  }

  return (
    <div className="flex h-full flex-col">
      <AppHeader onBack={() => navigate('/welcome')} />

      <div className="flex-1 overflow-y-auto px-4 pb-6 pt-2">
        <div className="mb-4 flex items-center justify-center gap-1.5">
          {STEPS.map((_, i) => (
            <span
              key={i}
              className={cn(
                'h-1.5 rounded-full transition-all',
                i === step ? 'w-6 bg-pip-primary' : 'w-1.5 bg-pip-border',
              )}
            />
          ))}
        </div>

        <motion.div
          key={step}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <ChatBubble>
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-pip-primary">
              {current.heading}
            </span>
            {current.body}
          </ChatBubble>

          <ResponseBubble>
            <div className="flex flex-col gap-2.5">
              <Button onClick={next}>{isLast ? "Let's get started" : 'Go on'}</Button>
              <button
                onClick={back}
                className="text-center text-sm text-pip-text-soft underline"
              >
                {step === 0 ? 'Not now' : 'Back'}
              </button>
            </div>
          </ResponseBubble>
        </motion.div>
      </div>
    </div>
  )
}

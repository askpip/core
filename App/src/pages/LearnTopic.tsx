import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AppHeader } from '@/components/AppHeader'
import { ChatBubble } from '@/components/ChatBubble'
import { ResponseBubble } from '@/components/ResponseBubble'
import { Button } from '@/components/Button'
import { cn } from '@/lib/utils'
import { findTopic } from '@/data/learnTopics'

/**
 * One Learn topic, reached from the Learn hub (Learn.tsx). Two shapes:
 * a short stepped explainer in Pip's voice (same one-idea-per-screen
 * pattern as AboutPip.tsx — deliberately not shared as one component with
 * it, since AboutPip is already shipped and reviewed; this is a fresh,
 * parallel copy of the same pattern for the new topics), or a single-page
 * glossary list, which reads better scannable all at once than paged.
 */
export function LearnTopic() {
  const navigate = useNavigate()
  const { topicId } = useParams()
  const topic = findTopic(topicId)
  const [step, setStep] = useState(0)

  if (!topic) {
    // Shouldn't happen from normal navigation (every link comes from
    // Learn.tsx's own topic list) — but a stale/typed URL shouldn't crash
    // the page over a missing topic.
    return (
      <div className="flex h-full flex-col">
        <AppHeader onBack={() => navigate('/learn')} />
        <div className="px-4 pt-6">
          <ChatBubble>I don't have a page for that one. Let's go back to what I can explain.</ChatBubble>
          <ResponseBubble>
            <Button onClick={() => navigate('/learn')}>Back to Learn</Button>
          </ResponseBubble>
        </div>
      </div>
    )
  }

  if (topic.kind === 'list') {
    return (
      <div className="flex h-full flex-col">
        <AppHeader onBack={() => navigate('/learn')} />
        <div className="flex-1 overflow-y-auto px-4 pb-6 pt-6">
          <ChatBubble>{topic.intro}</ChatBubble>
          <ResponseBubble>
            <div className="flex flex-col gap-3.5">
              {topic.items.map((item) => (
                <div key={item.term}>
                  <p className="text-sm font-semibold text-pip-primary">{item.term}</p>
                  <p className="text-sm text-pip-text-soft">{item.meaning}</p>
                </div>
              ))}
            </div>
            <div className="pt-3">
              <Button variant="secondary" onClick={() => navigate('/learn')}>
                Back to Learn
              </Button>
            </div>
          </ResponseBubble>
        </div>
      </div>
    )
  }

  const isLast = step === topic.steps.length - 1
  const current = topic.steps[step]

  function next() {
    if (isLast) {
      navigate('/learn')
      return
    }
    setStep((s) => s + 1)
  }

  function back() {
    if (step === 0) {
      navigate('/learn')
      return
    }
    setStep((s) => s - 1)
  }

  return (
    <div className="flex h-full flex-col">
      <AppHeader onBack={() => navigate('/learn')} />

      <div className="flex-1 overflow-y-auto px-4 pb-6 pt-2">
        <div className="mb-4 flex items-center justify-center gap-1.5">
          {topic.steps.map((_, i) => (
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
              <Button onClick={next}>{isLast ? 'Back to Learn' : 'Go on'}</Button>
              <button onClick={back} className="text-center text-sm text-pip-text-soft underline">
                {step === 0 ? 'Back to Learn' : 'Back'}
              </button>
            </div>
          </ResponseBubble>
        </motion.div>
      </div>
    </div>
  )
}

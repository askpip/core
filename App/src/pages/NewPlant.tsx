import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AppHeader } from '@/components/AppHeader'
import { ChatBubble } from '@/components/ChatBubble'
import { ResponseBubble } from '@/components/ResponseBubble'
import { Button } from '@/components/Button'
import { useProjects } from '@/lib/store'
import type { PlantProject } from '@/lib/types'

interface Question {
  id: keyof Pick<PlantProject, 'name' | 'variety' | 'varietySource' | 'location' | 'personalMeaning'>
  pipAsks: string
  placeholder: string
  optional?: boolean
  multiline?: boolean
}

const QUESTIONS: Question[] = [
  { id: 'name', pipAsks: 'What would you like to call this rose?', placeholder: "Sarah's Rose" },
  {
    id: 'variety',
    pipAsks: 'What kind of rose is it, if you know?',
    placeholder: 'Iceberg',
    optional: true,
  },
  {
    id: 'varietySource',
    pipAsks: 'Where did you find that out?',
    placeholder: 'A nursery label',
    optional: true,
  },
  {
    id: 'location',
    pipAsks: "Where is your rose growing? This helps me understand your local season.",
    placeholder: 'Town or region',
  },
  {
    id: 'personalMeaning',
    pipAsks: 'Would you like to record why this rose is special to you?',
    placeholder: "My sister gave it to me...",
    optional: true,
    multiline: true,
  },
]

/** One conversational question at a time, matching Marie's Story chapter 1. */
export function NewPlant() {
  const navigate = useNavigate()
  const { addProject } = useProjects()

  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [draft, setDraft] = useState('')

  const question = QUESTIONS[step]
  const canAdvance = question.optional || draft.trim().length > 0

  function advance() {
    const next = { ...answers, [question.id]: draft.trim() }
    setAnswers(next)

    if (step + 1 < QUESTIONS.length) {
      setStep(step + 1)
      setDraft(next[QUESTIONS[step + 1].id] ?? '')
      return
    }

    const project: PlantProject = {
      id: crypto.randomUUID(),
      name: next.name || 'My Rose',
      variety: next.variety || 'Unknown variety',
      varietySource: next.varietySource || '',
      location: next.location || '',
      personalMeaning: next.personalMeaning || undefined,
      createdAt: new Date().toISOString(),
      observations: [],
      journeyComplete: false,
    }
    addProject(project)
    navigate(`/journey/${project.id}`)
  }

  return (
    <div className="flex h-full flex-col">
      <AppHeader />

      <div className="px-4 pt-6">
        <motion.div
          key={question.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <ChatBubble>{question.pipAsks}</ChatBubble>

          <ResponseBubble>
            {question.multiline ? (
              <textarea
                autoFocus
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder={question.placeholder}
                rows={3}
                className="input resize-none w-full"
              />
            ) : (
              <input
                autoFocus
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && canAdvance && advance()}
                placeholder={question.placeholder}
                className="input w-full"
              />
            )}

            <div className="mt-3 flex flex-col gap-2">
              <Button disabled={!canAdvance} onClick={advance}>
                {step + 1 < QUESTIONS.length ? 'Next' : "That's everything — begin"}
              </Button>
              {question.optional && (
                <button
                  onClick={() => {
                    setDraft('')
                    advance()
                  }}
                  className="text-sm text-pip-text-soft underline"
                >
                  Skip this one
                </button>
              )}
            </div>
          </ResponseBubble>
        </motion.div>
      </div>
    </div>
  )
}

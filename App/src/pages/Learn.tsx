import { useNavigate } from 'react-router-dom'
import { AppHeader } from '@/components/AppHeader'
import { ChatBubble } from '@/components/ChatBubble'
import { ResponseBubble } from '@/components/ResponseBubble'
import { LEARN_TOPICS } from '@/data/learnTopics'

/**
 * The Learn hub — reachable from the header's ⋯ menu (AppHeader.tsx) from
 * any screen, per the flow proposal section 9.2: a permanent place to ask
 * "what can Pip help me with?" that doesn't depend on being partway through
 * a journey. Lists every topic in @/data/learnTopics, plus the original
 * opening explainer (AboutPip.tsx / "Tell me more", reached from Welcome)
 * so it's findable from here too, not just the first-login screen.
 */
export function Learn() {
  const navigate = useNavigate()

  return (
    <div className="flex h-full flex-col">
      <AppHeader />

      <div className="flex-1 overflow-y-auto px-4 pb-6 pt-6">
        <ChatBubble>
          Anything you'd like explained? Pick a topic below — I'm always happy to talk about how I work.
        </ChatBubble>

        <ResponseBubble>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => navigate('/about-pip')}
              className="rounded-xl bg-pip-bg px-4 py-3 text-left text-sm text-pip-text hover:bg-pip-secondary"
            >
              What can Pip help me with?
            </button>
            {LEARN_TOPICS.map((topic) => (
              <button
                key={topic.id}
                onClick={() => navigate(`/learn/${topic.id}`)}
                className="rounded-xl bg-pip-bg px-4 py-3 text-left text-sm text-pip-text hover:bg-pip-secondary"
              >
                {topic.menuLabel}
              </button>
            ))}
          </div>
        </ResponseBubble>
      </div>
    </div>
  )
}

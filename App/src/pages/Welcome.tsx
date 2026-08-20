import { useNavigate } from 'react-router-dom'
import { AppHeader } from '@/components/AppHeader'
import { ChatBubble } from '@/components/ChatBubble'
import { ResponseBubble } from '@/components/ResponseBubble'
import { Button } from '@/components/Button'

// Placeholder until real auth is wired up — swap for the signed-in user's actual name.
const PLACEHOLDER_USERNAME = 'Gardener'

export function Welcome() {
  const navigate = useNavigate()

  return (
    <div className="flex h-full flex-col">
      <AppHeader />

      <div className="flex-1" />

      <div className="shrink-0 px-4 pb-6">
        <ChatBubble>
          Welcome, {PLACEHOLDER_USERNAME}! What would you like to look at today?
        </ChatBubble>
        <ResponseBubble showAskField>
          <div className="flex flex-col gap-2.5">
            <Button onClick={() => navigate('/new-plant')}>Add new rose</Button>
            <Button variant="secondary" onClick={() => navigate('/library')}>
              My Plant Journal
            </Button>
          </div>
        </ResponseBubble>
      </div>
    </div>
  )
}

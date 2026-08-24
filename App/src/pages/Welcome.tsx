import { useNavigate } from 'react-router-dom'
import { AppHeader } from '@/components/AppHeader'
import { ChatBubble } from '@/components/ChatBubble'
import { ResponseBubble } from '@/components/ResponseBubble'
import { Button } from '@/components/Button'
import { useAuth } from '@/lib/auth'

// Falls back to this if a gardener somehow lands here without a saved name
// (shouldn't happen in the normal flow — AuthGate routes anyone without one
// to /name first — but a stale session or direct link shouldn't crash the
// page over a missing string).
const FALLBACK_NAME = 'Gardener'

export function Welcome() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const displayName = user?.user_metadata?.displayName
  const name = typeof displayName === 'string' && displayName.trim() ? displayName.trim() : FALLBACK_NAME

  return (
    <div className="flex h-full flex-col">
      <AppHeader />

      <div className="px-4 pt-6">
        <ChatBubble>Welcome {name}! What would you like to do next?</ChatBubble>
        <ResponseBubble showAskField>
          <div className="flex flex-col gap-2.5">
            <Button onClick={() => navigate('/new-plant')}>Add a Plant</Button>
            <Button variant="secondary" onClick={() => navigate('/library')}>
              {name}'s Plants
            </Button>
          </div>
        </ResponseBubble>
      </div>
    </div>
  )
}

import { useNavigate, useParams } from 'react-router-dom'
import { useProjects } from '@/lib/store'
import { AppHeader } from '@/components/AppHeader'
import { PhotoCard } from '@/components/PhotoCard'
import { ChatBubble } from '@/components/ChatBubble'
import { Button } from '@/components/Button'

export function PlantProject() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getProject, loading } = useProjects()
  const project = id ? getProject(id) : undefined

  if (loading) {
    return <div className="p-6 text-sm text-pip-text-soft">Loading…</div>
  }

  if (!project) {
    return (
      <div className="p-6 text-sm text-pip-text-soft">
        Couldn't find that plant. <button className="underline" onClick={() => navigate('/library')}>Back to your plants</button>
      </div>
    )
  }

  const confirmedCount = project.observations.filter((o) => o.outcome !== 'unresolved').length
  const confidenceLabel =
    project.observations.length > 0
      ? `${Math.round((confirmedCount / project.observations.length) * 100)}%`
      : null

  return (
    <div className="flex h-full flex-col">
      <AppHeader />

      <div className="flex-1 overflow-y-auto px-4 pb-10 pt-2">
        <PhotoCard overlayName={project.name} className="w-full" />

        <div className="flex flex-col gap-4 pt-5">
        {confidenceLabel && (
          <p className="text-center text-xs text-pip-text-soft">
            Observation Confidence: {confidenceLabel}
          </p>
        )}

        {!project.journeyComplete ? (
          <>
            <ChatBubble>
              We haven't looked at {project.name} together yet. Ready to begin the guided
              pruning journey?
            </ChatBubble>
            <Button onClick={() => navigate(`/journey/${project.id}`)}>Begin journey</Button>
          </>
        ) : (
          <>
            <ChatBubble>
              Here's {project.name}'s journal — what we looked at, what you saw and what you
              decided.
            </ChatBubble>

            <div className="flex flex-col gap-2.5">
              {project.observations.map((o) => (
                <div key={o.id} className="rounded-xl bg-pip-card p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{o.feature}</p>
                    <span className="rounded-full bg-pip-secondary px-2.5 py-0.5 text-[11px] font-medium capitalize text-pip-text">
                      {o.outcome}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-pip-text-soft">{o.correction}</p>
                  {o.choice && (
                    <p className="mt-2 text-xs font-medium capitalize text-pip-primary">
                      Decision: {o.choice.replace('-', ' ')}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        <div className="mt-4 rounded-xl bg-pip-card p-4 text-xs text-pip-text-soft shadow-sm">
          <p>
            <span className="font-medium text-pip-text">Variety:</span> {project.variety}
            {project.varietySource && ` (${project.varietySource})`}
          </p>
          {project.location && (
            <p className="mt-1">
              <span className="font-medium text-pip-text">Location:</span> {project.location}
            </p>
          )}
          {project.personalMeaning && (
            <p className="mt-1 italic">"{project.personalMeaning}"</p>
          )}
        </div>
        </div>
      </div>
    </div>
  )
}

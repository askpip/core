import { useNavigate, useParams } from 'react-router-dom'
import { useProjects } from '@/lib/store'
import { seasonForHemisphere } from '@/lib/location'
import { usePlantPhotoUrl } from '@/lib/photos'
import { AppHeader } from '@/components/AppHeader'
import { PhotoCard } from '@/components/PhotoCard'
import { ProgressPhotos } from '@/components/ProgressPhotos'
import { PlantNotes } from '@/components/PlantNotes'
import { ChatBubble } from '@/components/ChatBubble'
import { Button } from '@/components/Button'

const SEASON_LABEL: Record<ReturnType<typeof seasonForHemisphere>, string> = {
  winter: 'Winter',
  spring: 'Spring',
  summer: 'Summer',
  autumn: 'Autumn',
}

export function PlantProject() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getProject, loading, updateProject, addProgressPhoto, deleteProgressPhoto, addNote, deleteNote } =
    useProjects()
  const project = id ? getProject(id) : undefined
  // Called unconditionally (before the early returns below) per the rules of
  // hooks — usePlantPhotoUrl already treats an undefined path as "no photo."
  const labelPhotoUrl = usePlantPhotoUrl(project?.varietyLabelPhotoPath)

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
        <PhotoCard
          overlayName={project.name}
          photoPath={project.overviewPhotoPath}
          className="w-full"
          profileId={project.id}
          slot="overview"
          onPhotoChange={(path) => updateProject(project.id, { overviewPhotoPath: path })}
        />

        <div className="flex flex-col gap-4 pt-5">
        {confidenceLabel && (
          <p className="text-center text-xs text-pip-text-soft">
            Observation Confidence: {confidenceLabel}
          </p>
        )}

        <div>
          <h2 className="mb-1 text-sm font-medium">Progress photos</h2>
          <p className="mb-2 text-xs text-pip-text-soft">
            Add a photo any time — no need to wait for a pruning journey — to see how{' '}
            {project.name} changes over the seasons.
          </p>
          <ProgressPhotos
            photos={project.progressPhotos}
            onAdd={(file) => addProgressPhoto(project.id, file)}
            onRemove={(photo) => deleteProgressPhoto(project.id, photo.id, photo.path)}
          />
        </div>

        <div>
          <h2 className="mb-1 text-sm font-medium">Notes</h2>
          <p className="mb-2 text-xs text-pip-text-soft">
            Jot down anything about {project.name}, any time. Any detail could help in caring
            for and understanding {project.name} better.
          </p>
          <PlantNotes
            notes={project.notes}
            onAdd={(text) => addNote(project.id, text)}
            onRemove={(note) => deleteNote(project.id, note.id)}
          />
        </div>

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
          {project.hemisphere && (
            <p className="mt-1">
              <span className="font-medium text-pip-text">Season there right now:</span>{' '}
              {SEASON_LABEL[seasonForHemisphere(project.hemisphere, new Date())]}
            </p>
          )}
          {project.personalMeaning && (
            <p className="mt-1 italic">"{project.personalMeaning}"</p>
          )}
        </div>

        {/*
          Its own card, not squeezed next to "Variety:" above — a nursery
          label usually carries more than the variety name (a plant code,
          breeder, care notes), so it gets room for the full note text and a
          larger, uncropped photo rather than a small thumbnail.
        */}
        {(project.varietyLabelNote || labelPhotoUrl) && (
          <div className="rounded-xl bg-pip-card p-4 text-xs text-pip-text-soft shadow-sm">
            <h2 className="mb-2 text-sm font-medium text-pip-text">Nursery label</h2>
            {project.varietyLabelNote && (
              <p className="mb-3 whitespace-pre-wrap">{project.varietyLabelNote}</p>
            )}
            {labelPhotoUrl && (
              <img
                src={labelPhotoUrl}
                alt="Nursery label"
                className="w-1/2 rounded-lg object-contain"
              />
            )}
          </div>
        )}
        </div>
      </div>
    </div>
  )
}

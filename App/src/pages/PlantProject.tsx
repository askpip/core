import { useState } from 'react'
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
import { CareBlock } from '@/components/PkrStatements'
import { SeasonCard } from '@/components/SeasonCard'
import { CommonQuestions } from '@/components/CommonQuestions'
import { HOME_QUESTIONS } from '@/data/commonQuestions'
import { CARE_DISCLOSURE, SAVED_ROSE_TYPE_LABELS, growingSeasonObservation, publishedCare, roseTypeName, roseTypePasses } from '@/data/pkr'
import type { CareGuidance } from '@/data/pkr'
import type { SavedRoseType } from '@/lib/types'

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
  const [showCare, setShowCare] = useState(false)

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

  // 'none-remaining' rows are Journey.tsx's per-observation "no more" markers
  // (resume bookkeeping), not observations the gardener made, so they're left
  // out of the journal list.
  const shownObservations = project.observations.filter((o) => o.outcome !== 'none-remaining')

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
        {/* Pip's own bubble (plus the journey button, or the journal once
            complete) sits right under the photo now — the most immediate,
            conversational thing on the page — with Notes, Progress photos,
            and the plant's original onboarding info following below it. */}
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
            <ChatBubble pose="gesturing">
              Here's {project.name}'s journal — what we looked at, what you saw and what you
              decided.
            </ChatBubble>

            {shownObservations.length > 0 && (
              <p className="rounded-xl border border-pip-border bg-pip-card px-4 py-3 text-sm">
                <span className="font-bold">So far: </span>
                {shownObservations.length} {shownObservations.length === 1 ? 'thing' : 'things'} looked at
                {(['cut', 'leave', 'decide-later'] as const).map((c) => {
                  const n = shownObservations.filter((o) => o.choice === c).length
                  if (!n) return null
                  const label = c === 'cut' ? (n === 1 ? 'cut' : 'cuts') : c === 'leave' ? 'left as it is' : 'to decide later'
                  return <span key={c}> · {n} {label}</span>
                })}
              </p>
            )}

            <div className="flex flex-col gap-2.5">
              {shownObservations.map((o) => (
                <div key={o.id} className="rounded-xl bg-pip-card p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{o.feature}</p>
                    <span className="rounded-full bg-pip-secondary px-2.5 py-0.5 text-xs font-medium capitalize text-pip-text">
                      {o.outcome === 'corrected' ? "doesn't match" : o.outcome === 'unresolved' ? 'not sure' : o.outcome}
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

        {/* Basic care as a journal reference: PKR-CGD-000004 and 000006 list
            "in the plant journal of a rose that passed PKR-SGT-000003" as a
            presentation point. Not shown for journal-only roses (BASICCARE D3). */}
        {roseTypePasses(project.roseType) && (
          <SeasonCard hemisphere={project.hemisphere} place={project.locationCity || undefined} />
        )}

        {roseTypePasses(project.roseType) && (
          <div>
            <h2 className="mb-1 text-sm font-medium">Caring for your {roseTypeName(project.roseType)}</h2>
            <p className="mb-2 text-xs text-pip-text-soft">Watering, mulch, feeding, deadheading and getting ready for winter.</p>
            {showCare ? (
              <div className="rounded-xl bg-pip-card p-4 shadow-sm">
                {[publishedCare('PKR-CGD-000004'), publishedCare('PKR-CGD-000006')]
                  .filter((c): c is CareGuidance => Boolean(c))
                  .map((c) => (
                    <CareBlock key={c.pkr.id} care={c} />
                  ))}
                <p className="text-xs italic text-pip-text-soft">{CARE_DISCLOSURE}</p>
                <button onClick={() => setShowCare(false)} className="mt-2 text-xs text-pip-text-soft underline">
                  Hide care tips
                </button>
              </div>
            ) : (
              <Button variant="secondary" onClick={() => setShowCare(true)}>
                All care tips
              </Button>
            )}
          </div>
        )}

        {roseTypePasses(project.roseType) && growingSeasonObservation('blind-shoot') && (
          <div>
            <h2 className="mb-1 text-sm font-medium">Growing-season check</h2>
            <p className="mb-2 text-xs text-pip-text-soft">Shoots with leaves but no flower bud at the tip, once other shoots are in bud.</p>
            <Button variant="secondary" onClick={() => navigate(`/plant/${project.id}/blind-shoots`)}>
              Check for blind shoots
            </Button>
          </div>
        )}

        <CommonQuestions keys={HOME_QUESTIONS} initialVisible={6} plantId={project.id} />

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

        <div>
          <h2 className="mb-1 text-sm font-medium">Progress photos</h2>
          <p className="mb-2 text-xs text-pip-text-soft">
            Add a photo at any time so we can watch and learn how {project.name} grows and
            changes over the seasons.
          </p>
          <ProgressPhotos
            photos={project.progressPhotos}
            onAdd={(file) => addProgressPhoto(project.id, file)}
            onRemove={(photo) => deleteProgressPhoto(project.id, photo.id, photo.path)}
          />
        </div>

        <div className="mt-4 rounded-xl bg-pip-card p-4 text-xs text-pip-text-soft shadow-sm">
          <p>
            <span className="font-medium text-pip-text">Variety:</span> {project.variety}
            {project.varietySource && ` (${project.varietySource})`}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-1.5">
            <span className="font-medium text-pip-text">Rose type:</span>
            {/* PKR-SGT-000003's saved answer. Changing it here is how a gardener
                updates it after finding out the type; the journey reads it. */}
            <select
              aria-label="Rose type"
              value={project.roseType ?? ''}
              onChange={(e) =>
                updateProject(project.id, { roseType: (e.target.value || undefined) as SavedRoseType | undefined })
              }
              className="rounded-md border border-pip-border bg-pip-bg px-1.5 py-0.5 text-xs text-pip-text"
            >
              <option value="">Not set yet</option>
              {(Object.keys(SAVED_ROSE_TYPE_LABELS) as SavedRoseType[]).map((t) => (
                <option key={t} value={t}>
                  {SAVED_ROSE_TYPE_LABELS[t]}
                </option>
              ))}
            </select>
          </div>
          {project.roseType && !roseTypePasses(project.roseType) && (
            <p className="mt-1">I can't yet help prune this rose; it's kept as a journal.</p>
          )}
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

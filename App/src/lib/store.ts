import { useEffect, useState } from 'react'
import type { PlantProject } from './types'

const STORAGE_KEY = 'askpip.projects.v1'

function loadProjects(): PlantProject[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as PlantProject[]) : []
  } catch {
    return []
  }
}

function saveProjects(projects: PlantProject[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects))
}

/**
 * Local-only project store for the prototype shell. Not wired to Supabase yet —
 * swap this hook's internals for Supabase queries once real persistence and
 * auth are needed; the page components only depend on this hook's return shape.
 */
export function useProjects() {
  const [projects, setProjects] = useState<PlantProject[]>(() => loadProjects())

  useEffect(() => {
    saveProjects(projects)
  }, [projects])

  function addProject(project: PlantProject) {
    setProjects((prev) => [...prev, project])
  }

  function updateProject(id: string, patch: Partial<PlantProject>) {
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)))
  }

  function getProject(id: string) {
    return projects.find((p) => p.id === id)
  }

  function deleteProject(id: string) {
    setProjects((prev) => prev.filter((p) => p.id !== id))
  }

  return { projects, addProject, updateProject, getProject, deleteProject }
}

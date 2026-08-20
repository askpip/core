import { HashRouter, Routes, Route } from 'react-router-dom'
import { AuthGate } from '@/pages/AuthGate'
import { Welcome } from '@/pages/Welcome'
import { Library } from '@/pages/Library'
import { NewPlant } from '@/pages/NewPlant'
import { Journey } from '@/pages/Journey'
import { PlantProject } from '@/pages/PlantProject'

function App() {
  return (
    <HashRouter>
      <div className="flex min-h-screen items-center justify-center bg-pip-bg-deep p-4">
        <div className="relative h-[812px] max-h-[92vh] w-[375px] max-w-full overflow-hidden rounded-[2.5rem] bg-pip-bg shadow-2xl ring-8 ring-black/80">
          <Routes>
            <Route path="/" element={<AuthGate />} />
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/library" element={<Library />} />
            <Route path="/new-plant" element={<NewPlant />} />
            <Route path="/journey/:id" element={<Journey />} />
            <Route path="/plant/:id" element={<PlantProject />} />
          </Routes>
        </div>
      </div>
    </HashRouter>
  )
}

export default App

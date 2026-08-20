import { HashRouter, Routes, Route } from 'react-router-dom'
import { AuthGate } from '@/pages/AuthGate'
import { Welcome } from '@/pages/Welcome'
import { Library } from '@/pages/Library'
import { NewPlant } from '@/pages/NewPlant'
import { Journey } from '@/pages/Journey'
import { PlantProject } from '@/pages/PlantProject'
import roseBackground from '@/assets/pip/rose-background.jpg'

function App() {
  return (
    <HashRouter>
      {/* Full-bleed on an actual phone — the rounded, bordered "phone mockup" is a desktop-only
          preview convenience and would just waste real screen space on a real device. The rose
          backdrop only ever shows in that desktop margin, so it's invisible on mobile by construction. */}
      <div
        className="min-h-dvh bg-pip-bg-deep sm:flex sm:min-h-screen sm:items-center sm:justify-center sm:bg-cover sm:bg-center sm:p-4"
        style={{
          backgroundImage: `linear-gradient(rgba(20, 30, 15, 0.4), rgba(20, 30, 15, 0.4)), url(${roseBackground})`,
        }}
      >
        <div className="relative h-dvh w-full overflow-hidden bg-pip-bg sm:h-[812px] sm:max-h-[92vh] sm:w-[375px] sm:max-w-full sm:rounded-[2.5rem] sm:shadow-2xl sm:ring-8 sm:ring-black/80">
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

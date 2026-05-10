import ParticlesBackground from "./components/ParticleBG"
import AhpDashboard from "./AhpDashboard";

export default function App() {
  return (
     <div className="relative min-h-screen w-full">
      <ParticlesBackground />
      <div className="relative z-10 py-10">
        <AhpDashboard />
      </div>
    </div>
  )
}

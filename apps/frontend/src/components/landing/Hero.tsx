import React from 'react'
import { InteractiveGrid } from "@/components/InteractiveGrid";

const Hero = () => {
  return (
    <section className="relative min-h-svh w-full flex items-center justify-center text-center overflow-hidden">

      {/* Background ONLY for Hero */}
      <div className="absolute inset-0 -z-10">
        <InteractiveGrid />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(76,29,149,0.1),transparent_70%)]" />
      </div>

      {/* Hero Content */}
      <div className="bg-red-500 h-30 w-30 flex items-center justify-center">
        Hero
      </div>

    </section>
  )
}

export default Hero
import { Navbar } from "@/components/Navbar";
import { VideoBackground } from "@/components/VideoBackground";
import { FrostCard } from "@/components/FrostCard";
import heroEmblem from "@/assets/hero-emblem.png";
import iceCrystals from "@/assets/ice-crystals.png";
import temperatureGauge from "@/assets/temperature-gauge.png";
import iceCubes from "@/assets/ice-cubes.png";
// Tuodaan oikeat kuvatiedostot nappeja varten
import btnBg from "@/assets/DOWNLOAD APP.jpg";
import navBg from "@/assets/HERO BANNER ICE 2.jpg";
import { motion } from "framer-motion";

const Index = () => {
  return (
    <div className="relative min-h-screen overflow-x-hidden font-sans text-foreground selection:bg-cyan-500/30">
      <VideoBackground />
      <Navbar />

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen pt-32 pb-20 px-4">

        {/* Hero Emblem (The Brain Cube) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-8 relative"
        >
          <img
            src={heroEmblem}
            alt="BrainFreeze Emblem"
            className="w-64 h-64 md:w-80 md:h-80 object-contain animate-float drop-shadow-[0_0_50px_rgba(6,182,212,0.4)]"
          />
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-center mb-6"
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-none uppercase">
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-100 to-cyan-400 drop-shadow-[0_0_25px_rgba(34,211,238,0.6)]">
              Freeze Your Brain,
            </span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-cyan-50 via-white to-cyan-200 drop-shadow-[0_0_25px_rgba(34,211,238,0.6)]">
              Not Your Flow.
            </span>
          </h1>
        </motion.div>

        {/* Sub-headline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mb-16 text-center text-lg md:text-2xl text-cyan-50/90 max-w-2xl font-light tracking-wide drop-shadow-md"
        >
          BrainFreeze is a mental cold shock.
          <br />
          Freeze the chaos. Build the clarity.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mb-32 flex flex-col md:flex-row items-center justify-center gap-8"
        >
          {/* Button 1: Download Now */}
          <button
            className="relative group w-[260px] h-[90px] flex items-center justify-center bg-center bg-no-repeat bg-contain transition-transform hover:scale-105 active:scale-95"
            style={{ backgroundImage: `url("${btnBg}")` }}
          >
            <span className="relative z-10 text-lg font-black text-white tracking-widest uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)] pb-5 pr-2">
              Download Now
            </span>
          </button>

          {/* Button 2: Explore Routines (Käytetään nav-palkkia taustana, koska se sopii tyyliin) */}
          <button
            className="relative group w-[260px] h-[80px] flex items-center justify-center bg-center bg-no-repeat bg-contain transition-transform hover:scale-105 active:scale-95 opacity-90 hover:opacity-100"
            style={{ backgroundImage: `url("${navBg}")` }}
          >
            <span className="relative z-10 text-lg font-black text-white tracking-widest uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)] pb-4">
              Explore Routines
            </span>
          </button>
        </motion.div>

        {/* Feature Cards Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="grid w-full max-w-7xl grid-cols-1 md:grid-cols-3 gap-8 px-4"
        >
          <FrostCard
            title="BrainFreeze Routines™"
            image={iceCrystals}
            imageAlt="Ice Crystal Formation"
          />
          <FrostCard
            title="Mental Temperature™"
            image={temperatureGauge}
            imageAlt="Temperature Gauge"
          />
          <FrostCard
            title="Freeze Streaks™"
            image={iceCubes}
            imageAlt="Stacked Ice Cubes"
          />
        </motion.div>
      </main>

      {/* Simple Footer */}
      <footer className="relative z-10 py-8 text-center border-t border-white/10 bg-black/20 backdrop-blur-sm mt-20">
        <p className="text-xs text-cyan-200/50 uppercase tracking-widest">
          © 2024 BrainFreeze. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Index;

import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { VideoBackground } from "@/components/VideoBackground";
import { FrostCard } from "@/components/FrostCard";
import heroEmblem from "@/assets/hero-emblem.png";
import iceCrystals from "@/assets/ice-crystals.png";
import temperatureGauge from "@/assets/temperature-gauge.png";
import iceCubes from "@/assets/ice-cubes.png";
import { motion } from "framer-motion";

const Index = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <VideoBackground />
      <Navbar />
      
      {/* Hero Section */}
      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 pt-32">
        {/* Hero Emblem */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-12 animate-float"
        >
          <img
            src={heroEmblem}
            alt="BrainFreeze Hexagonal Ice Emblem"
            className="h-64 w-64 drop-shadow-[0_0_50px_hsl(190_100%_50%_/_0.6)] md:h-80 md:w-80"
          />
        </motion.div>

        {/* Main Headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-8 text-center"
        >
          <h1 className="mb-4 text-5xl font-black leading-tight md:text-7xl lg:text-8xl">
            <span className="text-ice-glow">FREEZE YOUR BRAIN,</span>
            <br />
            <span className="text-foreground">NOT YOUR FLOW.</span>
          </h1>
        </motion.div>

        {/* Sub-headline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mb-12 max-w-2xl text-center text-xl text-foreground md:text-2xl"
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
          className="mb-24 flex flex-wrap items-center justify-center gap-6"
        >
          <Button variant="hero" size="xl" className="icicle-bottom">
            DOWNLOAD NOW
          </Button>
          <Button variant="frozen" size="xl" className="icicle-bottom">
            EXPLORE ROUTINES
          </Button>
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="grid w-full max-w-7xl grid-cols-1 gap-8 px-4 pb-20 md:grid-cols-3"
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

      {/* Footer with Ice Layer */}
      <footer className="relative z-10 border-t border-primary/30 bg-gradient-to-b from-transparent to-background/50 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 BrainFreeze. All rights reserved. Freeze the chaos. Build the clarity.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;

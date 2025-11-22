import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png"; // Varmista että polku on oikein

export const Navbar = () => {
  return (
    <nav className="fixed left-1/2 top-8 z-50 -translate-x-1/2 transform">
      {/* Jäinen Container */}
      <div
        className="
        flex items-center gap-8 rounded-full px-8 py-4
        bg-gradient-to-b from-white/10 to-white/5 
        backdrop-blur-xl border border-white/20
        shadow-[0_0_25px_rgba(8,145,178,0.4)]
        transition-all hover:shadow-[0_0_35px_rgba(8,145,178,0.6)]
      "
      >
        {/* LOGO & TEKSTI */}
        <div className="flex items-center gap-3">
          <img src={logo} alt="BrainFreeze Logo" className="h-12 w-12 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
          <span
            className="
            text-2xl font-bold tracking-wide
            bg-gradient-to-b from-white via-cyan-100 to-cyan-400
            bg-clip-text text-transparent
            drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]
          "
          >
            BrainFreeze
          </span>
        </div>

        {/* LINKIT */}
        <div className="hidden md:flex items-center gap-8">
          {["Home", "About", "Services", "Contact"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="
                text-sm font-semibold text-cyan-50/80 uppercase tracking-wider
                transition-all duration-300
                hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]
              "
            >
              {item}
            </a>
          ))}
        </div>

        {/* JÄINEN BUTTON */}
        <Button
          className="
            relative overflow-hidden rounded-full px-6 py-5 font-bold text-white
            bg-gradient-to-b from-cyan-500/20 to-blue-600/20
            border border-cyan-300/50
            shadow-[0_0_15px_rgba(6,182,212,0.3)]
            hover:bg-cyan-500/30 hover:border-cyan-200
            hover:shadow-[0_0_25px_rgba(34,211,238,0.6)]
            transition-all duration-300
          "
        >
          <span className="relative z-10 drop-shadow-md">DOWNLOAD NOW</span>
          {/* Kiiltoefekti napin sisällä */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-50" />
        </Button>
      </div>
    </nav>
  );
};

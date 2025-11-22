import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

export const Navbar = () => {
  return (
    <nav className="fixed left-1/2 top-6 z-50 -translate-x-1/2 w-[95%] max-w-6xl">
      {/* Bannerin tausta ja reunat */}
      <div
        className="
        relative flex items-center justify-between 
        rounded-full px-8 py-4
        bg-white/5 backdrop-blur-xl 
        border border-white/10
        shadow-[0_0_30px_rgba(8,145,178,0.3)]
      "
      >
        {/* 1. VASEN PUOLI: LOGO JA OTSIKKO */}
        <div className="flex items-center gap-3 shrink-0">
          <img src={logo} alt="BrainFreeze Logo" className="h-10 w-10 drop-shadow-[0_0_10px_rgba(34,211,238,0.6)]" />
          <span
            className="
            text-2xl font-bold tracking-wide
            bg-gradient-to-b from-white via-cyan-200 to-cyan-500
            bg-clip-text text-transparent
            drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]
          "
          >
            BrainFreeze
          </span>
        </div>

        {/* 2. KESKIKOHTA: LINKIT */}
        {/* hidden md:flex piilottaa mobiilissa, näkyy isommilla ruuduilla */}
        <div className="hidden md:flex items-center gap-8 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          {["HOME", "ABOUT", "SERVICES", "CONTACT"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="
                text-sm font-bold text-cyan-100/70 uppercase tracking-wider
                transition-all duration-300
                hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]
              "
            >
              {item}
            </a>
          ))}
        </div>

        {/* 3. OIKEA PUOLI: ACTION NAPPI */}
        <div className="shrink-0">
          <Button
            className="
              rounded-full px-6 py-5 font-bold text-white text-sm
              bg-cyan-500
              border border-cyan-300/50
              shadow-[0_0_20px_rgba(6,182,212,0.4)]
              hover:bg-cyan-400 hover:scale-105
              transition-all duration-300
            "
          >
            DOWNLOAD NOW
          </Button>
        </div>
      </div>
    </nav>
  );
};

import logo from "@/assets/logo.png";
import navBg from "@/assets/HERO BANNER ICE 2.jpg";
import btnBg from "@/assets/DOWNLOAD APP.jpg";

export const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 w-full pt-6 px-4 md:px-12 bg-background/30 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto flex items-center justify-between relative">
        
        {/* 1. VASEN: LOGO */}
        <div className="flex items-center gap-3 shrink-0 z-50">
          <img 
            src={logo} 
            alt="BrainFreeze Logo" 
            className="h-12 w-12 md:h-16 md:w-16 object-contain drop-shadow-[0_0_15px_rgba(34,211,238,0.6)]" 
          />
          <div className="hidden md:block text-2xl font-bold tracking-wide leading-tight">
            <span className="text-white">Brain</span>
            <span className="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]">Freeze</span>
          </div>
        </div>

        {/* 2. KESKI: NAVIGAATIO (Jäätanko) */}
        {/* Absolute center positioning */}
        <div className="absolute left-1/2 transform -translate-x-1/2 top-4 hidden md:block z-40">
          <div 
            className="flex items-center justify-center bg-center bg-no-repeat"
            style={{ 
              backgroundImage: `url("${navBg}")`,
              backgroundSize: '100% 100%', // Venytetään kuva täyttämään div
              width: '550px', 
              height: '60px' 
            }}
          >
            {/* Linkit: Lisätty pt-1 hienosäätöön */}
            <div className="flex items-center gap-10 pt-1">
              {["Home", "About", "Shop", "Contact"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="
                    text-xs font-bold text-white uppercase tracking-widest
                    transition-all duration-300 
                    hover:text-cyan-200 hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]
                    drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]
                  "
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* 3. OIKEA: BUTTON (DOWNLOAD APP) */}
        <div className="shrink-0 z-50">
          <button
            className="relative group flex items-center justify-center bg-center bg-no-repeat transition-transform hover:scale-105 active:scale-95"
            style={{ 
              backgroundImage: `url("${btnBg}")`,
              backgroundSize: 'contain',
              width: '200px',
              height: '70px'
            }}
          >
            {/* Tekstiä nostettu (pb-2) jotta se ei osu jääpuikkoihin */}
            <span className="relative z-10 text-xs font-black text-white tracking-widest uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] pb-2">
              Download Now
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
};

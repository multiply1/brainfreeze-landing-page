import logo from "@/assets/logo.png";
// Huomaa tarkat tiedostonimet välilyönteineen
import navBg from "@/assets/HERO BANNER ICE 2.png";
import btnBg from "@/assets/DOWNLOAD APP.png";

export const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 w-full pt-6 px-4 md:px-12">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* 1. VASEN: LOGO */}
        <div className="flex items-center gap-3">
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

        {/* 2. KESKI: NAVIGAATIO (Jäätanko-tausta) */}
        <div 
          className="absolute left-1/2 top-6 -translate-x-1/2 hidden md:flex items-center justify-center px-12 h-[65px] bg-center bg-no-repeat bg-contain"
          style={{ backgroundImage: `url("${navBg}")`, width: '500px' }}
        >
          {/* Linkit nostettu hieman ylös (pb-2) jotta ne osuvat jään keskelle */}
          <div className="flex items-center gap-10 pb-3">
            {["Home", "About", "Services", "Contact"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="
                  text-sm font-bold text-cyan-50 uppercase tracking-widest
                  transition-all duration-300 
                  hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,1)]
                  shadow-black drop-shadow-sm
                "
              >
                {item}
              </a>
            ))}
          </div>
        </div>

        {/* 3. OIKEA: BUTTON (Jäinen nappi) */}
        <button
          className="relative group w-[200px] h-[70px] flex items-center justify-center bg-center bg-no-repeat bg-contain transition-transform hover:scale-105 active:scale-95"
          style={{ backgroundImage: `url("${btnBg}")` }}
        >
          {/* Tekstiä nostettu hieman (pb-3) jotta se osuu napin keskelle */}
          <span className="relative z-10 text-sm font-black text-white tracking-widest uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] pb-4 pr-2">
            Download Now
          </span>
        </button>
      </div>
    </nav>
  );
};

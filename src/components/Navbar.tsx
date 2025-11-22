// Varmista, että importtaat PNG:n, ET svg:tä!
import logo from "@/assets/logo.png";
import iceButtonBg from "@/assets/download-button-ice.png"; // Oletetaan että nimi on tämä

export const Navbar = () => {
  return (
    <nav className="fixed left-1/2 top-6 z-50 -translate-x-1/2 w-[95%] max-w-6xl">
      {/* Bannerin tausta ja reunat */}
      <div
        className="
        relative flex items-center justify-between 
        rounded-full px-8 py-3
        bg-[#0f172a]/40 backdrop-blur-md 
        border border-white/10
        shadow-[0_0_30px_rgba(8,145,178,0.2)]
      "
      >
        {/* 1. VASEN PUOLI: LOGO JA OTSIKKO */}
        <div className="flex items-center gap-3 shrink-0">
          <img src={logo} alt="BrainFreeze Logo" className="h-12 w-12 object-contain" />
          <div className="text-xl font-bold tracking-wide flex flex-col leading-none">
            <span className="text-white drop-shadow-sm">Brain</span>
            <span className="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]">Freeze</span>
          </div>
        </div>

        {/* 2. KESKIKOHTA: LINKIT */}
        <div className="hidden md:flex items-center gap-8">
          {["HOME", "ABOUT", "SERVICES", "CONTACT"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="
                text-xs font-bold text-cyan-100/70 uppercase tracking-widest
                transition-all duration-300
                hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]
              "
            >
              {item}
            </a>
          ))}
        </div>

        {/* 3. OIKEA PUOLI: ACTION NAPPI (KORJATTU) */}
        <div className="shrink-0 relative">
          <button
            type="button"
            className="
              relative group flex items-center justify-center
              w-[180px] h-[70px] 
              bg-contain bg-center bg-no-repeat
              transition-transform active:scale-95
            "
            // Asetetaan taustakuva inline-tyylinä, jotta se varmasti toimii
            style={{ backgroundImage: `url(${iceButtonBg})` }}
            aria-label="Download now"
          >
            {/* Teksti asetellaan jään sisään. pb-5 nostaa tekstiä ylös jääpuikoista */}
            <span
              className="
              text-white font-black text-sm tracking-wider 
              drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]
              pb-5 
            "
            >
              DOWNLOAD NOW
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
};

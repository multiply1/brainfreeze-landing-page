import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react"; // Lisätään mobiili-ikoni varmuuden vuoksi
import logo from "@/assets/brain-ice-logo.png"; // Varmista polku

export const Navbar = () => {
  return (
    <div className="fixed top-0 left-0 w-full z-50 flex justify-center pt-6">
      <style>{`
        /* TÄMÄ TEKEE JÄÄSTÄ PAKSUA JA LASIMAISTA */
        .ice-container {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-top: 1px solid rgba(255, 255, 255, 0.4);
          border-left: 1px solid rgba(255, 255, 255, 0.2);
          border-right: 1px solid rgba(255, 255, 255, 0.2);
          border-bottom: 2px solid rgba(0, 240, 255, 0.3);
          box-shadow: 
            0 4px 30px rgba(0, 0, 0, 0.1),
            inset 0 0 20px rgba(165, 243, 252, 0.15),
            0 0 15px rgba(0, 240, 255, 0.2);
        }

        /* OMITUINEN, EPÄTASAINEN REUNA (EI SIKSARIKKA) */
        .ice-drips {
          position: absolute;
          bottom: -18px;
          left: 0;
          width: 100%;
          height: 25px;
          background: linear-gradient(to bottom, rgba(255,255,255,0.1), transparent);
          mask-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 1200 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0v15.2c18.8 6.2 29.6-5.8 49.2 0 25.6 7.6 36.1 24.8 68.2 12.4 17.4-6.7 26.9-17.2 42.4-12.4 31.8 9.8 44.9 23.2 78.8 11.2 20.1-7.1 28.5-19.2 46.8-13.6 29.5 9 41.6 24.1 72.8 13.6 21.2-7.1 30.9-18.3 50.4-11.2 25.5 9.3 37.6 23.8 66.8 11.2 18.3-7.9 29.5-19.9 47.2-12.4 28.3 12 40.1 26.4 70.8 14.8 19.3-7.3 27.6-17.2 44.8-12.4 26.1 7.3 36.8 22.5 64.4 11.2 16.3-6.7 25.2-16.5 40.4-12.4 27.6 7.5 37.6 22.7 67.2 11.2 19.3-7.5 28.1-18.3 46.4-12.4 29.2 9.4 40.1 23.4 72 11.2 18.1-6.9 27.8-17.2 43.2-12.4 24.9 7.7 36.1 23.2 66.4 12.4 20.3-7.3 29.2-18.3 48-12.4 19.5 6.1 32.4 16.7 53.6 12.4V0H0z' fill='%23000'/%3E%3C/svg%3E");
          mask-size: cover;
          -webkit-mask-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 1200 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0v15.2c18.8 6.2 29.6-5.8 49.2 0 25.6 7.6 36.1 24.8 68.2 12.4 17.4-6.7 26.9-17.2 42.4-12.4 31.8 9.8 44.9 23.2 78.8 11.2 20.1-7.1 28.5-19.2 46.8-13.6 29.5 9 41.6 24.1 72.8 13.6 21.2-7.1 30.9-18.3 50.4-11.2 25.5 9.3 37.6 23.8 66.8 11.2 18.3-7.9 29.5-19.9 47.2-12.4 28.3 12 40.1 26.4 70.8 14.8 19.3-7.3 27.6-17.2 44.8-12.4 26.1 7.3 36.8 22.5 64.4 11.2 16.3-6.7 25.2-16.5 40.4-12.4 27.6 7.5 37.6 22.7 67.2 11.2 19.3-7.5 28.1-18.3 46.4-12.4 29.2 9.4 40.1 23.4 72 11.2 18.1-6.9 27.8-17.2 43.2-12.4 24.9 7.7 36.1 23.2 66.4 12.4 20.3-7.3 29.2-18.3 48-12.4 19.5 6.1 32.4 16.7 53.6 12.4V0H0z' fill='%23000'/%3E%3C/svg%3E");
          -webkit-mask-size: cover;
          opacity: 0.8;
          pointer-events: none;
          filter: drop-shadow(0 0 5px #00f0ff);
        }

        .nav-link {
          position: relative;
          color: rgba(255,255,255,0.8);
          transition: all 0.3s ease;
        }
        .nav-link:hover {
          color: #fff;
          text-shadow: 0 0 10px rgba(0, 240, 255, 0.8);
        }
      `}</style>

      <nav className="ice-container relative mx-4 flex w-full max-w-6xl items-center justify-between rounded-2xl px-6 py-4 md:px-10">
        {/* --- LOGO --- */}
        <div className="flex items-center gap-3 shrink-0 z-20">
          <div className="relative">
            {/* Glow effect behind logo */}
            <div className="absolute inset-0 bg-cyan-400/30 blur-lg rounded-full"></div>
            <img
              src={logo}
              alt="BrainFreeze"
              className="relative h-12 w-12 md:h-14 md:w-14 object-contain drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]"
            />
          </div>
          <span className="hidden md:block text-2xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-100 to-cyan-500 drop-shadow-md">
            BrainFreeze
          </span>
        </div>

        {/* --- NAVIGATION LINKS (DESKTOP) --- */}
        <div className="hidden md:flex items-center gap-10 z-20">
          {["Home", "About", "Services", "Contact"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="nav-link text-base font-semibold uppercase tracking-widest hover:scale-105"
            >
              {item}
            </a>
          ))}
        </div>

        {/* --- CTA BUTTON --- */}
        <div className="flex items-center gap-4 z-20">
          <Button className="bg-cyan-500/20 hover:bg-cyan-400/40 text-cyan-50 border border-cyan-300/50 px-6 py-5 rounded-xl shadow-[0_0_15px_rgba(0,240,255,0.3)] backdrop-blur-md transition-all duration-300 hover:shadow-[0_0_25px_rgba(0,240,255,0.6)] font-bold tracking-wide">
            DOWNLOAD NOW
          </Button>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-white hover:text-cyan-300">
            <Menu size={28} />
          </button>
        </div>

        {/* --- DRIPPING ICE EFFECT (BOTTOM) --- */}
        <div className="ice-drips"></div>

        {/* --- CRACKED ICE TEXTURE OVERLAY --- */}
        {/* Tämä lisää "naarmuja" jään pintaan */}
        <div
          className="absolute inset-0 rounded-2xl opacity-20 pointer-events-none mix-blend-overlay"
          style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cracked-glass-broken.png")' }}
        ></div>
      </nav>
    </div>
  );
};

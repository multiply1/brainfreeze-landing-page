import React, { useState } from "react";
import { motion } from "framer-motion";
import { BrowserRouter, Link, useLocation } from "react-router-dom";
import { LogOut, Github, Youtube, Instagram, Menu, Twitter, Snowflake, ChevronDown } from "lucide-react";

// --- MOCK COMPONENTS FOR PREVIEW ---
const useAuth = () => ({
  user: null,
  signOut: () => console.log("Sign out clicked"),
});

const Button = ({ className, variant, size, onClick, children }) => {
  // "Jäinen" perustyyli napille (palautettu aiempaan versioon)
  const iceStyle =
    "relative overflow-hidden transition-all duration-300 active:scale-95 font-bold tracking-wider uppercase";

  let specificStyle = "";
  if (variant === "ghost") {
    specificStyle = "text-cyan-100 hover:text-white hover:bg-white/10 p-2 rounded-full";
  } else if (variant === "outline") {
    specificStyle =
      "border border-cyan-400/30 bg-cyan-950/30 text-cyan-100 hover:bg-cyan-400/20 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(34,211,238,0.4)] rounded-md px-6 py-2";
  } else {
    // Default "Primary" Ice Button look
    specificStyle =
      "bg-gradient-to-b from-cyan-400 to-blue-600 text-white shadow-[0_0_20px_rgba(8,145,178,0.6)] hover:brightness-110 rounded-md px-6 py-2 border border-white/20";
  }

  return (
    <button onClick={onClick} className={`${iceStyle} ${specificStyle} ${className}`}>
      {children}
    </button>
  );
};

const Sheet = ({ children }) => <>{children}</>;
const SheetTrigger = ({ children, onClick }) => (
  <div onClick={onClick} className="cursor-pointer inline-block">
    {children}
  </div>
);
const SheetContent = ({ isOpen, onClose, children }) => (
  <div
    className={`fixed inset-y-0 right-0 z-[1000] w-[300px] bg-slate-950/95 backdrop-blur-xl border-l border-cyan-500/30 transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}
  >
    <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white p-2">
      ✕
    </button>
    {children}
  </div>
);

const DropdownMenu = ({ children }) => <div className="relative group">{children}</div>;
const DropdownMenuTrigger = ({ children }) => <div className="cursor-pointer flex items-center gap-1">{children}</div>;
const DropdownMenuContent = ({ children }) => (
  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 bg-[#0a192f]/90 backdrop-blur-xl border border-cyan-500/20 rounded-xl shadow-[0_0_30px_rgba(8,145,178,0.2)] p-2 z-50">
    {children}
  </div>
);
const DropdownMenuItem = ({ children }) => (
  <div className="hover:bg-white/10 rounded-lg transition-colors">{children}</div>
);

const HeaderContent = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [isCommunityOpen, setIsCommunityOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isHomePage = location.pathname === "/";
  const isAuthPage = location.pathname === "/auth";

  return (
    <motion.header
      className="fixed top-6 left-0 w-full z-50 pointer-events-none flex justify-center px-4"
      initial={isHomePage ? { y: -100, opacity: 0 } : { y: 0, opacity: 1 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div
        className="
        pointer-events-auto
        relative flex items-center justify-between
        w-full max-w-6xl
        px-6 py-3 md:px-8 md:py-4
      "
      >
        {/* LOGO */}
        <div className="flex items-center gap-4 shrink-0">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <Snowflake className="h-10 w-10 text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)] group-hover:rotate-180 transition-transform duration-700" />
            </div>

            <div className="flex flex-col md:block leading-tight">
              <span className="text-xl md:text-2xl font-bold tracking-wide text-white drop-shadow-sm">Brain</span>
              <span className="text-xl md:text-2xl font-bold tracking-wide text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)] ml-0 md:ml-1">
                Freeze
              </span>

              <span className="hidden md:inline-block ml-2 text-[10px] tracking-wider text-cyan-200/60 uppercase border border-cyan-500/30 rounded px-1">
                Beta
              </span>
            </div>
          </Link>
        </div>

        {/* NAVIGAATIO (Desktop) */}
        {!isAuthPage && (
          <div className="hidden md:flex items-center gap-8 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <Link
              to="/premium"
              className="text-sm font-bold text-cyan-100/70 uppercase tracking-wider transition-all duration-300 hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"
            >
              Pricing
            </Link>

            <Link
              to="/about"
              className="text-sm font-bold text-cyan-100/70 uppercase tracking-wider transition-all duration-300 hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"
            >
              About
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger>
                <span className="text-sm font-bold text-cyan-100/70 uppercase tracking-wider transition-all duration-300 hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] flex items-center gap-1">
                  Community <ChevronDown className="w-3 h-3" />
                </span>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <a
                    href="https://github.com/multiplynow"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-2 text-cyan-100 hover:text-white"
                  >
                    <Github className="h-4 w-4" /> <span>GitHub</span>
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <a
                    href="https://x.com/multiplynow1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-2 text-cyan-100 hover:text-white"
                  >
                    <Twitter className="h-4 w-4" /> <span>X</span>
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <a
                    href="https://youtube.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-2 text-cyan-100 hover:text-white"
                  >
                    <Youtube className="h-4 w-4" /> <span>YouTube</span>
                  </a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        {/* ACTIONS */}
        <div className="flex items-center gap-4 shrink-0">
          {/* Desktop Actions */}
          {!isAuthPage && (
            <div className="hidden md:block">
              {user ? (
                <Button variant="outline" onClick={signOut}>
                  <LogOut className="h-4 w-4 mr-2 inline" />
                  Sign Out
                </Button>
              ) : (
                <Link to="/auth">
                  <Button className="shadow-[0_0_20px_rgba(8,145,178,0.5)] border-cyan-200/30">DOWNLOAD NOW</Button>
                </Link>
              )}
            </div>
          )}

          {/* Mobiili Menu */}
          <Sheet>
            <SheetTrigger onClick={() => setIsMobileMenuOpen(true)}>
              <div className="md:hidden p-2 text-cyan-100 hover:bg-white/10 rounded-full transition-colors">
                <Menu className="h-6 w-6" />
              </div>
            </SheetTrigger>

            <SheetContent isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)}>
              <div className="flex flex-col gap-8 mt-12 px-6">
                {/* Logo Mobiilissa */}
                <div className="flex items-center gap-3 mb-4">
                  <Snowflake className="h-8 w-8 text-cyan-400" />
                  <span className="text-xl font-bold text-white">
                    Brain<span className="text-cyan-400">Freeze</span>
                  </span>
                </div>

                {/* Mobiili Linkit */}
                <div className="flex flex-col gap-4">
                  {user ? (
                    <Button variant="outline" onClick={signOut} className="w-full justify-start">
                      <LogOut className="h-4 w-4 mr-2" /> Sign Out
                    </Button>
                  ) : (
                    !isAuthPage && (
                      <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button className="w-full">DOWNLOAD NOW</Button>
                      </Link>
                    )
                  )}

                  <div className="h-px bg-white/10 my-2" />

                  <Link
                    to="/about"
                    className="text-lg font-medium text-cyan-100 hover:text-white"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    About Us
                  </Link>
                  <Link
                    to="/premium"
                    className="text-lg font-medium text-cyan-100 hover:text-white"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Pricing
                  </Link>

                  {/* Mobiili Community Toggle */}
                  <div>
                    <button
                      onClick={() => setIsCommunityOpen(!isCommunityOpen)}
                      className="flex items-center justify-between w-full text-lg font-medium text-cyan-100 hover:text-white"
                    >
                      Community
                      <ChevronDown className={`w-5 h-5 transition-transform ${isCommunityOpen ? "rotate-180" : ""}`} />
                    </button>

                    {isCommunityOpen && (
                      <div className="mt-4 pl-4 border-l border-cyan-500/30 flex flex-col gap-4">
                        <a
                          href="https://github.com"
                          className="flex items-center gap-3 text-cyan-200/70 hover:text-white"
                        >
                          <Github className="h-5 w-5" /> GitHub
                        </a>
                        <a href="https://x.com" className="flex items-center gap-3 text-cyan-200/70 hover:text-white">
                          <Twitter className="h-5 w-5" /> X
                        </a>
                        <a
                          href="https://instagram.com"
                          className="flex items-center gap-3 text-cyan-200/70 hover:text-white"
                        >
                          <Instagram className="h-5 w-5" /> Instagram
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <div className="bg-slate-900 min-h-screen w-full text-white">
        <HeaderContent />
        <div className="pt-40 px-6 max-w-4xl mx-auto opacity-50 text-center">
          <p className="text-xl mb-4">
            Scroll down to see the header effect (if implemented) or resize window for mobile view.
          </p>
          <div className="h-[1000px] bg-gradient-to-b from-cyan-900/10 to-transparent rounded-xl"></div>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;

const navLinks = [
  { label: "HOME", href: "#home" },
  { label: "ABOUT", href: "#about" },
  { label: "CONTACT", href: "#contact" }
];

const cards = [
  {
    title: "BrainFreeze Routines",
    description: "Structured mental cooldowns to sharpen focus and reset your momentum."
  },
  {
    title: "Mental Temperature",
    description: "Measure your mental heat level and cool it down before burnout hits."
  },
  {
    title: "Freeze Streaks",
    description: "Stack consistent deep-work streaks and keep them frozen in place."
  }
];

const Index = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.15),_transparent_40%)]" aria-hidden />

      <header className="relative z-10 px-4 pt-8" id="home">
        <div
          className="mx-auto flex h-28 max-w-6xl items-center justify-center overflow-hidden rounded-full shadow-[0_0_35px_rgba(59,130,246,0.35)]"
          style={{
            backgroundImage: "url('/hero%20full%20ice.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        >
          <nav className="flex items-center gap-10 text-lg font-bold tracking-wide text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.45)]">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="transition-transform duration-200 hover:scale-105"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex max-w-5xl flex-col items-center gap-12 px-4 pb-20 pt-16 text-center">
        <section className="space-y-6">
          <h1 className="text-4xl font-black leading-tight drop-shadow-[0_6px_18px_rgba(0,0,0,0.5)] md:text-6xl">
            FREEZE YOUR BRAIN, NOT YOUR FLOW.
          </h1>
          <p className="mx-auto max-w-3xl text-lg text-sky-100/80 md:text-xl">
            Create a chill workspace with frosted UI elements that blend crystal clarity with icy precision. Every element here sits directly on the ice artwork—no opaque boxes in the way.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <button
              className="relative flex min-h-[4.5rem] min-w-[14rem] items-center justify-center px-10 text-lg font-extrabold tracking-[0.2em] text-white drop-shadow-[0_4px_18px_rgba(0,0,0,0.55)]"
              style={{
                backgroundImage: "url('/download%20nappi%20icy.jpg')",
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                border: "none"
              }}
            >
              DOWNLOAD
            </button>
          </div>
        </section>

        <section id="about" className="w-full">
          <div className="grid gap-8 md:grid-cols-3">
            {cards.map((card) => (
              <div
                key={card.title}
                className="flex min-h-[320px] items-center justify-center rounded-[24px] bg-cover bg-center p-12 text-center shadow-[0_10px_30px_rgba(0,0,0,0.35)] md:p-16"
                style={{
                  backgroundImage: "url('/cards%20brainfreece.jpg')",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover"
                }}
              >
                <div className="space-y-4 text-white drop-shadow-[0_4px_14px_rgba(0,0,0,0.45)]">
                  <h2 className="text-2xl font-bold md:text-3xl">{card.title}</h2>
                  <p className="text-base leading-relaxed text-sky-100/90 md:text-lg">
                    {card.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="contact" className="w-full text-center text-sky-100/70">
          Inspired by the original icy interface—now recreated with layered images and carefully padded content to stay within the clear blue centers.
        </section>
      </main>
    </div>
  );
};

export default Index;
